import React, { ReactNode } from 'react';
import ReactLoading from 'react-loading';
import styled from 'styled-components';

export interface ILoadingComponentProps {
    children?: ReactNode
}

const LoadingPageContainer = styled.div`
    height: 100vh;
    width: 100vw;

    @media only screen and (min-width: 780px) {
        width: 39rem;
        height: 85rem;
    }
`

const LoadingWrapper = styled.div`
    position: absolute;
    transform: translate(-50%, -50%); 
    top: 50%;  
    left: 50%;

`

const LoadingComponent: React.FunctionComponent<ILoadingComponentProps> = ({children}) => {
    return (
        <LoadingPageContainer>
            <LoadingWrapper>
                <ReactLoading
                    type="bubbles"
                    color={"#0593FF"}
                    height={"5rem"}
                    width={"5rem"}
                    />
            </LoadingWrapper>
        </LoadingPageContainer>
    );
}

export default LoadingComponent;