/* global __dirname, process */

const {
    BrowserWindow,
    Menu,
    app,
    ipcMain,
    shell
} = require('electron');
const contextMenu = require('electron-context-menu');
const debug = require('electron-debug');
const isDev = require('electron-is-dev');
const windowStateKeeper = require('electron-window-state');
const {
    initPopupsConfigurationMain,
    getPopupTarget,
    setupAlwaysOnTopMain,
    setupPowerMonitorMain,
    setupScreenSharingMain
} = require('jitsi-meet-electron-utils');
const path = require('path');
const URL = require('url');
const config = require('./app/features/config');
const { spawn } = require('child_process');
const { EOL } = require('os');
const fs = require('fs');
const assert = require('assert');
const StateMachine = require('javascript-state-machine');
const LineByLineReader = require('line-by-line');

const showDevTools = Boolean(process.env.SHOW_DEV_TOOLS) || (process.argv.indexOf('--show-dev-tools') > -1);

// We need this because of https://github.com/electron/electron/issues/18214
app.commandLine.appendSwitch('disable-site-isolation-trials');

// https://bugs.chromium.org/p/chromium/issues/detail?id=1086373
app.commandLine.appendSwitch('disable-webrtc-hw-encoding');
app.commandLine.appendSwitch('disable-webrtc-hw-decoding');

// Needed until robot.js is fixed: https://github.com/octalmage/robotjs/issues/580
app.allowRendererProcessReuse = false;

// Enable context menu so things like copy and paste work in input fields.
contextMenu({
    showLookUpSelection: false,
    showSearchWithGoogle: false,
    showCopyImage: false,
    showCopyImageAddress: false,
    showSaveImage: false,
    showSaveImageAs: false,
    showInspectElement: true,
    showServices: false
});

// Enable DevTools also on release builds to help troubleshoot issues. Don't
// show them automatically though.
debug({
    isEnabled: true,
    showDevTools
});

/**
 * When in development mode:
 * - Enable automatic reloads
 */
if (isDev) {
    require('electron-reload')(path.join(__dirname, 'build'));
}

/**
 * The window object that will load the iframe with Jitsi Meet.
 * IMPORTANT: Must be defined as global in order to not be garbage collected
 * acidentally.
 */
let mainWindow = null;

/**
 * Add protocol data
 */
const appProtocolSurplus = `${config.default.appProtocolPrefix}://`;
let rendererReady = false;
let protocolDataForFrontApp = null;


/**
 * Sets the application menu. It is hidden on all platforms except macOS because
 * otherwise copy and paste functionality is not available.
 */
function setApplicationMenu() {
    if (process.platform === 'darwin') {
        const template = [ {
            label: app.name,
            submenu: [
                {
                    role: 'services',
                    submenu: []
                },
                { type: 'separator' },
                { role: 'hide' },
                { role: 'hideothers' },
                { role: 'unhide' },
                { type: 'separator' },
                { role: 'quit' }
            ]
        }, {
            label: 'Edit',
            submenu: [ {
                label: 'Undo',
                accelerator: 'CmdOrCtrl+Z',
                selector: 'undo:'
            },
            {
                label: 'Redo',
                accelerator: 'Shift+CmdOrCtrl+Z',
                selector: 'redo:'
            },
            {
                type: 'separator'
            },
            {
                label: 'Cut',
                accelerator: 'CmdOrCtrl+X',
                selector: 'cut:'
            },
            {
                label: 'Copy',
                accelerator: 'CmdOrCtrl+C',
                selector: 'copy:'
            },
            {
                label: 'Paste',
                accelerator: 'CmdOrCtrl+V',
                selector: 'paste:'
            },
            {
                label: 'Select All',
                accelerator: 'CmdOrCtrl+A',
                selector: 'selectAll:'
            } ]
        }, {
            label: '&Window',
            role: 'window',
            submenu: [
                { role: 'minimize' },
                { role: 'close' }
            ]
        } ];

        Menu.setApplicationMenu(Menu.buildFromTemplate(template));
    } else {
        Menu.setApplicationMenu(null);
    }
}

