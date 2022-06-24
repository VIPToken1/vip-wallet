import {
  SET_PHRASE_ENTROPY,
  GET_PHRASE_ENTROPY,
  GENERATE_PHRASE_REQUEST,
  GENERATE_PHRASE_SUCCESS,
  GENERATE_PHRASE_FAILED,
  GENERATE_WALLET_ADDRESS_REQUEST,
  GENERATE_WALLET_ADDRESS_FAILED,
  GENERATE_WALLET_ADDRESS_SUCCESS,
  SET_DEFAULT_WALLET,
  LOAD_WALLET_REQUEST,
  LOAD_WALLET_SUCCESS,
  LOAD_WALLET_FAILED,
  RENAME_WALLET,
  SET_PRIVATE_KEY,
  UPDATE_ERC_TOKEN_BALANCE,
  GET_ALL_COIN_DETAILS_REQUEST,
  GET_ALL_COIN_DETAILS_SUCCESS,
  GET_ALL_COIN_DETAILS_FAILED,
  UPDATE_TOKEN_LIST,
  SET_TOTAL_WALLET_BALANCE,
  GET_MARKET_DATA_SUCCESS,
  GET_COIN_DETAILS_SUCCESS,
  GET_COIN_DETAILS_REQUEST,
  GET_COIN_DETAILS_FAILED,
  DELETE_WALLET
} from '../actionTypes';
import * as api from 'config/api';
import * as chain from 'utils/chain';
import { EntropyType, IBEPToken } from 'types';
import { RootState } from 'store/types';
import type { IWalletDetails } from 'utils/chain';

export const setPhraseEntropy = (entropy: EntropyType) => ({
  type: SET_PHRASE_ENTROPY,
  payload: entropy
});

export const getPhraseEntropy = () => ({
  type: GET_PHRASE_ENTROPY
});

export const setRecoveryPhrase = (phrase: string) => ({
  type: GENERATE_PHRASE_SUCCESS,
  payload: { phrase }
});

export const setPrivateKey = (privateKey: string) => ({
  type: SET_PRIVATE_KEY,
  payload: { privateKey }
});

export const setTotalWalletBalance = (balance: string) => ({
  type: SET_TOTAL_WALLET_BALANCE,
  payload: { totalBalance: balance }
});

// FIXME: Fix types
export const generateRecoveryPhrase =
  (entropy: EntropyType) => (dispatch: any, getState: any) => {
    dispatch({ type: GENERATE_PHRASE_REQUEST });
    try {
      const isAlreadyExists = getState().crypto.phrase;
      const phrase = isAlreadyExists || chain.generatePhrase(entropy);
      if (!phrase) {
        throw new Error('Could not generate phrase');
      }
      dispatch(setRecoveryPhrase(phrase));
      dispatch(initializeChain());
    } catch (error) {
      dispatch({
        type: GENERATE_PHRASE_FAILED,
        payload: { error }
      });
    }
  };

export const generateWallet =
  (phrase?: string, walletIndex?: number, name?: string) =>
  async (dispatch: any, getState: any) => {
    dispatch({ type: GENERATE_WALLET_ADDRESS_REQUEST });
    try {
      const mnemonic = phrase ?? getState().crypto.phrase;
      const index = walletIndex ?? getState().crypto.walletList.length;
      let path;
      if (index > 0) {
        path = chain.getDerivationPath(index);
      }
      console.info(
        `[WALLET]: Generating wallet address using Mnemonic "${mnemonic}" at path [${index}]:"${path}"`
      );
      await Promise.resolve(setTimeout(() => {}, 1000));
      const wallet = await chain.generateWallet(mnemonic, path);
      console.info('[WALLET]: Wallet generated successfully.', wallet);
      if (!wallet) {
        throw new Error('Could not generate wallet');
      }
      const walletBalance = await chain.getWeb3WalletBalance(wallet);
      const details = {
        wallet,
        name: name || `Account ${index + 1}`,
        address: wallet.address,
        privateKey: wallet.privateKey,
        balance: walletBalance,
        totalBalance: walletBalance
      };
      dispatch({
        type: GENERATE_WALLET_ADDRESS_SUCCESS,
        payload: { wallet: details }
      });
      return details;
    } catch (error) {
      console.log('Error generating wallet: ', error);
      dispatch({
        type: GENERATE_WALLET_ADDRESS_FAILED,
        payload: { error }
      });
    }
  };

export const setDefaultWallet =
  (walletIndex: number) => (dispatch: any, getState: any) => {
    const wallets = getState().crypto.walletList || [];
    const defaultWallet = wallets?.[walletIndex];
    dispatch({
      type: SET_DEFAULT_WALLET,
      payload: { wallet: defaultWallet }
    });
    setTimeout(() => dispatch(updateWalletBalance(defaultWallet)), 5e2);
  };

