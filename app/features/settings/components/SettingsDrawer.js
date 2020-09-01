// @flow

import FieldText from '@atlaskit/field-text';
import ArrowLeft from '@atlaskit/icon/glyph/arrow-left';
import { AkCustomDrawer } from '@atlaskit/navigation';
import { SpotlightTarget } from '@atlaskit/onboarding';
import Panel from '@atlaskit/panel';

import React, { Component } from 'react';
import { connect } from 'react-redux';
import type { Dispatch } from 'redux';

import { closeDrawer, DrawerContainer, Logo } from '../../navbar';
import { advenaceSettingsSteps } from '../../onboarding';
import { Form, SettingsContainer, TogglesContainer } from '../styled';
import { setEmail, setName, setSnvsPath, setClntPath, setConcAddr, setConcPort, setUnlockPassword } from '../actions';

import AlwaysOnTopWindowToggle from './AlwaysOnTopWindowToggle';
import ServerURLField from './ServerURLField';
import ServerTimeoutField from './ServerTimeoutField';
import StartMutedToggles from './StartMutedToggles';

type Props = {

    /**
     * Redux dispatch.
     */
    dispatch: Dispatch<*>;

    /**
     * Is the drawer open or not.
     */
    isOpen: boolean;

    /**
     * Email of the user.
     */
    _email: string;

    /**
     * Whether onboarding is active or not.
     */
    _isOnboardingAdvancedSettings: boolean,

    /**
     * Name of the user.
     */
    _name: string;

    /**
     * SNVS path.
     */
    _snvsPath: string;

    /**
     * CLNT path.
     */
    _clntPath: string;

    /**
     * Concentrator IP address.
     */
    _concAddr: string;

    /**
     * Concentrator port.
     */
    _concPort: string;
    _unlockPassword: String;
};

/**
 * Drawer that open when SettingsAction is clicked.
 */
class SettingsDrawer extends Component<Props, *> {
    /**
     * Initializes a new {@code SettingsDrawer} instance.
     *
     * @inheritdoc
     */
    constructor(props) {
        super(props);

        this._onBackButton = this._onBackButton.bind(this);
        this._onEmailBlur = this._onEmailBlur.bind(this);
        this._onEmailFormSubmit = this._onEmailFormSubmit.bind(this);
        this._onNameBlur = this._onNameBlur.bind(this);
        this._onNameFormSubmit = this._onNameFormSubmit.bind(this);
        this._onSnvsPathBlur = this._onSnvsPathBlur.bind(this);
        this._onSnvsPathFormSubmit = this._onSnvsPathFormSubmit.bind(this);
        this._onClntPathBlur = this._onClntPathBlur.bind(this);
        this._onClntPathFormSubmit = this._onClntPathFormSubmit.bind(this);
        this._onConcAddrBlur = this._onConcAddrBlur.bind(this);
        this._onConcAddrFormSubmit = this._onConcAddrFormSubmit.bind(this);
        this._onConcPortBlur = this._onConcPortBlur.bind(this);
        this._onConcPortFormSubmit = this._onConcPortFormSubmit.bind(this);
        this._onUnlockPasswordFormSubmit = this._onUnlockPasswordFormSubmit.bind(this);
        this._onUnlockPasswordBlur = this._onUnlockPasswordBlur.bind(this);
    }

