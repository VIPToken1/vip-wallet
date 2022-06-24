// export const BSC_MAINNET = 'BSC Mainnet';
export const BSC_TESTNET = {
  networkName: 'BSC Testnet',
  rpcUrl: 'https://data-seed-prebsc-1-s1.binance.org:8545',
  chainID: 97,
  symbol: 'BNB',
  blockExplorerUrl: 'https://testnet.bscscan.com',
  apiUrl: 'https://testnet-api.bscscan.com/api'
};

export const BSC_MAINNET = {
  networkName: 'BSC Mainnet',
  rpcUrl: 'https://bsc-dataseed1.ninicoin.io',
  chainID: 56,
  symbol: 'BNB',
  blockExplorerUrl: 'https://bscscan.com',
  apiUrl: 'https://api.bscscan.com/api'
};

export const NETWORKS = new Map();

NETWORKS.set('BSC_TESTNET', BSC_TESTNET);
NETWORKS.set('BSC_MAINNET', BSC_MAINNET);

export default NETWORKS;
