import { Dialog } from "@headlessui/react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import styled from "styled-components";
import { BlueButton } from "../Buttons/Buttons";
import { BoldRobotoText, RegularRobotoText } from "../Texts/MainTexts";
import { XMarkIcon } from '@heroicons/react/20/solid'
import { Token, TokenMap, usePrices } from "../../store/prices";
import { Supply, useBalance} from "../../store/balances";

import { useWallet } from '../../store/wallet';

const DialogStyled = styled(Dialog.Panel)`
    position: relative;
    padding: 4.5rem 3.5rem 21.8rem 3.5rem;
	background: #fff;
    border-radius: 5px;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    height: 59rem;
`

const Title = styled(BoldRobotoText)`
    color: ${props => props.theme.black};
    font-size: 2.2rem;
    align-self: flex-start;
    margin-bottom: 3.4rem;
`

const Subtitle = styled(RegularRobotoText)`
    color: ${props => props.theme.grayLighter};
    font-size: 1.8rem;
    margin-bottom: 0.8rem;
`

const InfoText = styled(RegularRobotoText)`
    color: ${props => props.theme.black};
    font-size: 1.8rem;
`

export const AmountInDollars = styled(Subtitle)`
    font-size: 1.4rem;
    position: absolute;
    // center the text vertically
    top: 53%;
    transform: translateY(-50%);
    right: 2.5rem;

`

const HelpWrapper = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: flex-start;
    position: relative;
`

const InfoWrapper = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: space-between;
    width: 41.7rem;
    padding: 1.4rem 2rem;
    border: 1px solid ${props => props.theme.grayLighter};
    border-radius: 10px;
`

const InfoTextWrapper = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    /* margin-top: 1rem; */
    /* margin-bottom: 1rem; */
`

const ModalBtn = styled(BlueButton)`
    position: absolute; 
    bottom: 3.5rem;
    width: 41.7rem;
`

export const MyStyledInput = styled.input`
    width: 41.7rem;
    height: 5.7rem;
    border-color: ${props => props.theme.grayLighter};
    border-width: 1px;
    border-style: solid;
    border-radius: 10px;
    color: ${props => props.theme.black};
    font-size: 1.8rem;
    padding: 1.5rem 1.5rem;; 
    margin-bottom: 3rem;
    /* margin-top: 1.8rem; */
    outline: none;
`

export const CloseButton = styled(XMarkIcon)`
    position: absolute;
    top: 2.5rem;
    right: 2.5rem;
    width: 3rem;
    height: 3rem;
    cursor: pointer;

`



interface SuppluModalProps {
    close: () => void;
    supply?: Supply;
}

interface FormData {
    price: string;
}

export const SupplyModal = ({ close, supply }: SuppluModalProps) => {
    const { t, i18n } = useTranslation();
    const { register, handleSubmit, watch, formState: { errors, } } = useForm<FormData>();
    const { formatToUsd } = usePrices();
    const { max_ton_supply, max_usdt_supply, apy_ton_supply, apy_usdt_supply } = useBalance();

    const currentToken = supply?.token || Token.TON;
    const {ticker, tokenId} = TokenMap[currentToken];

    const { sendTransaction } = useWallet();

    const tokenAmount = watch("price")
    const click = () => {
        const action = 'supply'
        // @ts-ignore
        const reciver = window.mastersc
        sendTransaction(reciver.toString(), tokenAmount, tokenId, action)
    }
    let maxSupply;
    let apySupply;
    if (currentToken == Token.TON){
        maxSupply = max_ton_supply;
        apySupply = apy_ton_supply;
    }else{
        maxSupply = max_usdt_supply;
        apySupply = apy_usdt_supply;
    }

    return (
        <Dialog.Panel as={DialogStyled}>
            <CloseButton onClick={close} />
            <Title>Supply {ticker}</Title>
            <HelpWrapper>
                <Subtitle>Amount</Subtitle>
                <MyStyledInput maxLength={7}  {...register('price', { required: true, pattern: /^(0|[1-9]\d*)(\.\d+)?$/ })} placeholder="Enter amount" />
                {watch("price") && <AmountInDollars>{formatToUsd(watch("price"), currentToken)}</AmountInDollars>}
            </HelpWrapper>
            <HelpWrapper>
                <Subtitle>Transaction Overview</Subtitle>
                <InfoWrapper>
                    <InfoTextWrapper>
                        <InfoText>MAX</InfoText>
                        <InfoText>{maxSupply} {ticker}</InfoText>
                    </InfoTextWrapper>
                    <InfoTextWrapper>
                        <InfoText>Supply APY</InfoText>
                        <InfoText>{apySupply} %</InfoText>
                    </InfoTextWrapper>
                </InfoWrapper>
            </HelpWrapper>
            <ModalBtn onClick={click}>Supply</ModalBtn>
        </Dialog.Panel>
    )
}