    /**
     * Render function of component.
     *
     * @returns {ReactElement}
     */
    render() {
        return (
            <AkCustomDrawer
                backIcon = { <ArrowLeft label = 'Back' /> }
                isOpen = { this.props.isOpen }
                onBackButton = { this._onBackButton }
                // primaryIcon = { <Logo /> } 
                >
                <DrawerContainer>
                    <SettingsContainer>
                        {/* <SpotlightTarget
                            name = 'name-setting'>
                            <Form onSubmit = { this._onNameFormSubmit }>
                                <FieldText
                                    label = 'Name'
                                    onBlur = { this._onNameBlur }
                                    shouldFitContainer = { true }
                                    type = 'text'
                                    value = { this.props._name } />
                            </Form>
                        </SpotlightTarget>
                        <SpotlightTarget
                            name = 'email-setting'>
                            <Form onSubmit = { this._onEmailFormSubmit }>
                                <FieldText
                                    label = 'Email'
                                    onBlur = { this._onEmailBlur }
                                    shouldFitContainer = { true }
                                    type = 'text'
                                    value = { this.props._email } />
                            </Form>
                        </SpotlightTarget>
                        <TogglesContainer>
                            <SpotlightTarget
                                name = 'start-muted-toggles'>
                                <StartMutedToggles />
                            </SpotlightTarget>
                        </TogglesContainer> */}
                        <Panel
                            header = 'U-Port Settings'
                            isDefaultExpanded = { true }>
                            <SpotlightTarget
                                name = 'snvs-path-setting'>
                                <form onSubmit = { this._onSnvsPathFormSubmit }>
                                    <FieldText
                                        label = 'Location of snvs.bin file'
                                        onBlur = { this._onSnvsPathBlur }
                                        shouldFitContainer = { true }
                                        type = 'text'
                                        value = { this.props._snvsPath } />
                                </form>
                            </SpotlightTarget>
                            <SpotlightTarget
                                name = 'clnt-path-setting'>
                                <form onSubmit = { this._onClntPathFormSubmit }>
                                    <FieldText
                                        label = 'Location of clnt.bin file'
                                        onBlur = { this._onClntPathBlur }
                                        shouldFitContainer = { true }
                                        type = 'text'
                                        value = { this.props._clntPath } />
                                </form>
                            </SpotlightTarget>
                            <SpotlightTarget
                                name = 'unlock-password-setting'>
                                <form onSubmit = { this._onUnlockPasswordFormSubmit }>
                                    <FieldText
                                        label = 'Unlock Password'
                                        onBlur = { this._onUnlockPasswordBlur }
                                        shouldFitContainer = { true }
                                        type = 'password'
                                        value = { this.props._unlockPassword } />
                                </form>
                            </SpotlightTarget>
                            <SpotlightTarget
                                name = 'conc-addr-setting'>
                                <form onSubmit = { this._onConcAddrFormSubmit }>
                                    <FieldText
                                        label = 'Concentrator IP Address'
                                        onBlur = { this._onConcAddrBlur }
                                        shouldFitContainer = { true }
                                        type = 'text'
                                        value = { this.props._concAddr } />
                                </form>
                            </SpotlightTarget>
                            <SpotlightTarget
                                name = 'conc-port-setting'>
                                <form onSubmit = { this._onConcPortFormSubmit }>
                                    <FieldText
                                        label = 'Concentrator Port'
                                        onBlur = { this._onConcPortBlur }
                                        shouldFitContainer = { true }
                                        type = 'text'
                                        value = { this.props._concPort } />
                                </form>
                            </SpotlightTarget>
                        </Panel>
                        {/* <Panel
                            header = 'Advanced Settings'
                            isDefaultExpanded = { this.props._isOnboardingAdvancedSettings }>
                            <SpotlightTarget name = 'server-setting'>
                                <ServerURLField />
                            </SpotlightTarget>
                            <SpotlightTarget name = 'server-timeout'>
                                <ServerTimeoutField />
                            </SpotlightTarget>
                            <TogglesContainer>
                                <SpotlightTarget
                                    name = 'always-on-top-window'>
                                    <AlwaysOnTopWindowToggle />
                                </SpotlightTarget>
                            </TogglesContainer>
                        </Panel> */}
                    </SettingsContainer>
                </DrawerContainer>
            </AkCustomDrawer>
        );
    }


    _onBackButton: (*) => void;

    /**
     * Closes the drawer when back button is clicked.
     *
     * @returns {void}
     */
    _onBackButton() {
        this.props.dispatch(closeDrawer());
    }

    _onEmailBlur: (*) => void;

    /**
     * Updates email in (redux) state when email is updated.
     *
     * @param {SyntheticInputEvent<HTMLInputElement>} event - Event by which
     * this function is called.
     * @returns {void}
     */
    _onEmailBlur(event: SyntheticInputEvent<HTMLInputElement>) {
        this.props.dispatch(setEmail(event.currentTarget.value));
    }

    _onEmailFormSubmit: (*) => void;

    /**
     * Prevents submission of the form and updates email.
     *
     * @param {SyntheticEvent<HTMLFormElement>} event - Event by which
     * this function is called.
     * @returns {void}
     */
    _onEmailFormSubmit(event: SyntheticEvent<HTMLFormElement>) {
        event.preventDefault();

        // $FlowFixMe
        this.props.dispatch(setEmail(event.currentTarget.elements[0].value));
    }

    _onNameBlur: (*) => void;

    /**
     * Updates name in (redux) state when name is updated.
     *
     * @param {SyntheticInputEvent<HTMLInputElement>} event - Event by which
     * this function is called.
     * @returns {void}
     */
    _onNameBlur(event: SyntheticInputEvent<HTMLInputElement>) {
        this.props.dispatch(setName(event.currentTarget.value));
    }

    _onNameFormSubmit: (*) => void;

    /**
     * Prevents submission of the form and updates name.
     *
     * @param {SyntheticEvent<HTMLFormElement>} event - Event by which
     * this function is called.
     * @returns {void}
     */
    _onNameFormSubmit(event: SyntheticEvent<HTMLFormElement>) {
        event.preventDefault();

        // $FlowFixMe
        this.props.dispatch(setName(event.currentTarget.elements[0].value));
    }

    _onSnvsPathBlur: (*) => void;

