/**
 * Add your own BSC scan api here
 * @see https://docs.bscscan.com/
 * */
export const BSC_API_KEY = '';

export const version = 'v1';

export const BSC_MAINNET_API_URL = 'https://api.bscscan.com/api';

export const bscScanContractBalance = `${BSC_MAINNET_API_URL}?module=account&action=tokenbalance&tag=latest&apikey=${BSC_API_KEY}`;

export const cryptoToFiat = 'https://api.coingecko.com/api/v3/simple/price';

export const endPoint = {
  authToken: '/authToken',
  terms: `/${version}/cms/content/terms-service`,
  privacy: `/${version}/cms/content/privacy-policy`,
  user: `/${version}/users`,
  listCurrencies: `/${version}/fiat/list?=`,

  // crypto
  coinDetails: `/${version}/crypto/details`,
  lineChart: `/${version}/crypto/charts/market_chart`,
  ohlcChart: `/${version}/crypto/charts/ohlc`,
  contactUs: `${version}/submission/contact`,
  saveTransaction: `/${version}/tx/transaction`,
  getTransactions: `/${version}/tx/transactions`
};
