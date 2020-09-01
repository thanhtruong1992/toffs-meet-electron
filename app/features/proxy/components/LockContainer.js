// @flow

import Button from '@atlaskit/button';
import Textfield from '@atlaskit/textfield';

import React, { Component } from 'react';
import type { Dispatch } from 'redux';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';

import Message from './Message';
import { FieldWrapper, Form, Header, Label } from '../styled';

import { startProxyService, resetProxyService } from '../functions';
import { setProxyStart, setProxyActive, setProxyTimeout, setProxyExit } from '../actions';

type Props = {

    /**
     * Redux dispatch.
     */
    dispatch: Dispatch<*>;

    /**
     * Child nodes.
     */
    children: any;

    /**
     * Display unlock form or child components.
     */
    _unlock: boolean;

    /**
     * Unlock button display mode.
     */
    _unlockBusy: boolean;

    /**
     * Unlock error.
     */
    _unlockError: string;

    /**
     * Proxy service settings.
     */
    _settings: Object;
};

type State = {

    /**
     * Unlock password.
     */
    _password: string;

    /**
     * Timer for proxy service connection timeout.
     */
    _connTimeoutID: ?TimeoutID;
};

/**
 * LockContainer Component.
 */
class LockContainer extends Component<Props, State> {
    /**
     * Initializes a new {@code LockContainer} instance.
     *
     * @inheritdoc
     */
    constructor(props: Props) {
        super(props);

        this.state = {
            _password: '',
            _connTimeoutID: undefined
        };

        // Bind event handlers.
        this._onPasswordChange = this._onPasswordChange.bind(this);
        this._onProxyActive = this._onProxyActive.bind(this);
        this._onProxyExit = this._onProxyExit.bind(this);
        this._onUnlock = this._onUnlock.bind(this);
        this._onUnlockFormSubmit = this._onUnlockFormSubmit.bind(this);
    }

    /**
     * Implements React's {@link Component#componentDidMount()}.
     *
     * @returns {void}
     */
    componentDidMount() {
        window.jitsiNodeAPI.ipc.on('proxy-exit', this._onProxyExit);
        window.jitsiNodeAPI.ipc.on('proxy-active', this._onProxyActive);
    }

    /**
     * Stop all timers and handlers when unmounting.
     *
     * @returns {voidd}
     */
    componentWillUnmount() {
        clearTimeout(this.state._connTimeoutID);
        window.jitsiNodeAPI.ipc.removeListener('proxy-active', this._onProxyActive);
        window.jitsiNodeAPI.ipc.removeListener('proxy-exit', this._onProxyExit);
    }

    /**
     * Render function of component.
     *
     * @returns {ReactElement}
     */
    render() {
        return this.props._unlock ? this.props.children : this._renderUnlockForm();
    }

    _onProxyActive: (*) => void;

    /* eslint-disable no-unused-vars */
    /**
     * Method that handles event when proxy becomes active.
     *
     * @param {Object} event - Message event.
     * @returns {void}
     */
    _onProxyActive(event) {
        clearTimeout(this.state._connTimeoutID);
        this.props.dispatch(setProxyActive());
    }
    /* eslint-enable no-unused-vars */

    _onProxyExit: (*) => void;

    /* eslint-disable no-unused-vars */
    /**
     * Handler when proxy service exits.
     *
     * @param {Object} event - Message event.
     * @param {string} result - Proxy exit result.
     *
     * @returns {void}
     */
    _onProxyExit(event, result) {
        clearTimeout(this.state._connTimeoutID);
        this.props.dispatch(setProxyExit(result));
        this.props.dispatch(push('/'));
    }
    /* eslint-enable no-unused-vars */

    _onUnlockFormSubmit: (*) => void;

    /**
     * Prevents submission of the form and delegates the unlock logic.
     *
     * @param {Event} event - Event by which this function is called.
     * @returns {void}
     */
    _onUnlockFormSubmit(event: Event) {
        event.preventDefault();
        this._onUnlock();
    }

    _onUnlock: () => void;

    /**
     * Handle unlock button click.
     *
     * @returns {void}
     */
    _onUnlock() {
        if (!this.props._unlock && !this.props._unlockBusy) {
            startProxyService(this.props._settings, this.state._password);
            this.props.dispatch(setProxyStart());

            const timeoutID = setTimeout(() => {
                clearTimeout(this.state._connTimeoutID);
                this.props.dispatch(setProxyTimeout());
                resetProxyService();
            }, 30000);

            this.setState({
                _password: '',
                _connTimeoutID: timeoutID
            });
        }
    }

    _onPasswordChange: (*) => void;

    /**
     * Keep password input value and password in state in sync.
     *
     * @param {SyntheticInputEvent<HTMLInputElement>} event - Event by which
     * this function is called.
     * @returns {void}
     */
    _onPasswordChange(event: SyntheticInputEvent<HTMLInputElement>) {
        this.setState({ _password: event.currentTarget.value });
    }

    /**
     * Return error message if there is an error during the unlock process.
     *
     * @returns {void}
     */
    _renderUnlockErrorMessage() {
        switch (this.props._unlockError) {
        case 'fileError':
            return <Message message = 'Unable to open snvs.bin or clnt.bin' />;
        case 'unlockError':
            return <Message message = 'Unable to unlock SNVS' />;
        case 'connectError':
            return <Message message = 'Unable to establish secure connection to concentrator' />;
        case 'disconnected':
            return <Message message = 'Disconnected from concentrator' />;
        case 'unknown':
            return <Message message = 'Proxy service terminated unexpectedly' />;
        default:
            return null;
        }
    }

    /**
     * Renders the unlock form.
     *
     * @returns {ReactElement}
     */
    _renderUnlockForm() {
        return (
            <Header>
                <Form onSubmit = { this._onUnlockFormSubmit }>
                    <Label>{ 'Enter SNVS password to unlock' }</Label>
                    <FieldWrapper>
                        <Textfield
                            autoFocus = { true }
                            onChange = { this._onPasswordChange }
                            type = 'password'
                            value = { this.state._password } />
                        <Button
                            appearance = 'primary'
                            isLoading = { this.props._unlockBusy }
                            onClick = { this._onUnlock }
                            type = 'button'>
                            Unlock
                        </Button>
                    </FieldWrapper>
                </Form>
                { this._renderUnlockErrorMessage() }
            </Header>
        );
    }
}

/**
 * Maps (parts of) the redux state to the React props.
 *
 * @param {Object} state - The redux state.
 * @returns {Props}
 */
function _mapStateToProps(state: Object) {
    return {
        _unlock: state.proxy.proxyState === 'active',
        _unlockBusy: state.proxy.proxyState === 'started',
        _unlockError: state.proxy.lastResult,
        _settings: {
            concAddr: state.settings.concAddr,
            concPort: state.settings.concPort,
            clntPath: state.settings.clntPath,
            snvsPath: state.settings.snvsPath
        }
    };
}

export default connect(_mapStateToProps)(LockContainer);
