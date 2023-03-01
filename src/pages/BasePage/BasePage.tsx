import React, { useContext, useEffect, useState } from 'react';
import Header from '../../components/Header/Header';
import { BasePageBackgroundOne, BasePageContainer, ContentWrapper } from './BasePageStyles';
import InfoBar from '../../components/BasePageComponents/InfoBar/InfoBar';
import Supplies from './Assets/Supplies';
import Borrows from './Assets/Borrows';
import { Dialog } from '@headlessui/react';
import { SupplyModal } from '../../components/Modals/SupplyModal';
import UserContext from '../../state/userState';
import axios from 'axios';


export interface BasePageProps { }


const BasePage = ({} : BasePageProps) => { 
    const userContext = useContext(UserContext);
    useEffect(() => {
        const getData = async () => {
            const toncoinData = await axios.get(` https://api.coingecko.com/api/v3/coins/the-open-network`);
            const toncoinPrice = toncoinData.data.market_data.current_price.usd;
            userContext.userDispatch({ type: 'updateToncoinPrice', payload: toncoinPrice })
        }
        getData();
    }, []);

    return (
        <BasePageContainer>
            <Header/>
            <InfoBar/>
            <ContentWrapper>
                <Supplies/>
                <Borrows/>
            </ContentWrapper>
        </BasePageContainer>
    )
}

export default BasePage;