import styled from "styled-components";
import { RegularRobotoText } from "../../Texts/MainTexts";

export const AssetsDescriptionBarWrapper = styled.div`
    height: 5.1rem;
    width: 100%;
    position: relative;
    border: 2px solid rgba(0, 0, 0, 0.05);
    border-left: 0;
    border-right: 0;
    /* padding: 1rem; */
    

`

export const BorderDivTop = styled.div`
    position: absolute;
    height: 3px;
    width: 100%;
    background-color: rgba(0, 0, 0, 0.05);
    top: 0;
`

export const BorderDivBottom = styled.div`
    position: absolute;
    height: 3px;
    width: 100%;
    background-color: rgba(0, 0, 0, 0.05);
    bottom: 0;
`

export const AssetsDescriptionText = styled(RegularRobotoText)<{ left?: number, right?: number,  first?: boolean }>`
    transform: translateY(-50%);
    top: 50%;
    position: absolute;
    right: ${props => props.right && props.right}rem;
    left : ${props => !props.right && 0}rem;
    text-align: right;
    font-size: 1.8rem;
    color: ${props => props.theme.grayLight};
`