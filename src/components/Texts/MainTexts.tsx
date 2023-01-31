import styled from "styled-components";

interface TextProps {
    fontSize?: number,
    color?: string
} 

export const RegularInterText = styled.div<TextProps>`
        font-family: "Inter", sans-serif;
        font-weight: 400;
        color: ${props => props.color ? props.color : "#FFF"};
        font-size: ${props => props.fontSize ? props.fontSize : 2.2}rem;
`

export const MediumInterText = styled.div<TextProps>`
        font-family: "Inter", sans-serif;
        font-weight: 500;
        color: ${props => props.color ? props.color : "#FFF"};
        font-size: ${props => props.fontSize ? props.fontSize : 2.2}rem;
`

export const SemiBoldInterText = styled.div<TextProps>`
        font-family: "Inter", sans-serif;
        font-weight: 600;
        color: ${props => props.color ? props.color : "#FFF"};
        font-size: ${props => props.fontSize ? props.fontSize : 2.2}rem;
`
export const BoldInterText = styled.div<TextProps>`
        font-family: "Inter", sans-serif;
        font-weight: 700;
        color: ${props => props.color ? props.color : "#FFF"};
        font-size: ${props => props.fontSize ? props.fontSize : 2.2}rem;
`
