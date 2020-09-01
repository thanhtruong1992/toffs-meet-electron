// @flow

import {
    SET_ALWAYS_ON_TOP_WINDOW_ENABLED,
    SET_AUDIO_MUTED,
    SET_EMAIL,
    SET_NAME,
    SET_SERVER_URL,
    SET_SERVER_TIMEOUT,
    SET_VIDEO_MUTED,
    SET_SNVS_PATH,
    SET_CLNT_PATH,
    SET_CONC_ADDR,
    SET_CONC_PORT,
    SET_UNLOCK_PASSWORD
} from './actionTypes';

import { normalizeServerURL } from '../utils';

/**
 * Set the email of the user.
 *
 * @param {string} email - Email of the user.
 * @returns {{
 *     type: SET_EMAIL,
 *     email: string
 * }}
 */
export function setEmail(email: string) {
    return {
        type: SET_EMAIL,
        email
    };
}

/**
 * Set the name of the user.
 *
 * @param {string} name - Name of the user.
 * @returns {{
 *     type: SET_NAME,
 *     name: string
 * }}
 */
export function setName(name: string) {
    return {
        type: SET_NAME,
        name
    };
}

/**
 * Set Server URL.
 *
 * @param {string} serverURL - Server URL.
 * @returns {{
 *     type: SET_SERVER_URL,
 *     serverURL: ?string
 * }}
 */
export function setServerURL(serverURL: string) {
    return {
        type: SET_SERVER_URL,
        serverURL: normalizeServerURL(serverURL)
    };
}

/**
 * Set Server Timeout.
 *
 * @param {string} serverTimeout - Server Timeout.
 * @returns {{
 *     type: SET_SERVER_TIMEOUT,
 *     serverTimeout: ?number
 * }}
 */
export function setServerTimeout(serverTimeout: number) {
    return {
        type: SET_SERVER_TIMEOUT,
        serverTimeout
    };
}

/**
 * Set start with audio muted.
 *
 * @param {boolean} startWithAudioMuted - Whether to start with audio muted.
 * @returns {{
 *     type: SET_AUDIO_MUTED,
 *     startWithAudioMuted: boolean
 * }}
 */
export function setStartWithAudioMuted(startWithAudioMuted: boolean) {
    return {
        type: SET_AUDIO_MUTED,
        startWithAudioMuted
    };
}

/**
 * Set start with video muted.
 *
 * @param {boolean} startWithVideoMuted - Whether to start with video muted.
 * @returns {{
 *     type: SET_VIDEO_MUTED,
 *     startWithVideoMuted: boolean
 * }}
 */
export function setStartWithVideoMuted(startWithVideoMuted: boolean) {
    return {
        type: SET_VIDEO_MUTED,
        startWithVideoMuted
    };
}


/**
 * Set window always on top.
 *
 * @param {boolean} alwaysOnTopWindowEnabled - Whether to set AlwaysOnTop Window Enabled.
 * @returns {{
 *     type: SET_ALWAYS_ON_TOP_WINDOW_ENABLED,
 *     alwaysOnTopWindowEnabled: boolean
 * }}
 */
export function setWindowAlwaysOnTop(alwaysOnTopWindowEnabled: boolean) {
    return {
        type: SET_ALWAYS_ON_TOP_WINDOW_ENABLED,
        alwaysOnTopWindowEnabled
    };
}

/**
 * Set SNVS path.
 *
 * @param {string} snvsPath - Path to SNVS file.
 * @returns {{
 *     type: SET_SNVS_PATH,
 *     snvsPath: string
 * }}
 */
export function setSnvsPath(snvsPath: string) {
    return {
        type: SET_SNVS_PATH,
        snvsPath
    };
}

/**
 * Set CLNT path.
 *
 * @param {string} clntPath - Path to CLNT file.
 * @returns {{
 *     type: SET_CLNT_PATH,
 *     clntPath: string
 * }}
 */
export function setClntPath(clntPath: string) {
    return {
        type: SET_CLNT_PATH,
        clntPath
    };
}

/**
 * Set concentrator address.
 *
 * @param {string} concAddr - Concetrator IP address.
 * @returns {{
 *     type: SET_CONC_ADDR,
 *     concAddr: string
 * }}
 */
export function setConcAddr(concAddr: string) {
    return {
        type: SET_CONC_ADDR,
        concAddr
    };
}

/**
 * Set concentrator port.
 *
 * @param {string} concPort - Concetrator port.
 * @returns {{
 *     type: SET_CONC_PORT,
 *     concPort: string
 * }}
 */
export function setConcPort(concPort: string) {
    return {
        type: SET_CONC_PORT,
        concPort
    };
}

export function setUnlockPassword(unlockPassword: string) {
    return {
        type: SET_UNLOCK_PASSWORD,
        unlockPassword
    };
}
