import React, { useContext, useEffect, useState } from 'react';
import Header from '../../components/Header/Header';
import { BasePageBackgroundOne, BasePageContainer } from './BasePageStyles';


export interface BasePageProps { }


const BasePage = ({} : BasePageProps) => { 
    
    return (
        <BasePageContainer>
            <Header/>
            <BasePageBackgroundOne/>
            
        </BasePageContainer>
    )
}

export default BasePage;