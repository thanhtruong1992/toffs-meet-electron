// @flow

import {
    PROXY_START,
    PROXY_ACTIVE,
    PROXY_TIMEOUT,
    PROXY_EXIT
} from './actionTypes';

/**
 * Initiate PROXY_START (redux) action.
 *
 * @returns {{
 *     type: PROXY_START
 * }}
 */
export function setProxyStart() {
    return {
        type: PROXY_START
    };
}

/**
 * Initiate PROXY_ACTIVE (redux) action.
 *
 * @returns {{
 *     type: PROXY_ACTIVE
 * }}
 */
export function setProxyActive() {
    return {
        type: PROXY_ACTIVE
    };
}

/**
 * Initiate PROXY_TIMEOUT (redux) action.
 *
 * @returns {{
 *     type: PROXY_TIMEOUT
 * }}
 */
export function setProxyTimeout() {
    return {
        type: PROXY_TIMEOUT
    };
}

/**
 * Initiate PROXY_EXIT (redux) action.
 *
 * @param {string} result - Proxy exit result.
 * @returns {{
 *     type: PROXY_EXIT,
 *     result: string
 * }}
 */
export function setProxyExit(result: string) {
    return {
        type: PROXY_EXIT,
        result
    };
}
