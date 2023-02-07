import styled from "styled-components";
import { BoldRobotoText, MediumRobotoText } from "../../Texts/MainTexts";

export const InfoBarWrapper = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    width: 90%;
    margin-top: 2.5rem;
`

export const MoneyInfoWrapper = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
`

export const MoneyWrapper = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    ${MediumRobotoText} {
        color: ${props => props.theme.blue};
        font-size: 1.6rem;
    }

    ${BoldRobotoText} {
        color: ${props => props.theme.gray};
        font-size: 2.4rem;
    }
`
export const WhiteSpan = styled.span`
    color: ${props => props.theme.white};
    font-size: 2.4rem;
`
export const WhiteSpanTwo = styled.span`
    color: ${props => props.theme.white};
    font-size: 1.6rem;
`

export const APYWrapper = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 15.5rem;
    height: 15.5rem;
    border: 4px solid ${props => props.theme.blue};
    border-radius: 1000px;
    margin: 0 13.7rem;
`

export const APYWrapperTitle = styled(BoldRobotoText)`
    font-size: 2rem;
    color: ${props => props.theme.gray};
`
export const APYWrapperSubtitle = styled(BoldRobotoText)`
    font-size: 2rem;
    color: ${props => props.theme.white};
`


export const BorrowLineWrapper = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
`
export const BorrowLineSubtitle = styled(MediumRobotoText)`
    font-size: 1.6rem;
    color: ${props => props.theme.gray};
`
export const BorrowLineBack = styled.div`
    position: absolute;
    width: 111rem;
    height: 0.4rem;
    background-color: #1F2428;
`
export const BorrowLineFront = styled.div<{ supplyLimit: number }>`
    position: absolute;
    width: ${props => props.supplyLimit}%;
    height: 0.4rem;
    background-color: ${props => props.theme.blue};
`

export const BorrowLine = styled.div`
    position: relative;
    width: 111rem;
    height: 0.4rem;
    margin: 5rem 2rem;
`

