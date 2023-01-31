import styled from "styled-components";

export const GrayBtn = styled.button`
    background: #F2F2F2;
    border: 1px solid #F2F2F2;
    border-radius: 10px;
    font-size: 2rem;
    font-weight: 700;
    padding: 1rem 2rem;
`
export const GrayBtnWide = styled.button`
    width: 100%;
    background: #F2F2F2;
    border: 1px solid #F2F2F2;
    border-radius: 10px;
    font-size: 2rem;
    font-weight: 700;
    padding: 1rem 2rem;
`

export const BlueButton  = styled.button<{width?: string}>`
    opacity: ${props => props.disabled ? "0.5" : "1"};
    width: ${props => props.width ? props.width : "100%"};
    background: #0593FF;
    border-radius: 13px;
    font-size: 1.8rem;
    font-weight: 700;
    padding: 1.2rem 2rem;
    color: #fff;
`