/**
 * Opens new window with index.html(Jitsi Meet is loaded in iframe there).
 */
function createJitsiMeetWindow() {
    // Application menu.
    setApplicationMenu();

    // Load the previous window state with fallback to defaults.
    const windowState = windowStateKeeper({
        defaultWidth: 800,
        defaultHeight: 600
    });

    // Path to root directory.
    const basePath = isDev ? __dirname : app.getAppPath();

    // URL for index.html which will be our entry point.
    const indexURL = URL.format({
        pathname: path.resolve(basePath, './build/index.html'),
        protocol: 'file:',
        slashes: true
    });

    // Options used when creating the main Jitsi Meet window.
    // Use a preload script in order to provide node specific functionality
    // to a isolated BrowserWindow in accordance with electron security
    // guideline.
    const options = {
        x: windowState.x,
        y: windowState.y,
        width: windowState.width,
        height: windowState.height,
        icon: path.resolve(basePath, './resources/icons/icon_96x96.png'),
        minWidth: 800,
        minHeight: 600,
        show: false,
        webPreferences: {
            experimentalFeatures: true, // Insertable streams, for E2EE.
            nativeWindowOpen: true,
            nodeIntegration: false,
            preload: path.resolve(basePath, './build/preload.js')
        }
    };

    mainWindow = new BrowserWindow(options);
    windowState.manage(mainWindow);
    mainWindow.loadURL(indexURL);

    initPopupsConfigurationMain(mainWindow);
    setupAlwaysOnTopMain(mainWindow);
    setupPowerMonitorMain(mainWindow);
    setupScreenSharingMain(mainWindow, config.default.appName);


    mainWindow.webContents.on('new-window', (event, url, frameName) => {
        const target = getPopupTarget(url, frameName);

        if (!target || target === 'browser') {
            event.preventDefault();
            shell.openExternal(url);
        }
    });
    mainWindow.on('closed', () => {
        mainWindow = null;
    });
    mainWindow.once('ready-to-show', () => {
        mainWindow.show();
    });

    /**
     * This is for windows [win32]
     * so when someone tries to enter something like jitsi-meet://test
     *  while app is closed
     * it will trigger this event below
     */
    if (process.platform === 'win32') {
        handleProtocolCall(process.argv.pop());
    }
}

/**
 * Handler for application protocol links to initiate a conference.
 */
function handleProtocolCall(fullProtocolCall) {
    // don't touch when something is bad
    if (
        !fullProtocolCall
        || fullProtocolCall.trim() === ''
        || fullProtocolCall.indexOf(appProtocolSurplus) !== 0
    ) {
        return;
    }

    const inputURL = fullProtocolCall.replace(appProtocolSurplus, '');

    if (app.isReady() && mainWindow === null) {
        createJitsiMeetWindow();
    }

    protocolDataForFrontApp = inputURL;

    if (rendererReady) {
        mainWindow
            .webContents
            .send('protocol-data-msg', inputURL);
    }
}

/**
 * Force Single Instance Application.
 */
const gotInstanceLock = app.requestSingleInstanceLock();

if (!gotInstanceLock) {
    app.quit();
    process.exit(0);
}

/**
 * teleport SOCKS5 proxy.
 */
const assetPath = isDev ? __dirname : process.resourcesPath;

let proxyExecutable = null;

// Support only windows and linux for now.
if (process.platform === 'win32') {
    proxyExecutable = './assets/teleport-proxy.win32.exe';
} else if (process.platform === 'linux') {
    proxyExecutable = './assets/teleport-proxy.linux';
} else {
    app.quit();
    process.exit(0);
}

const proxyPath = path.resolve(assetPath, proxyExecutable);
let proxyProcess = null;

