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
    background: ${props => props.theme.blue};
    border-radius: 5.3px;
    font-size: 1.8rem;
    font-weight: 700;
    padding: 1.2rem 2rem;
    color: #fff;
`

export const AssetCardButton = styled.button<{ left?: number, right?: number,  first?: boolean }>`
    transform: translateY(-50%);
    top: 50%;
    position: absolute;
    right: 0;
    /* right: ${props => props.right && props.right}rem; */
    /* left : ${props => !props.right && 0}rem; */
    color: ${props => props.theme.white};
    background-color: #0381C5;
    border: none;
    border-radius: 5.3px;
    padding: 0.7rem 1.9rem;
    font-size: 1.8rem;
    font-weight: 700;
    color: #fff;
`