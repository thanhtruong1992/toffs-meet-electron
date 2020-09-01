/**
 * The type of (redux) action that starts proxy.
 *
 * @type {
 *     type: PROXY_START
 * }
 */
export const PROXY_START = Symbol('PROXY_START');

/**
 * The type of (redux) action that is triggered when proxy
 * becomes active.
 *
 * @type {
 *     type: PROXY_ACTIVE
 * }
 */
export const PROXY_ACTIVE = Symbol('PROXY_ACTIVE');

/**
 * The type of (redux) action that is triggered when a timeout
 * occurs waiting for proxy to become active.
 *
 * @type {
 *     type: PROXY_TIMEOUT
 * }
 */
export const PROXY_TIMEOUT = Symbol('PROXY_TIMEOUT');

/**
 * The type of (redux) action that is triggered when proxy exits.
 *
 * @type {
 *     type: PROXY_EXIT,
 *     result: string
 * }
 */
export const PROXY_EXIT = Symbol('PROXY_EXIT');
