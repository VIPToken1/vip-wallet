import axios from 'axios';
import {
  cryptoToFiat,
  endPoint,
  bscScanContractBalance,
  BSC_API_KEY,
  BSC_MAINNET_API_URL
} from './endPoint';

const bscInstance = axios.create({
  baseURL: BSC_MAINNET_API_URL,
  headers: { 'User-Agent': 'Mozilla/5.0' },
  params: { apikey: BSC_API_KEY }
});

export const termsAndCondtion = () => axios.get(endPoint.terms);

export const privacyPolicy = () => axios.get(endPoint.privacy);

export const updateUserApi = (userId: string, data: any) =>
  axios.patch(`${endPoint.user}/${userId}`, data);

export const listCurrenciesApi = () => axios.get(endPoint.listCurrencies);

export const cryptoToFiatApi = (
  coin: string | string[],
  currency: string = 'usd'
) => {
  if (!Array.isArray(coin)) {
    coin = [coin];
  }
  if (coin.indexOf('usd') === -1) {
    coin.push('usd');
  }
  const instance = axios.create({ headers: { Authorization: '' } });
  return instance.get(cryptoToFiat, {
    params: { ids: coin.join(','), vs_currencies: currency }
  });
};

// crypto

export const getContractBalanceApi = (
  walletAddress: string,
  contractAddress: string
) => {
  const instance = axios.create({});
  return instance.get(
    `${bscScanContractBalance}&contractaddress=${contractAddress}&address=${walletAddress}`,
    { headers: { 'User-Agent': 'Mozilla/5.0' } }
  );
};

export const getTransactionHistoryApi = (
  walletAddress: string,
  contractAddress?: string,
  type: 'coin' | 'contract' = 'coin'
) => {
  const params = {
    module: 'account',
    action: 'txlist',
    address: walletAddress,
    // page: 1,
    // offset: 50,
    sort: 'desc',
    startblock: 0,
    endblock: 99999999,
    contractAddress: ''
  };
  if (type === 'contract' && contractAddress) {
    params.action = 'tokentx';
    params.contractAddress = contractAddress;
  }
  return bscInstance.get('/', { params });
};

export const coinDetailsApi = (coin: string) =>
  axios.get(`${endPoint.coinDetails}/${coin}`);

export const lineChartApi = (coin: string, time: string) =>
  axios.get(`${endPoint.lineChart}/${coin}/${time}`);

export const ohlcChartApi = (coin: string, time: string) =>
  axios.get(`${endPoint.ohlcChart}/${coin}/${time}`);

export const contactUsApi = (name: string, email: string, body: string) =>
  axios.post(endPoint.contactUs, { name, email, body });

export const saveTxApi = (tx: any) => axios.post(endPoint.saveTransaction, tx);

export const getTxApi = (walletAddress: string) =>
  axios.get(`${endPoint.getTransactions}/${walletAddress}`);
