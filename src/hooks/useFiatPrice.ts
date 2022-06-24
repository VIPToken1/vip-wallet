import fromExponential from 'from-exponential';
import { useAppSelector } from './useReduxHooks';
import { BINANCE_COIN } from 'constants/index';
import { parseWalletBalance } from 'utils/chain';

type ICurrency = {
  conversionRate: number;
  currencyCode: string;
  currencyName: string;
  currencySign: string;
  id: string;
};

const useFiatPrice = (coin?: string) => {
  if (!coin) {
    coin = BINANCE_COIN;
  }
  const prices = useAppSelector(state => state.currency.data);
  const { currencyList: allCurrencies = [], defaultCurrency } = useAppSelector(
    state => state.user
  ) as { currencyList: ICurrency[]; defaultCurrency: ICurrency };

  const defaultCurrencyCode =
    defaultCurrency?.currencyCode?.toLowerCase() || 'usd';

  const currencySign = defaultCurrency?.currencySign || '$';

  let currentPrice = prices[coin]?.[defaultCurrencyCode];

  const calculateCryptoToFiat = (
    balance: string,
    crypto: string = BINANCE_COIN
  ) => {
    if (!balance) {
      // console.warn('Please provide balance to calculate fiat price');
      return;
    }
    if (crypto) {
      currentPrice = prices[crypto]?.[defaultCurrencyCode];
    }
    if (!currentPrice) {
      currentPrice = prices[crypto]?.usd * defaultCurrency.conversionRate;
    }
    const covertedValue = parseWalletBalance(balance) * currentPrice;
    return covertedValue.toFixed(2);
  };

  const getConversionRate = (
    amount: number | string,
    currencyCode?: string,
    decimals: number = 2
  ) => {
    if (!amount) {
      return;
    }
    let conversionRate = defaultCurrency.conversionRate;
    if (currencyCode) {
      const currency = allCurrencies?.find(
        (c: ICurrency) => c.currencyCode === currencyCode
      );
      if (currency) {
        conversionRate = currency.conversionRate;
      }
    }
    const isExponential = amount.toString().includes('e');
    if (isExponential) {
      decimals = 12;
      amount = fromExponential(amount);
    }
    return decimals > 0
      ? (Number(amount) * conversionRate).toFixed(decimals)
      : Number(amount) * conversionRate;
  };

  return {
    calculateCryptoToFiat,
    getConversionRate,
    allPrices: prices,
    [coin]: currentPrice,
    currencySign
  };
};

export default useFiatPrice;
