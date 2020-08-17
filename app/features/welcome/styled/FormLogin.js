// @flow

import styled from 'styled-components';

export const LoginPage = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    &:after {
        content: "";
        height: 350px;
        position: absolute;
        border-right: 1px solid #ccc;
        width: 1px;
        right: 0;
        top: calc((100% - 350px)/ 2);
    }
`;

export const ButtonLogin = styled.button`
    height: 38px;
    text-align: center;
    background: #0376DA;
    flex: 1;
    border: 0;
    color: #fff;
    font-size: 14px;
    cursor: pointer;
    text-transform: uppercase;
    &:focus {
        outline: none;
    }
`;

export const FormLogin = styled.form`
    min-width: 300px;
    min-height: 250px;
`;

export const DivGroup = styled.div`
    width: 100%;
    display: flex;
    margin-bottom: 20px;
`;

export const DivSVG = styled.div`
    background: #0376DA;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 40px;
    svg {
        fill: #fff;
        width: 15px;
    }
`;


export const TitleLogin = styled.h4`
    font-size: 20px;
    text-transform: uppercase;
    font-weight: 700;
    margin-bottom: 40px;
`;

export const Input = styled.input`
    height: 38px;
    border: none;
    border-radius: 0;
    flex: 1;
    padding: 0;
    padding-left: 10px;
    &:focus {
        outline: none;
    }
`;
