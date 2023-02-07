import React, { useContext, useEffect, useState } from 'react';
import Header from '../../components/Header/Header';
import { BasePageBackgroundOne, BasePageContainer, ContentWrapper } from './BasePageStyles';
import InfoBar from '../../components/BasePageComponents/InfoBar/InfoBar';
import Supplies from './Assets/Supplies';
import Borrows from './Assets/Borrows';


export interface BasePageProps { }


const BasePage = ({} : BasePageProps) => { 
    
    return (
        <BasePageContainer>
            <Header/>
            <BasePageBackgroundOne/>
            <InfoBar/>
            <ContentWrapper>
                <Supplies/>
                <Borrows/>
            </ContentWrapper>
        </BasePageContainer>
    )
}

export default BasePage;