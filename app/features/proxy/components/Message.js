// @flow

import React, { Component } from 'react';

import ErrorIcon from '@atlaskit/icon/glyph/error';
import { MessageWrapper, MessageContent } from '../styled';

type Props = {

    /**
     * Message to show.
     */
    message: string;
};

/**
 * Message component.
 */
class Message extends Component<Props> {

    /**
     * Renders the Message compnent.
     *
     * @returns {ReactElement}
     */
    render() {
        return (
            <MessageWrapper>
                <ErrorIcon primaryColor = { 'red' } />
                <MessageContent>{ this.props.message }</MessageContent>
            </MessageWrapper>
        );
    }
}

export default Message;
