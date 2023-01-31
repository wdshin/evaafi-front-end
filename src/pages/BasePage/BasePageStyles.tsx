import styled from "styled-components";
import { BoldInterText } from "../../components/Texts/MainTexts";

export const BasePageContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    width: 100vw;
    min-height: 100vh;
    background-color: #F9FAFB;
    /* z-index: ; */

    @media only screen and (min-width: 480px) {
        /* width: 100%; */
    }  
`

export const BasePageBackgroundOne = styled.div`
    position: absolute;
    top: 0;
    width: 100vw;
    background-color: #080A0E;
    height: 38vh;
    /* z-index: ; */
`
