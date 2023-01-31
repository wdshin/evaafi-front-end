import React from 'react';
import styled from 'styled-components';
import { AuthButton } from '../../components/AuthButton/AuthButton';
import { BoldInterText } from '../Texts/MainTexts';
import EvaaLogo from '../../assets/pictures/evaa_logo.png'
import { TonConnectButton } from '@tonconnect/ui-react';
import { useNavigate } from 'react-router';

export interface HeaderProps { 
    width?: string;
}

const HeaderWrapper = styled.div<{width?: string}>`
    z-index: 100;
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: ${props => props.width ? props.width : '90%'};
    padding-top: 2rem;

    @media only screen and (min-width: 480px){
        padding-top: 3rem;
    }
`

const IconWithTextWrapper = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    cursor: pointer;
`

const Image = styled.div`
    background-image: url(${EvaaLogo});
    height: 3.3rem;
    width: 3.3rem;
    margin-right: 1rem;
    background-repeat: no-repeat;
    background-size: contain;
    margin-bottom: 0.5rem;
`

const Header = ({ width } : HeaderProps) => {    
    const navigate = useNavigate();
    return (
        <HeaderWrapper  width={width}>
            <IconWithTextWrapper  onClick={() => navigate("/")}>
                <Image/>
                <BoldInterText color='#FFFFFF'>EVAA</BoldInterText>
            </IconWithTextWrapper>            
            <AuthButton/>
        </HeaderWrapper>
    )
}

export default Header;