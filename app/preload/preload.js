const createElectronStorage = require('redux-persist-electron-storage');
const { ipcRenderer, shell } = require('electron');
const os = require('os');
const url = require('url');

const jitsiMeetElectronUtils = require('jitsi-meet-electron-utils');

const protocolRegex = /^https?:/i;

/**
 * Opens the given link in an external browser.
 *
 * @param {string} link - The link (URL) that should be opened in the external browser.
 * @returns {void}
 */
function openExternalLink(link) {
    let u;

    try {
        u = url.parse(link);
    } catch (e) {
        return;
    }

    if (protocolRegex.test(u.protocol)) {
        shell.openExternal(link);
    }
}

const whitelistedIpcSendChannels = [
    'protocol-data-msg', 'renderer-ready', 'proxy-start', 'proxy-reset'
];
const whitelistedIpcReceiveChannels = [
    'protocol-data-msg', 'renderer-ready', 'proxy-active', 'proxy-exit'
];

window.jitsiNodeAPI = {
    createElectronStorage,
    osUserInfo: os.userInfo,
    openExternalLink,
    jitsiMeetElectronUtils,
    shellOpenExternal: shell.openExternal,
    ipc: {
        on: (channel, listener) => {
            if (!whitelistedIpcReceiveChannels.includes(channel)) {
                return;
            }

            return ipcRenderer.on(channel, listener);
        },
        send: (channel, data) => {
            if (!whitelistedIpcSendChannels.includes(channel)) {
                return;
            }

            return ipcRenderer.send(channel, data);
        },
        removeListener: (channel, listener) => {
            if (!whitelistedIpcReceiveChannels.includes(channel)) {
                return;
            }

            return ipcRenderer.removeListener(channel, listener);
        }
    }
};
