// @ts-nocheck
import 'react-native-get-random-values';
import '@ethersproject/shims';
import { BigNumber, Contract, ethers, utils, Wallet } from 'ethers';
import Web3 from 'web3';
import {
  PancakeswapPair,
  PancakeswapPairSettings
} from 'simple-pancakeswap-sdk';
import bip39 from 'react-native-bip39';
import { hdkey } from 'ethereumjs-wallet';
import { EntropyType } from 'types';
import NETWORKS from 'config/networks';

export interface IWallet extends Wallet {}
export interface IWalletDetails {
  wallet: IWallet;
  address: string;
  balance: ethers.BigNumber;
  totalBalance: ethers.BigNumber;
  privateKey: string;
  name?: string;
  isActive?: boolean;
  connectionInfo?: any;
}

let network: ethers.providers.Networkish = 'ropsten';

let web3 = new Web3(
  new Web3.providers.HttpProvider(NETWORKS.get('BSC_MAINNET').rpcUrl)
  // new Web3.providers.HttpProvider(NETWORKS.get('BSC_TESTNET').rpcUrl)
);

let provider = new ethers.providers.Web3Provider(web3.currentProvider);

let ethersProvider = provider;

global.ethersProvider = provider;

const setProvider = async (url: string) => {
  console.info('[PROVIDER]: Setting provider...', url);
  provider = new ethers.providers.JsonRpcProvider(url);
  ethersProvider = await provider.getNetwork();
  console.info('[PROVIDER]: New Provider...', ethersProvider);
};

const setNetwork = (value: ethers.providers.Networkish) => {
  network = value;
};

const getNetwork = async () => await provider.getNetwork();

const getEntropyType = (count: string): EntropyType =>
  count === '12' ? 16 : 32;

const generatePhrase = (entropy: EntropyType): string => {
  return utils.entropyToMnemonic(utils.randomBytes(entropy));
};

const encryptPhrase = (phrase: string, password?: string): string => {
  return utils.mnemonicToSeed(phrase, password);
};

const decryptPhrase = (phrase: string): string => {
  return utils.mnemonicToEntropy(phrase);
};

const validatePhrase = (phrase: string): boolean => {
  return utils.isValidMnemonic(phrase);
};

const validateWalletAddress = (address: string): boolean => {
  return utils.isAddress(address);
};

const parseBigNumber = (value: any, decimals = 18) => {
  if (!value) {
    return '0';
  }
  if (!ethers.BigNumber.isBigNumber(value)) {
    // value = ethers.BigNumber.from(value);
    return value.toString();
  }

  value = value.hex || value._hex;
  return BigNumber.from(value).toString();
};

const parseWalletBalance = (balance: any) =>
  ethers.BigNumber.isBigNumber(balance)
    ? parseBigNumber(balance) / 1e18
    : balance;

const convertToBigNumber = (value: any) => ethers.BigNumber.from(value);

// Wallet
const getDerivationPath = (index: number): string =>
  `m/44'/60'/0'/0/${index || 0}`;

const generatePrivateKey = async (mnemonic: string, index = 0) => {
  const hdwallet = hdkey.fromMasterSeed(await bip39.mnemonicToSeed(mnemonic));
  const wallet = hdwallet.derivePath(getDerivationPath(index)).getWallet();
  const privateKey = wallet.getPrivateKey().toString('hex');

  return privateKey;
};

const generatePrivateKeyEthers = (mnemonic: string, path?: string): string => {
  const mnemonicWallet = ethers.Wallet.fromMnemonic(mnemonic, path);
  return mnemonicWallet.privateKey;
};

/**
 * generate new wallet using mnemonic phrase and derivation path
 * @param phrase
 * @param path
 * @returns generated wallet
 */
const generateWallet = async (
  phrase: string,
  path?: string
): Promise<Wallet> => {
  const index = Number(path?.substr(path.length - 1)) || 0;

  const privateKey = await generatePrivateKey(phrase, index);

  const privateKeyWallet = new ethers.Wallet(privateKey, provider);
  return privateKeyWallet;
};

const getWalletBalance = async (wallet: Wallet) => {
  const privateKey = wallet.privateKey;
  console.log('Private Key: ', privateKey);

  let walletWithProvider = new ethers.Wallet(privateKey, provider);
  const blockTag = await provider._getBlockTag('latest');

  const walletBalance = await walletWithProvider.getBalance(blockTag);
  console.log(
    '[WALLET BALANCE]: ',
    walletBalance,
    utils.formatUnits(walletBalance, 6)
  );

  return walletBalance;
};

const getWeb3WalletBalance = async (wallet: Wallet) => {
  const privateKey = wallet.privateKey;
  console.log('Private Key: ', privateKey);

  const walletBalance = await web3.eth.getBalance(wallet.address);
  console.log(
    '[WALLET BALANCE]: ',
    walletBalance,
    utils.formatUnits(walletBalance, 6)
  );

  return ethers.BigNumber.from(walletBalance);
};