    /**
     * Updates SNVS path in (redux) state when name is updated.
     *
     * @param {SyntheticInputEvent<HTMLInputElement>} event - Event by which
     * this function is called.
     * @returns {void}
     */
    _onSnvsPathBlur(event: SyntheticInputEvent<HTMLInputElement>) {
        this.props.dispatch(setSnvsPath(event.currentTarget.value));
    }

    _onSnvsPathFormSubmit: (*) => void;

    /**
     * Prevents submission of the form and updates name.
     *
     * @param {SyntheticEvent<HTMLFormElement>} event - Event by which
     * this function is called.
     * @returns {void}
     */
    _onSnvsPathFormSubmit(event: SyntheticEvent<HTMLFormElement>) {
        event.preventDefault();

        // $FlowFixMe
        this.props.dispatch(setSnvsPath(event.currentTarget.elements[0].value));
    }

    _onClntPathBlur: (*) => void;

    /**
     * Updates SNVS path in (redux) state when name is updated.
     *
     * @param {SyntheticInputEvent<HTMLInputElement>} event - Event by which
     * this function is called.
     * @returns {void}
     */
    _onClntPathBlur(event: SyntheticInputEvent<HTMLInputElement>) {
        this.props.dispatch(setClntPath(event.currentTarget.value));
    }

    _onClntPathFormSubmit: (*) => void;

    /**
     * Prevents submission of the form and updates name.
     *
     * @param {SyntheticEvent<HTMLFormElement>} event - Event by which
     * this function is called.
     * @returns {void}
     */
    _onClntPathFormSubmit(event: SyntheticEvent<HTMLFormElement>) {
        event.preventDefault();

        // $FlowFixMe
        this.props.dispatch(setClntPath(event.currentTarget.elements[0].value));
    }

    _onConcAddrBlur: (*) => void;

    /**
     * Updates concentrator address in (redux) state when it is updated.
     *
     * @param {SyntheticInputEvent<HTMLInputElement>} event - Event by which
     * this function is called.
     * @returns {void}
     */
    _onConcAddrBlur(event: SyntheticInputEvent<HTMLInputElement>) {
        this.props.dispatch(setConcAddr(event.currentTarget.value));
    }

    _onConcAddrFormSubmit: (*) => void;

    /**
     * Prevents submission of the form and updates concentrator address.
     *
     * @param {SyntheticEvent<HTMLFormElement>} event - Event by which
     * this function is called.
     * @returns {void}
     */
    _onConcAddrFormSubmit(event: SyntheticEvent<HTMLFormElement>) {
        event.preventDefault();

        // $FlowFixMe
        this.props.dispatch(setConcAddr(event.currentTarget.elements[0].value));
    }

    _onConcPortBlur: (*) => void;

    /**
     * Updates concentrator address in (redux) state when it is updated.
     *
     * @param {SyntheticInputEvent<HTMLInputElement>} event - Event by which
     * this function is called.
     * @returns {void}
     */
    _onConcPortBlur(event: SyntheticInputEvent<HTMLInputElement>) {
        this.props.dispatch(setConcPort(event.currentTarget.value));
    }

    _onConcPortFormSubmit: (*) => void;

    /**
     * Prevents submission of the form and updates concentrator address.
     *
     * @param {SyntheticEvent<HTMLFormElement>} event - Event by which
     * this function is called.
     * @returns {void}
     */
    _onConcPortFormSubmit(event: SyntheticEvent<HTMLFormElement>) {
        event.preventDefault();

        // $FlowFixMe
        this.props.dispatch(setConcPort(event.currentTarget.elements[0].value));
    }
    _onUnlockPasswordBlur: (*) => void;

    /**
     * Updates concentrator address in (redux) state when it is updated.
     *
     * @param {SyntheticInputEvent<HTMLInputElement>} event - Event by which
     * this function is called.
     * @returns {void}
     */
    _onUnlockPasswordBlur(event: SyntheticInputEvent<HTMLInputElement>) {
        this.props.dispatch(setUnlockPassword(event.currentTarget.value));
    }

    _onUnlockPasswordFormSubmit: (*) => void;

    /**
     * Prevents submission of the form and updates concentrator address.
     *
     * @param {SyntheticEvent<HTMLFormElement>} event - Event by which
     * this function is called.
     * @returns {void}
     */
    _onUnlockPasswordFormSubmit(event: SyntheticEvent<HTMLFormElement>) {
        event.preventDefault();

        // $FlowFixMe
        this.props.dispatch(setUnlockPassword(event.currentTarget.elements[0].value));
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
        _email: state.settings.email,
        _isOnboardingAdvancedSettings: !advenaceSettingsSteps.every(i => state.onboarding.onboardingShown.includes(i)),
        _name: state.settings.name,
        _snvsPath: state.settings.snvsPath,
        _clntPath: state.settings.clntPath,
        _concAddr: state.settings.concAddr,
        _concPort: state.settings.concPort,
        _unlockPassword: state.settings.unlockPassword
    };
}

export default connect(_mapStateToProps)(SettingsDrawer);
