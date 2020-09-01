// @flow

import { FieldTextStateless } from '@atlaskit/field-text';
import { SpotlightTarget } from '@atlaskit/onboarding';
import Page from '@atlaskit/page';
import { AtlasKitThemeProvider } from '@atlaskit/theme';

import { generateRoomWithoutSeparator } from 'js-utils/random';
import React, { Component } from 'react';
import { withTranslation } from 'react-i18next';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import { Navbar, openDrawer } from '../../navbar';
import { Onboarding, startOnboarding } from '../../onboarding';
import { RecentList } from '../../recent-list';
import { createConferenceObjectFromURL } from '../../utils';

import { Body, FieldWrapper, Header, Wrapper, FormLogin, TitleLogin, DivGroup, DivSVG, Input, ButtonLogin, Footer } from '../styled';
import PremiumMeeting from './PremiumMeeting';
import HomeLgAltSVG from '../../../images/home-lg-alt.svg';
import CogSVG from '../../../images/cog.svg';
import Setting from '../styled/Setting';
import { SettingsDrawer } from '../../settings';
import { startProxyService, setProxyStart, setProxyTimeout, resetProxyService, setProxyExit, setProxyActive } from '../../proxy';
import Message from '../../proxy/components/Message';
import LoadingComponent from './LoadingComponent';

type Props = {

    /**
     * Redux dispatch.
     */
    dispatch: Dispatch<*>;

    /**
     * React Router location object.
     */
    location: Object;

    /**
     * I18next translate function.
     */
     t: Function;

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

    _password: string;
};

type State = {

    /**
     * Timer for animating the room name geneeration.
     */
    animateTimeoutId: ?TimeoutID,

    /**
     * Generated room name.
     */
    generatedRoomname: string,

    /**
     * Current room name placeholder.
     */
    roomPlaceholder: string,

    /**
     * Timer for re-generating a new room name.
     */
    updateTimeoutId: ?TimeoutID,

    /**
     * URL of the room to join.
     * If this is not a url it will be treated as room name for default domain.
     */
    url: string;

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

    _connTimeoutID: ?TimeoutID;
};

/**
 * Welcome Component.
 */
class Welcome extends Component<Props, State> {
    /**
     * Initializes a new {@code Welcome} instance.
     *
     * @inheritdoc
     */
    constructor(props: Props) {
        super(props);

        // Initialize url value in state if passed using location state object.
        let url = '';

        // Check and parse url if exists in location state.
        if (props.location.state) {
            const { room, serverURL } = props.location.state;

            if (room && serverURL) {
                url = `${serverURL}/${room}`;
            }
        }

        this.state = {
            animateTimeoutId: undefined,
            generatedRoomname: '',
            roomPlaceholder: '',
            updateTimeoutId: undefined,
            url
        };

        // Bind event handlers.
        this._animateRoomnameChanging = this._animateRoomnameChanging.bind(this);
        this._onURLChange = this._onURLChange.bind(this);
        this._onFormSubmit = this._onFormSubmit.bind(this);
        this._onJoin = this._onJoin.bind(this);
        this._updateRoomname = this._updateRoomname.bind(this);
        this._onIconSettingClick = this._onIconSettingClick.bind(this);
        this._onUnlockFile = this._onUnlockFile.bind(this);
        this._onProxyActive = this._onProxyActive.bind(this);
        this._onProxyExit = this._onProxyExit.bind(this);
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
        this._onJoin();
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
    }
    /**
     * Start Onboarding once component is mounted.
     * Start generating randdom room names.
     *
     * NOTE: It autonatically checks if the onboarding is shown or not.
     *
     * @returns {void}
     */
    componentDidMount() {
        this.props.dispatch(startOnboarding('welcome-page'));

        this._updateRoomname();
        window.jitsiNodeAPI.ipc.on('proxy-exit', this._onProxyExit);
        window.jitsiNodeAPI.ipc.on('proxy-active', this._onProxyActive);
    }

    /**
     * Stop all timers when unmounting.
     *
     * @returns {voidd}
     */
    componentWillUnmount() {
        this._clearTimeouts();
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
        return (
            <Page navigation = { <Navbar /> }>
                <AtlasKitThemeProvider mode = 'light'>
                    <Setting onClick = { this._onIconSettingClick }>
                        <CogSVG />
                    </Setting>
                    <Wrapper>
                        <PremiumMeeting />
                        { this._renderHeader() }
                    </Wrapper>
                    <Footer><span>Powered By Toffstech © 2020</span></Footer>
                </AtlasKitThemeProvider>
            </Page>
        );

        // return (
        //     <Page navigation = { <Navbar /> }>
        //         <AtlasKitThemeProvider mode = 'light'>
        //             <Wrapper>
        //                 { this._renderHeader() }
        //                 { this._renderBody() }
        //                 <Onboarding section = 'welcome-page' />
        //             </Wrapper>
        //         </AtlasKitThemeProvider>
        //     </Page>
        // );
    }

    _animateRoomnameChanging: (string) => void;

    /**
     * Animates the changing of the room name.
     *
     * @param {string} word - The part of room name that should be added to
     * placeholder.
     * @private
     * @returns {void}
     */
    _animateRoomnameChanging(word: string) {
        let animateTimeoutId;
        const roomPlaceholder = this.state.roomPlaceholder + word.substr(0, 1);

        if (word.length > 1) {
            animateTimeoutId
                = setTimeout(
                    () => {
                        this._animateRoomnameChanging(
                            word.substring(1, word.length));
                    },
                    70);
        }
        this.setState({
            animateTimeoutId,
            roomPlaceholder
        });
    }