export const renameWallet = (address: number, name: string) => ({
  type: RENAME_WALLET,
  payload: { address, name }
});

export const deleteWallet = (address: number) => ({
  type: DELETE_WALLET,
  payload: { address }
});

export const initializeChain = () => async (dispatch: any, getState: any) => {
  try {
    dispatch({ type: LOAD_WALLET_REQUEST });
    const {
      crypto: { activeWallet, phrase, privateKey }
    } = getState();
    if (!phrase) {
      throw new Error('Mnemonic not found. Could not generate wallet');
    }
    const walletDetails = await chain.connectToEth(
      phrase,
      activeWallet?.privateKey || privateKey
    );
    walletDetails.name = activeWallet?.name || 'Account 1';
    walletDetails.privateKey = walletDetails.wallet.privateKey;
    console.log('Connection successful >>>>', walletDetails);
    dispatch(setPrivateKey(walletDetails.wallet.privateKey));
    dispatch({
      type: LOAD_WALLET_SUCCESS,
      payload: {
        activeWallet: walletDetails
      }
    });
    return walletDetails;
  } catch (error) {
    console.log('Error ', error);
    dispatch({
      type: LOAD_WALLET_FAILED,
      payload: { error }
    });
  }
};

export const updateWalletBalance =
  (selectedWallet?: IWalletDetails) => async (dispatch: any, getState: any) => {
    try {
      const { activeWallet } = getState().crypto;
      const currentWallet = selectedWallet ? selectedWallet : activeWallet;
      const walletBalance = await chain.getWeb3WalletBalance(
        currentWallet?.wallet
      );

      currentWallet.balance = walletBalance;
      dispatch({
        type: LOAD_WALLET_SUCCESS,
        payload: { wallet: currentWallet }
      });
      return walletBalance;
    } catch (error) {
      console.log('Error updating balance: ', error);
    }
  };

export const getERCTokenBalanceAction =
  (token: any) => async (dispatch: any, getState: any) => {
    try {
      const { activeWallet } = getState().crypto;
      if (activeWallet?.address) {
        const response = await api.getContractBalanceApi(
          activeWallet?.address,
          token.address
        );
        if (!response.data) {
          throw new Error('[VIP]: Invalid contract address');
        }
        const balance = (
          Number(response.data.result) /
          10 ** token.decimals
        ).toFixed(2);
        token.balance = balance;
        dispatch(updateERCTokenBalanceAction(token));
        return balance;
      }
    } catch (error) {
      console.log('error fetching contract balance=> ', error);
    }
  };

export const updateERCTokenBalanceAction = (token: IBEPToken) => ({
  type: UPDATE_ERC_TOKEN_BALANCE,
  payload: { token }
});

export const getAllCoinDetails =
  (coins: string[]) => async (dispatch: any, getState: any) => {
    try {
      dispatch({ type: GET_ALL_COIN_DETAILS_REQUEST });
      let { tokens } = getState().crypto;
      const promises: Promise<unknown>[] = [];
      coins.forEach((coin: string) => {
        promises.push(api.coinDetailsApi(coin));
      });
      const response = await Promise.allSettled(promises);
      tokens = tokens.map((token: any) => {
        const coin = response.find(
          (item: any) =>
            item.value.data.symbol?.toLowerCase() ===
            token.symbol?.toLowerCase()
        );
        if (coin) {
          const details = coin.value.data;
          return {
            ...token,
            ...details,
            currentPrice: details.current_price
          };
        }
        return token;
      });

      dispatch({
        type: GET_ALL_COIN_DETAILS_SUCCESS,
        payload: { coinDetails: response }
      });
      dispatch({
        type: UPDATE_TOKEN_LIST,
        payload: tokens
      });
      return response[0].value.data;
    } catch (error) {
      console.log('all coin details error => ', error);
      dispatch({
        type: GET_ALL_COIN_DETAILS_FAILED,
        payload: { error }
      });
    }
  };

export const getCoinDetails = (coin: string) => async (dispatch: any) => {
  try {
    dispatch({ type: GET_COIN_DETAILS_REQUEST });
    const response = await api.coinDetailsApi(coin);
    dispatch({ type: GET_COIN_DETAILS_SUCCESS, payload: response.data });
    return response.data;
  } catch (error) {
    console.log('error getCoinDetails => ', error);
    dispatch({ type: GET_COIN_DETAILS_FAILED, payload: { error } });
  }
};

export const getMarketDataAction =
  (coin: string, time: string) =>
  async (dispatch: any, getState: () => RootState) => {
    try {
      const { charts = {} } = getState().crypto;
      const response = await api.lineChartApi(coin, time);

      const payload = {
        ...charts,
        [coin]: {
          ...charts[coin],
          [time]: response.data
        }
      };
      dispatch({ type: GET_MARKET_DATA_SUCCESS, payload });
      // return response.data;
    } catch (error) {
      console.log('error getMarketData => ', error);
    }
  };
