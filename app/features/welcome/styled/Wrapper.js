// @flow

import styled from 'styled-components';
import BackgroundImage from '../../../images/background.jpg';

export default styled.div`
    background: url(${BackgroundImage});
    display: grid;
    grid-template-columns: 50% 50%;
    height: 100vh;
`;