const connectToEth = async (
  phrase: string,
  privateKey?: string
): Promise<IWalletDetails> => {
  console.log('INITIALIZING CONNECTION...');
  let wallet;
  if (privateKey) {
    wallet = new ethers.Wallet(privateKey, provider);
  } else {
    wallet = await generateWallet(phrase);
  }
  const address = wallet.address;
  privateKey = wallet.privateKey;
  console.log('wallet address: ', wallet.address);

  const connectionInfo = await provider.getNetwork();
  console.info('[CONNECTION]: ', connectionInfo);
  const walletBalance = await getWeb3WalletBalance(wallet);

  return {
    wallet,
    address,
    privateKey,
    connectionInfo,
    balance: walletBalance,
    totalBalance: walletBalance
  };
};

const getContractDetails = async (
  contractAddress: string,
  abi: any
): Promise<{ name: string; symbol: string; decimals: number }> => {
  const tokenContract = new web3.eth.Contract(abi, contractAddress);
  const [symbol, decimals, name] = await Promise.all([
    tokenContract.methods.symbol().call(),
    tokenContract.methods.decimals().call(),
    tokenContract.methods.name().call()
  ]);
  const details = { decimals, name, symbol };
  console.log('[ERC20]: Token details', details);
  return details;
};

const calculateGasPrice = async () => {
  try {
    const currentGasPrice = await web3.eth.getGasPrice();
    const gasPrice = ethers.utils.hexlify(parseInt(currentGasPrice));
    console.log(`gasPrice: ${gasPrice}`, currentGasPrice);
    return gasPrice;
  } catch (error) {
    console.warn('[ERROR]: Calculating gas fee', error);
  }
};

const calculateMaxAmount = async (balance: string) => {
  const gasPrice = await web3.eth.getGasPrice();
  const gasLimit = 45000;

  const totalGasPrice = gasLimit * parseInt(gasPrice, 10);
  const maxAmount = (
    (parseBigNumber(balance) - totalGasPrice) /
    1e18
  ).toString();
  console.log('[MAX AMOUNT]: ', maxAmount, ethers.utils.hexlify(totalGasPrice));
  return maxAmount;
};

/**
 * Send contract transaction
 * @param contractAddress
 * @param contractAbi
 * @param sendTokenAmount
 * @param toAddress
 * @param fromAddress
 * @param privateKey
 */
const sendContract = async (
  contractAddress: string,
  contractAbi: any,
  sendTokenAmount: string,
  toAddress: string,
  decimals: number,
  fromAddress: string,
  privateKey: string
) => {
  try {
    const wallet = new ethers.Wallet(privateKey);
    const walletSigner = wallet.connect(ethersProvider);

    const contract = new ethers.Contract(
      contractAddress,
      contractAbi,
      walletSigner
    );

    const numberOfTokens = ethers.utils.parseUnits(sendTokenAmount, decimals);
    console.log(`numberOfTokens: ${numberOfTokens}`);

    // Send tokens
    const transferResult = await contract.transfer(toAddress, numberOfTokens);
    console.dir(transferResult);
    const confirmations = await transferResult.wait();
    console.log('[CONFIRMATIONS]: ', confirmations);
    return { isError: false, transaction: transferResult };
  } catch (error) {
    console.log('[CONTRACT]: Transfer failed: ', error.code, error.toString());
    return { isError: true, message: error.reason, error };
  }
};

/**
 * send BNB to address
 * @param sendAmount
 * @param toAddress
 * @param fromAddress
 * @param privateKey
 */
const sendBNB = async (
  sendAmount: string,
  toAddress: string,
  fromAddress: string,
  privateKey: string
) => {
  try {
    // const gasLimit = '0x100000';
    const gasLimit = 21000;
    const gasPrice = await calculateGasPrice();

    const tx = {
      from: fromAddress,
      to: toAddress,
      value: ethers.utils.parseEther(sendAmount),
      nonce: web3.eth.getTransactionCount(fromAddress, 'latest'),
      gasLimit: ethers.utils.hexlify(gasLimit), // 100000
      gasPrice: gasPrice
    };
    console.info('[Transaction] Ready to be sent...', tx);

    return await sendTransaction(tx, privateKey);
  } catch (error: any) {
    console.log('[Transaction] Failed...', error);
  }
};

/**
 * Send transaction
 * @param tx
 * @param privateKey
 * @returns
 */
const sendTransaction = async (tx: any, privateKey: string) => {
  try {
    const wallet = new ethers.Wallet(privateKey);
    const walletSigner = wallet.connect(ethersProvider);
    const transaction = await walletSigner.sendTransaction(tx);
    console.dir(transaction);
    console.info('[Transaxtion] Send finished!');
    return { isError: false, transaction };
  } catch (error) {
    console.log('[Transaction] Failed...', error.reason);
    return { isError: true, message: error.reason, error };
  }
};

export {
  network,
  provider,
  provider as ethersProvider,
  setNetwork,
  getNetwork,
  setProvider,
  getEntropyType,
  generatePhrase,
  encryptPhrase,
  decryptPhrase,
  validatePhrase,
  validateWalletAddress,
  parseBigNumber,
  parseWalletBalance,
  convertToBigNumber,
  connectToEth,
  getDerivationPath,
  generateWallet,
  generatePrivateKey,
  generatePrivateKeyEthers,
  getWalletBalance,
  getWeb3WalletBalance,
  getContractDetails,
  calculateGasPrice,
  calculateMaxAmount,
  sendContract,
  sendBNB,
  sendTransaction
};