    /**
     * Method that clears timeouts for animations and updates of room name.
     *
     * @private
     * @returns {void}
     */
    _clearTimeouts() {
        clearTimeout(this.state.animateTimeoutId);
        clearTimeout(this.state.updateTimeoutId);
    }

    _onFormSubmit: (*) => void;

    /**
     * Prevents submission of the form and delegates the join logic.
     *
     * @param {Event} event - Event by which this function is called.
     * @returns {void}
     */
    _onFormSubmit(event: Event) {
        event.preventDefault();
        this._onJoin();
    }

    _onJoin: (*) => void;

    /**
     * Redirect and join conference.
     *
     * @returns {void}
     */
    _onJoin() {
        const inputURL = this.state.url || this.state.generatedRoomname;

        const conference = createConferenceObjectFromURL(inputURL);

        // Don't navigate if conference couldn't be created
        if (!conference) {
            return;
        }

        this.props.dispatch(push('/conference', conference));
    }
    
    _onUnlockFile: (*) => void;

    _onUnlockFile() {
        if (!this.props._unlock && !this.props._unlockBusy) {
            startProxyService(this.props._settings, this.props._password);
            this.props.dispatch(setProxyStart());

            const timeoutID = setTimeout(() => {
                clearTimeout(this.state._connTimeoutID);
                this.props.dispatch(setProxyTimeout());
                resetProxyService();
            }, 30000);

            this.setState({
                _connTimeoutID: timeoutID
            });
        }
    }

    _onURLChange: (*) => void;

    /**
     * Keeps URL input value and URL in state in sync.
     *
     * @param {SyntheticInputEvent<HTMLInputElement>} event - Event by which
     * this function is called.
     * @returns {void}
     */
    _onURLChange(event: SyntheticInputEvent<HTMLInputElement>) {
        this.setState({
            url: event.currentTarget.value
        });
    }

    /**
     * Renders the body for the welcome page.
     *
     * @returns {ReactElement}
     */
    _renderBody() {
        return (
            <Body>
                <RecentList />
            </Body>
        );
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
     * Renders the header for the welcome page.
     *
     * @returns {ReactElement}
     */
    _renderHeader() {
        const locationState = this.props.location.state;
        const locationError = locationState && locationState.error;
        const { t } = this.props;

        return (
            <Header>
                <SpotlightTarget name = 'conference-url'>
                    <FormLogin onSubmit = { this._onFormSubmit }>
                        <TitleLogin>{ t('login.freeMeeting') }</TitleLogin>
                        <span>{ t('enterConferenceNameOrUrl') }</span>
                        <DivGroup>
                            <DivSVG>
                                <HomeLgAltSVG />
                            </DivSVG>
                            <Input
                                onChange = { this._onURLChange }
                                placeholder = { this.state.roomPlaceholder }
                                shouldFitContainer = { true }
                                type = 'text'
                                value = { this.state.url } />
                        </DivGroup>
                        { this._renderUnlockErrorMessage() }
                        <DivGroup>
                            <ButtonLogin
                                onClick = { this._onUnlockFile }
                                disabled={this.props._unlockBusy}
                                type = 'submit'>
                                { this.props._unlockBusy && <LoadingComponent />} 
                                { t('go') }
                            </ButtonLogin>
                        </DivGroup>
                    </FormLogin>
                </SpotlightTarget>
            </Header>
        );

        // return (
        //     <Header>
        //         <SpotlightTarget name = 'conference-url'>
        //             <Form onSubmit = { this._onFormSubmit }>
        //                 <Label>{ t('enterConferenceNameOrUrl') } </Label>
        //                 <FieldWrapper>
        //                     <FieldTextStateless
        //                         autoFocus = { true }
        //                         isInvalid = { locationError }
        //                         isLabelHidden = { true }
        //                         onChange = { this._onURLChange }
        //                         placeholder = { this.state.roomPlaceholder }
        //                         shouldFitContainer = { true }
        //                         type = 'text'
        //                         value = { this.state.url } />
        //                     <Button
        //                         appearance = 'primary'
        //                         onClick = { this._onJoin }
        //                         type = 'button'>
        //                         { t('go') }
        //                     </Button>
        //                 </FieldWrapper>
        //             </Form>
        //         </SpotlightTarget>
        //     </Header>
        // );
    }

    _updateRoomname: () => void;

    /**
     * Triggers the generation of a new room name and initiates an animation of
     * its changing.
     *
     * @protected
     * @returns {void}
     */
    _updateRoomname() {
        const generatedRoomname = generateRoomWithoutSeparator();
        const roomPlaceholder = '';
        const updateTimeoutId = setTimeout(this._updateRoomname, 10000);

        this._clearTimeouts();
        this.setState(
            {
                generatedRoomname,
                roomPlaceholder,
                updateTimeoutId
            },
            () => this._animateRoomnameChanging(generatedRoomname));
    }

    _onIconSettingClick: (*) => void;

    /**
     * Open Settings drawer when SettingsButton is clicked.
     *
     * @returns {void}
     */
    _onIconSettingClick() {
        this.props.dispatch(openDrawer(SettingsDrawer));
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
        },
        _password: state.settings.unlockPassword
    };
}

export default compose(connect(_mapStateToProps), withTranslation())(Welcome);
