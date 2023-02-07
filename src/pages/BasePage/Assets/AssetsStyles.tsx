import styled from "styled-components"
import { MediumRobotoText } from "../../../components/Texts/MainTexts"

export const AssetsWrapper = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    width: 48%;
`

export const AssetsSubWrapper = styled.div`
    display: flex;
    border-radius: 5px;
    background-color: ${props => props.theme.white};
    width: 100%;
    padding: 3rem;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
    margin-bottom: 3rem;
`

export const AssetsTitle = styled(MediumRobotoText)`
    font-size: 2.2rem;
    margin-bottom: 3rem;
    color: ${props => props.theme.black};
`

export const AssetsSubtitle = styled(MediumRobotoText)`
    margin-top: 2.5rem;
    font-size: 1.8rem;
    color: ${props => props.theme.grayLight};
`