// halted: reset from renderer or proxy error, waiting for proxy exit.
// stopped: fatal error, waiting for proxy exit.
/* eslint-disable object-property-newline */
const proxyState = new StateMachine({
    init: 'inactive',
    transitions: [
        { name: 'start', from: 'inactive', to: 'started' },
        { name: 'unlockSuccess', from: 'started', to: 'unlocked' },
        { name: 'unlockFailure', from: 'started', to: 'halted' },
        { name: 'bind', from: 'unlocked', to: 'bound' },
        { name: 'activate', from: 'bound', to: 'active' },
        { name: 'reset', from: [ 'unlocked', 'bound', 'active' ], to: 'halted' },
        { name: 'exit', from: [ 'started', 'unlocked', 'bound', 'active', 'halted' ], to: 'inactive' },
        { name: 'stop', from: '*', to: 'stopped' }
    ]
});

const proxyStage = new StateMachine({
    init: 'inactive',
    transitions: [
        { name: 'start', from: 'inactive', to: 'started' },
        { name: 'unlock', from: 'started', to: 'unlocked' },
        { name: 'activate', from: 'unlocked', to: 'active' },
        { name: 'exit', from: '*', to: 'inactive' }
    ]
});
/* eslint-enable object-property-newline */

/**
 * Register handler for proxy app exit.
 */
function registerProxyExitHandler(proxy, event) {
    proxy.on('exit', () => {
        if (proxyState.is('stopped')) {
            app.quit();
        } else {
            proxyState.exit();
            proxyProcess = null;

            let error = null;

            switch (proxyStage.state) {
            case 'started':
                error = 'unlockError';
                break;
            case 'unlocked':
                error = 'connectError';
                break;
            case 'active':
                error = 'disconnected';
                break;
            default:
                error = 'unknown';
                break;
            }

            proxyStage.exit();
            event.reply('proxy-exit', error);
        }
    });
}

/**
 * Register handler for proxy stdout stream.
 */
function registerProxyStdoutHandler(proxy, event) {
    const reader = new LineByLineReader(proxy.stdout);

    reader.on('line', line => {
        if (!proxyState.is('inactive')) {
            try {
                const message = JSON.parse(line);

                switch (message.type) {
                case 'unlock':
                    if (message.unlock === true) {
                        proxyState.unlockSuccess();
                        proxyStage.unlock();
                    } else {
                        proxyState.unlockFailure();
                    }
                    break;
                case 'socks5_bound_addr':
                    proxyState.bind();
                    assert.ok(typeof message.port === 'number', 'Invalid bound port');
                    assert.ok(message.port > 0 && message.port < 65536, 'Invalid bound port');
                    mainWindow.webContents.session.setProxy({
                        proxyRules: `socks5://localhost:${message.port}`
                    });
                    break;
                case 'status':
                    if (message.status === 'active') {
                        proxyState.activate();
                        proxyStage.activate();
                        event.reply('proxy-active');
                    } else {
                        throw new TypeError('Invalid status message');
                    }
                    break;
                default:
                    throw new TypeError('Invalid proxy message');
                }
            } catch (err) {
                console.error(`handleProxyStdout error: ${err.name}: ${err.message}`);
                if (!proxyState.is('halted') && !proxyState.is('stopped')) {
                    proxy.stdin.write(EOL);
                }
                proxyState.stop();
            }
        }
    });
}

/**
 * Spawn proxy application.
 */
function spawnProxy(event, data) {
    const args = [ '-d', '-p', '127.0.0.1', '0', data.snvsPath, data.clntPath, data.concAddr, data.concPort ];

    proxyProcess = spawn(proxyPath, args, { stdio: [ 'pipe', 'pipe', 'ignore' ] });
    proxyProcess.on('error', error => {
        console.error(`Failed to start proxy: ${error}`);
        app.quit();
        process.exit(1);
    });
    registerProxyExitHandler(proxyProcess, event);
    registerProxyStdoutHandler(proxyProcess, event);
}

/**
 * Handler for proxy start request from renderer
 */
