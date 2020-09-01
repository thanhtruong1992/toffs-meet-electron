/**
 * The type of (redux) action that sets Window always on top.
 *
 * @type {
 *     type: SET_ALWAYS_ON_TOP_WINDOW_ENABLED,
 *     alwaysOnTopWindowEnabled: boolean
 * }
 */
export const SET_ALWAYS_ON_TOP_WINDOW_ENABLED
    = Symbol('SET_ALWAYS_ON_TOP_WINDOW_ENABLED');

/**
 * The type of (redux) action that sets Start with Audio Muted.
 *
 * @type {
 *     type: SET_AUDIO_MUTED,
 *     startWithAudioMuted: boolean
 * }
 */
export const SET_AUDIO_MUTED = Symbol('SET_AUDIO_MUTED');

/**
 * The type of (redux) action that sets the email of the user.
 *
 * @type {
 *     type: SET_EMAIL,
 *     email: string
 * }
 */
export const SET_EMAIL = Symbol('SET_EMAIL');

/**
 * The type of (redux) action that sets the name of the user.
 *
 * @type {
 *     type: SET_NAME,
 *     name: string
 * }
 */
export const SET_NAME = Symbol('SET_NAME');

/**
 * The type of (redux) action that sets the Server URL.
 *
 * @type {
 *     type: SET_SERVER_URL,
 *     serverURL: string
 * }
 */
export const SET_SERVER_URL = Symbol('SET_SERVER_URL');

/**
 * The type of (redux) action that sets the Server Timeout.
 *
 * @type {
 *     type: SET_SERVER_TIMEOUT,
 *     serverTimeout: number
 * }
 */
export const SET_SERVER_TIMEOUT = Symbol('SET_SERVER_TIMEOUT');

/**
 * The type of (redux) action that sets Start with Video Muted.
 *
 * @type {
 *     type: SET_VIDEO_MUTED,
 *     startWithVideoMuted: boolean
 * }
 */
export const SET_VIDEO_MUTED = Symbol('SET_VIDEO_MUTED');

/**
 * The type of (redux) action that sets SNVS path.
 *
 * @type {
 *     type: SET_SNVS_PATH,
 *     snvsPath: string
 * }
 */
export const SET_SNVS_PATH = Symbol('SET_SNVS_PATH');

/**
 * The type of (redux) action that sets CLNT path.
 *
 * @type {
 *     type: SET_CLNT_PATH,
 *     clntPath: string
 * }
 */
export const SET_CLNT_PATH = Symbol('SET_CLNT_PATH');

/**
 * The type of (redux) action that sets concentrator address.
 *
 * @type {
 *     type: SET_CONC_ADDR,
 *     concAddr: string
 * }
 */
export const SET_CONC_ADDR = Symbol('SET_CONC_ADDR');

/**
 * The type of (redux) action that sets concentrator port.
 *
 * @type {
 *     type: SET_CONC_PORT
 *     concPort: string
 * }
 */
export const SET_CONC_PORT = Symbol('SET_CONC_PORT');

export const SET_UNLOCK_PASSWORD = Symbol('SET_UNLOCK_PASSWORD');
