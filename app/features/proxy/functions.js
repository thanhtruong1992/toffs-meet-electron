// @flow

/**
 * Start proxy service through IPC to main process.
 *
 * @param {Object} settings - Proxy service settings.
 * @param {string} password - SNVS password.
 * @returns {void}
 */
export function startProxyService(settings: Object, password: string) {
    window.jitsiNodeAPI.ipc.send('proxy-start', {
        concAddr: settings.concAddr,
        concPort: settings.concPort,
        clntPath: settings.clntPath,
        snvsPath: settings.snvsPath,
        snvsPassword: password
    });
}

/**
 * Reset proxy service through IPC to main process.
 *
 * @returns {void}
 */
export function resetProxyService() {
    window.jitsiNodeAPI.ipc.send('proxy-reset');
}
