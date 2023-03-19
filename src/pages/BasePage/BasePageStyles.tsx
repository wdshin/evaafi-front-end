import styled from "styled-components";

export const BasePageContainer = styled.div`
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    min-height: 100vh;
    /* background-color: ${props => props.theme.light}; */
    background: linear-gradient(
    to top,
    #F9FAFB 0%,
    #F9FAFB 45%,
    #080A0E 45%,
    #080A0E 100%
  );
    /* z-index: 100; */
    @media only screen and (min-width: 480px) {
        /* width: 100%; */
    }  
`

export const BasePageBackgroundOne = styled.div`
    position: absolute;
    top: 0;
    width: 100vw;
    background-color: #080A0E;
    height: 44.2rem;
    /* z-index: 100; */
`

export const ContentWrapper = styled.div`
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    justify-content: space-between;
    width: 90%;
`
