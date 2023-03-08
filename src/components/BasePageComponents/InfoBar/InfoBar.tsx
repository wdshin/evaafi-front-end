import { BoldRobotoText, MediumRobotoText } from '../../Texts/MainTexts';
import { APYWrapper, APYWrapperSubtitle, APYWrapperTitle, BorrowLine, BorrowLineBack, BorrowLineFront, BorrowLineSubtitle, BorrowLineWrapper, InfoBarWrapper, MoneyInfoWrapper, MoneyWrapper, WhiteSpan, WhiteSpanTwo } from './InfoBarStyled';
import { useBalance } from '../../../store/balances';
import { usePrices, Token } from '../../../store/prices';
import { formatPercent } from '../../../utils';

export interface InfoBarProps { }


const InfoBar = ({} : InfoBarProps) => { 
    const { borrowBalance, supplyBalance, borrowLimitPercent, borrowLimitValue, availableToBorrow } = useBalance();
    const { formatToUsd } = usePrices();
    const [borrowBalanceInt, borrowBalanceFraction] = formatToUsd(borrowBalance, Token.TON).split(".");
    const [supplyBalanceInt, supplyBalanceFraction] = formatToUsd(supplyBalance, Token.TON).split(".");
    
    return (
        <InfoBarWrapper>
            <MoneyInfoWrapper>
                <MoneyWrapper>
                    <MediumRobotoText>Supply Balance</MediumRobotoText>
                    <BoldRobotoText><WhiteSpan>{supplyBalanceInt}</WhiteSpan>.{supplyBalanceFraction}</BoldRobotoText>
                </MoneyWrapper>
                <APYWrapper>
                    <APYWrapperTitle>NET APY</APYWrapperTitle>
                    <APYWrapperSubtitle>...</APYWrapperSubtitle>
                </APYWrapper>
                <MoneyWrapper>
                    <MediumRobotoText>Borrow Balance</MediumRobotoText>
                    <BoldRobotoText><WhiteSpan>{borrowBalanceInt}</WhiteSpan>.{borrowBalanceFraction}</BoldRobotoText>
                </MoneyWrapper>
            </MoneyInfoWrapper>
            <BorrowLineWrapper>
                <BorrowLineSubtitle>Borrow Limit <WhiteSpanTwo>{formatPercent(borrowLimitPercent)}</WhiteSpanTwo></BorrowLineSubtitle>
                <BorrowLine>
                    <BorrowLineBack/>
                    <BorrowLineFront borrowLimit={borrowLimitValue}/>
                </BorrowLine>
                <BorrowLineSubtitle>{formatToUsd(availableToBorrow, Token.TON)}</BorrowLineSubtitle>
            </BorrowLineWrapper>
        </InfoBarWrapper>
    )
}

export default InfoBar;