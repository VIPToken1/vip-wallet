// #region: COINGECKO IDs
export const BINANCE_COIN = 'binancecoin';
export const WrappedBNB = 'wbnb';
export const VIPToken = 'vip-token';
// #endregion

// export const VIP_TOKEN_ADDRESS = '0x195f5c8C91317e8a6D85A6B9c22eeABcD4bdcbce';
// export const VIP_TOKEN_ADDRESS = '0x4Ca57F45D64f6e111695544ad2EFDEAb99Dc0F3d'; // NEW VIP TESTNET
// export const VIP_TOKEN_ADDRESS = '0x435Ea66C0237331822DC71867eB06a6a3036d101'; // NEW VIP TESTNET
export const VIP_TOKEN_ADDRESS = '0x6759565574De509b7725ABb4680020704B3F404e'; // MAINNET
export const VIP_TOKEN_MAINNET = '0x6759565574De509b7725ABb4680020704B3F404e';
export const TEST_TOKEN_ADDRESS = '0x3f2FD5a7E3194b5F11be2d1aC3CF9653b0F72d7a';
export const BNB_ADDRESS = '0xB8c77482e45F1F44dE1745F52C74426C631bDD52';

// export const WBNB_ADDRESS = '0xae13d989daC2f0dEbFf460aC112a837C89BAa7cd'; // TESTNET
export const WBNB_ADDRESS = '0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c'; // MAINNET

// export const ROUTER = '0x9Ac64Cc6e4415144C455BD8E4837Fea55603e5c3'; // TESTNET
// export const ROUTER = '0xd99d1c33f9fc3444f8101754abc46c52416550d1'; // TESTNET
export const ROUTER = '0x10ED43C718714eb63d5aA57B78B54704E256024E'; // MAINNET

export const TOKENS = {
  VIP: {
    title: 'VIP Token',
    name: 'viptoken',
    id: 'vip-token',
    symbol: 'VIP',
    icon: 'vipIcon',
    decimals: 9,
    address: VIP_TOKEN_ADDRESS,
    type: 'contract'
  },
  BNB: {
    title: 'Binance Coin',
    name: 'binancecoin',
    id: 'binancecoin',
    symbol: 'BNB',
    icon: 'bnbIcon',
    decimals: 18,
    type: 'coin'
  }
  // WBNB: {
  //   title: 'Wrapped BNB',
  //   name: 'wbnb',
  //   id: 'wbnb',
  //   symbol: 'WBNB',
  //   icon: 'bnbIcon',
  //   decimals: 18,
  //   address: WBNB_ADDRESS,
  //   type: 'contract'
  // }
};

/**
 * Less than 1B tokens in the wallet: VIP Level: **Standard**,
 *
 * 1B and more tokens in the wallet, but less than 10B: VIP Level: **Silver**,
 *
 * 10B and more tokens in the wallet, but less than 100B: VIP Level: **Gold**,
 *
 * 100B and more tokens in the wallet, but less than 1T: VIP Level: **Platinum**,
 *
 * 1T and more tokens in the wallet, but less than 5T: VIP Level: **Black**,
 *
 * 5T and more tokens in the wallet: VIP Level: **Whale**!
 */
export const VIP_LEVELS = {
  1000000000: 'Standard', // 1 billion
  10000000000: 'Silver', // 10 billion
  100000000000: 'Gold', //   100 billion
  1000000000000: 'Platinum', // 1 trillion
  5000000000000: 'Black', //  5 trillion
  10000000000000: 'Whale!' // 10 trillion
};
