import React from 'react';
import { LoginPage, FormLogin, TitleLogin, DivGroup, DivSVG, Input, ButtonLogin } from '../styled';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import EnvelopeSVG from '../../../images/envelope.svg';
import LockAltSVG from '../../../images/lock-alt.svg';


const PremiumMeeting = props => {
    const { t } = props;

    const onSubmit = e => {
        e.preventDefault();
    };

    return (
        <LoginPage>
            <FormLogin onSubmit = { e => onSubmit(e) } >
                <TitleLogin>{t('login.accountLogin')}</TitleLogin>
                <DivGroup>
                    <DivSVG>
                        <EnvelopeSVG />
                    </DivSVG>
                    <Input
                        placeholder = { t('login.enterYourEmail') }
                        type = 'text' />
                </DivGroup>
                <DivGroup>
                    <DivSVG>
                        <LockAltSVG />
                    </DivSVG>
                    <Input
                        placeholder = { t('login.enterYourPassword') }
                        type = 'password' />
                </DivGroup>
                <DivGroup>
                    <ButtonLogin type = 'submit'>{t('login.login')}</ButtonLogin>
                </DivGroup>
            </FormLogin>
        </LoginPage>
    );
};

export default compose(connect(), withTranslation())(PremiumMeeting);
