import styled from "styled-components";

interface TextProps {
    fontSize?: number,
    color?: string
} 

export const RegularRobotoText = styled.h1<TextProps>`
        font-family: "Inter", sans-serif;
        font-weight: 400;
        color: ${props => props.color ? props.color : "#FFF"};
        font-size: ${props => props.fontSize ? props.fontSize : 2.2}rem;
`

export const MediumRobotoText = styled.h1<TextProps>`
        font-family: "Inter", sans-serif;
        font-weight: 500;
        color: ${props => props.color ? props.color : "#FFF"};
        font-size: ${props => props.fontSize ? props.fontSize : 2.2}rem;
`

// export const SemiBoldRobotoText = styled.div<TextProps>`
//         font-family: "Inter", sans-serif;
//         font-weight: 600;
//         color: ${props => props.color ? props.color : "#FFF"};
//         font-size: ${props => props.fontSize ? props.fontSize : 2.2}rem;
// `
export const BoldRobotoText = styled.h1<TextProps>`
        font-family: "Inter", sans-serif;
        font-weight: 700;
        color: ${props => props.color ? props.color : "#FFF"};
        font-size: ${props => props.fontSize ? props.fontSize : 2.2}rem;
`
