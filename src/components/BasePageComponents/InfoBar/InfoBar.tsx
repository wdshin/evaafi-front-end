import React, { useContext, useEffect, useState } from 'react';
import { BoldRobotoText, MediumRobotoText } from '../../Texts/MainTexts';
import { APYWrapper, APYWrapperSubtitle, APYWrapperTitle, BorrowLine, BorrowLineBack, BorrowLineFront, BorrowLineSubtitle, BorrowLineWrapper, InfoBarWrapper, MoneyInfoWrapper, MoneyWrapper, WhiteSpan, WhiteSpanTwo } from './InfoBarStyled';

export interface InfoBarProps { }


const InfoBar = ({} : InfoBarProps) => { 
    
    return (
        <InfoBarWrapper>
            <MoneyInfoWrapper>
                <MoneyWrapper>
                    <MediumRobotoText>Supply Balance</MediumRobotoText>
                    <BoldRobotoText><WhiteSpan>$0</WhiteSpan>.0000000</BoldRobotoText>
                </MoneyWrapper>
                <APYWrapper>
                    <APYWrapperTitle>NET APY</APYWrapperTitle>
                    <APYWrapperSubtitle>...</APYWrapperSubtitle>
                </APYWrapper>
                <MoneyWrapper>
                    <MediumRobotoText>Borrow Balance</MediumRobotoText>
                    <BoldRobotoText><WhiteSpan>$0</WhiteSpan>.0000000</BoldRobotoText>
                </MoneyWrapper>
            </MoneyInfoWrapper>
            <BorrowLineWrapper>
                <BorrowLineSubtitle>Supply Limit <WhiteSpanTwo>0%</WhiteSpanTwo></BorrowLineSubtitle>
                <BorrowLine>
                    <BorrowLineBack/>
                    <BorrowLineFront supplyLimit={0}/>
                </BorrowLine>
                <BorrowLineSubtitle>$0.00</BorrowLineSubtitle>
            </BorrowLineWrapper>
        </InfoBarWrapper>
    )
}

export default InfoBar;