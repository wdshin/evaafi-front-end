import styled from "styled-components";
import { RegularRobotoText } from "../../Texts/MainTexts";


export const AssetCardWrapper = styled.div`
    position: relative;
    display: flex;
    width: 100%;
    padding: 4.4rem 0rem;
    /* margin: 0.5rem 0rem; */
`

export const AssetCardText = styled(RegularRobotoText)<{ left?: number, right?: number,  first?: boolean }>`
    transform: translateY(-50%);
    top: 50%;
    position: absolute;
    right: ${props => props.right && props.right}rem;
    left : ${props => !props.right && 0}rem;
    text-align: right;
    font-size: 1.8rem;
    color: ${props => props.theme.blackText};
`

export const  AssetWrapper = styled.div<{ left?: number, right?: number,  first?: boolean }>`
    transform: translateY(-50%);
    top: 50%;
    position: absolute;
    right: ${props => props.right && props.right}rem;
    left : ${props => !props.right && 0}rem;
    text-align: right;
    font-size: 1.8rem;
    color: ${props => props.theme.blackText};
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
`

export const AssetCardTextSimple = styled(RegularRobotoText)`
    font-size: 1.8rem;
    color: ${props => props.theme.blackText};
    margin-left: 1.5rem;
`

export const AssetCardLogo = styled.img`
    width: 3.1rem;
    height: 3.1rem;
    object-fit: contain;
`

export const DoubleTextWrapper = styled.div<{ left?: number, right?: number,  first?: boolean }>`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-end;
    transform: translateY(-50%);
    top: 50%;
    position: absolute;
    right: ${props => props.right && props.right}rem;
    left : ${props => !props.right && 0}rem;
`

export const DoubleTextUpper = styled(RegularRobotoText)`
    font-size: 1.8rem;
    color: ${props => props.theme.blackText};
`

export const DoubleTextLower = styled(RegularRobotoText)`
    font-size: 1.8rem;
    color: ${props => props.theme.grayLighter};
`