function handleProxyStart(event, data) {
    if (proxyState.is('inactive')) {
        // Check filenames before spawning.
        let tempData = {...data};
        tempData.snvsPath = path.resolve(assetPath, tempData.snvsPath);
        tempData.clntPath = path.resolve(assetPath, tempData.clntPath);
        try {
            fs.accessSync(tempData.snvsPath, fs.constants.R_OK);
            fs.accessSync(tempData.clntPath, fs.constants.R_OK);
        } catch (err) {
            event.reply('proxy-exit', 'fileError');

            return;
        }
        spawnProxy(event, tempData);
        proxyProcess.stdin.write(data.snvsPassword + EOL);
        data.snvsPassword = '';
        proxyState.start();
        proxyStage.start();
    }
}

/* eslint-disable no-unused-vars */
/**
 * Handler for proxy reset request from renderer
 */
function handleProxyReset(event, data) {
    switch (proxyState.state) {
    case 'unlocked':
    case 'bound':
    case 'active':
        // request halt by writing ''.
        proxyProcess.stdin.write(EOL);
        proxyState.reset();
        break;
    case 'halted':
        // already waiting for proxy exit.
        // ignore reset request.
        break;
    case 'stopped':
        // stopped by fatal error.
        // already waiting for proxy exit.
        // ignore reset request.
        break;
    case 'inactive':
        // renderer sends reset request right after proxy exit.
        // ignore reset request.
        break;
    default:
        // invalid state.
        console.error(`handleProxyReset error: Invalid state ${proxyState.state}`);
        proxyState.stop();
        break;
    }
}
/* eslint-enable no-unused-vars */

ipcMain.on('proxy-start', handleProxyStart);
ipcMain.on('proxy-reset', handleProxyReset);

/**
 * Run the application.
 */

app.on('activate', () => {
    if (mainWindow === null) {
        createJitsiMeetWindow();
    }
});

app.on('certificate-error',
    // eslint-disable-next-line max-params
    (event, webContents, url, error, certificate, callback) => {
        event.preventDefault();
        callback(true);

        /*
        if (isDev) {
            event.preventDefault();
            callback(true);
        } else {
            callback(false);
        }
        */
    }
);

app.on('ready', createJitsiMeetWindow);

app.on('second-instance', (event, commandLine) => {
    /**
     * If someone creates second instance of the application, set focus on
     * existing window.
     */
    if (mainWindow) {
        mainWindow.isMinimized() && mainWindow.restore();
        mainWindow.focus();

        /**
         * This is for windows [win32]
         * so when someone tries to enter something like jitsi-meet://test
         * while app is opened it will trigger protocol handler.
         */
        handleProtocolCall(commandLine.pop());
    }
});

app.on('window-all-closed', () => {
    switch (proxyState.state) {
    case 'inactive':
        app.quit();
        break;
    case 'started':
    case 'unlocked':
    case 'bound':
    case 'active':
        // request halt by writing ''.
        // move to 'stopped' state so that app will quit
        // once proxy exits.
        proxyProcess.stdin.write(EOL);
        proxyState.stop();
        break;
    default:
        // move to 'stop' state so that app will quit
        // once proxy exits.
        proxyState.stop();
        break;
    }
});

// remove so we can register each time as we run the app.
app.removeAsDefaultProtocolClient(config.default.appProtocolPrefix);

// If we are running a non-packaged version of the app && on windows
if (isDev && process.platform === 'win32') {
    // Set the path of electron.exe and your app.
    // These two additional parameters are only available on windows.
    app.setAsDefaultProtocolClient(
        config.default.appProtocolPrefix,
        process.execPath,
        [ path.resolve(process.argv[1]) ]
    );
} else {
    app.setAsDefaultProtocolClient(config.default.appProtocolPrefix);
}

/**
 * This is for mac [darwin]
 * so when someone tries to enter something like jitsi-meet://test
 * it will trigger this event below
 */
app.on('open-url', (event, data) => {
    event.preventDefault();
    handleProtocolCall(data);
});

/**
 * This is to notify main.js [this] that front app is ready to receive messages.
 */
ipcMain.on('renderer-ready', () => {
    rendererReady = true;
    if (protocolDataForFrontApp) {
        mainWindow
            .webContents
            .send('protocol-data-msg', protocolDataForFrontApp);
    }
});
