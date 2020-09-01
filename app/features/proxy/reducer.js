// @flow

import {
    PROXY_START,
    PROXY_TIMEOUT,
    PROXY_EXIT,
    PROXY_ACTIVE
} from './actionTypes';

type State = {
    lastResult: string,
    proxyState: string,
    timeout: boolean
}

const DEFAULT_STATE = {
    lastResult: '',
    proxyState: 'inactive',
    timeout: false
};

/**
 * Reduces redux actions for proxy.
 *
 * @param {State} state - Current reduced redux state.
 * @param {Object} action - Action which was dispatched.
 * @returns {State} - Updated reduced redux state.
 */
export default (state: State = DEFAULT_STATE, action: Object) => {
    switch (action.type) {
    case PROXY_START:
        return {
            lastResult: '',
            proxyState: 'started',
            timeout: false
        };
    case PROXY_TIMEOUT:
        return {
            ...state,
            timeout: true
        };
    case PROXY_EXIT:
        return {
            ...state,
            lastResult: action.result,
            proxyState: 'inactive'
        };
    case PROXY_ACTIVE:
        return {
            lastResult: '',
            proxyState: 'active',
            timeout: false
        };
    default:
        return state;
    }
};
