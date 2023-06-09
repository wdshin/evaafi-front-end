import { Dialog } from "@headlessui/react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import styled from "styled-components";
import { BlueButton } from "../Buttons/Buttons";
import { BoldRobotoText, RegularRobotoText } from "../Texts/MainTexts";
import { XMarkIcon } from '@heroicons/react/20/solid'
import { ArrowLongRightIcon } from '@heroicons/react/20/solid'
import { AmountInDollars } from "./SupplyModal";
import { Token, TokenMap, usePrices } from "../../store/prices";
import { MyBorrow, useBalance } from "../../store/balances";

import { useWallet } from '../../store/wallet';
import { formatPercent } from "../../utils";

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

const InfoTextBlue = styled(InfoText)`
    color: ${props => props.theme.blue};
    display: inline;
`

const ArrowRight = styled(ArrowLongRightIcon)`
    display: inline;
    width: 2.5rem;
    height: 2.5rem;
    color: ${props => props.theme.blue};
    margin-left: 0.5rem;
    margin-right: 0.5rem;
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
    margin-top: 0.3rem;
    margin-bottom: 0.3rem;
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
    borrow?: MyBorrow;
}

interface FormData {
    price: string;
}

export const RepayModal = ({ close, borrow }: SuppluModalProps) => {
    const { maxRepay, borrowLimitPercent, borrowBalance, availableToBorrow } = useBalance();
    const { t, i18n } = useTranslation();
    const { register, handleSubmit, watch, formState: { errors, } } = useForm<FormData>();
    const { formatToUsd } = usePrices();

    const currentToken = borrow?.token || Token.TON;
    const {ticker, tokenId} = TokenMap[currentToken];

    const { sendTransaction } = useWallet();

    const tokenAmount = watch("price")
    const click = () => {
        const action = 'repay'
        // @ts-ignore
        const reciver = window.mastersc
        sendTransaction(reciver.toString(), tokenAmount, tokenId, action)
    }

    return (
        <Dialog.Panel as={DialogStyled}>
            <CloseButton onClick={close} />
            <Title>Repay {ticker}</Title>
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
                        <InfoText>{maxRepay[currentToken]} {ticker}</InfoText>
                    </InfoTextWrapper>
                    <InfoTextWrapper>
                        <InfoText>Borrow Limit Used</InfoText>
                        <InfoText>{borrowLimitPercent * 100} {<ArrowRight />} {formatPercent(Number(parseFloat(borrowLimitPercent.toString()).toFixed(2)))}</InfoText>
                    </InfoTextWrapper>
                    <InfoTextWrapper>
                        <InfoText>Borrow Balance</InfoText>
                        <InfoText>{formatToUsd(borrowBalance)} {<ArrowRight />} {formatToUsd(availableToBorrow)}</InfoText>
                    </InfoTextWrapper>
                </InfoWrapper>
            </HelpWrapper>
            <ModalBtn onClick={click}>Repay</ModalBtn>
        </Dialog.Panel>
    )
}
