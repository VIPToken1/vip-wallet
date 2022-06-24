import { TOKENS } from 'constants/index';
import { cloneDeep, uniqBy } from 'lodash';
import { AnyAction } from 'redux';
import { IBEPToken } from 'types';
import { IWalletDetails } from 'utils';
import {
  GENERATE_PHRASE_REQUEST,
  GENERATE_PHRASE_SUCCESS,
  GENERATE_PHRASE_FAILED,
  GENERATE_WALLET_ADDRESS_REQUEST,
  GENERATE_WALLET_ADDRESS_FAILED,
  GENERATE_WALLET_ADDRESS_SUCCESS,
  SET_PHRASE_ENTROPY,
  SET_DEFAULT_WALLET,
  LOAD_WALLET_REQUEST,
  LOAD_WALLET_SUCCESS,
  LOAD_WALLET_FAILED,
  RENAME_WALLET,
  SET_PRIVATE_KEY,
  NETWORK_LIST_SUCCESS,
  NETWORK_LIST_FAILED,
  UPDATE_NETWORK_LIST,
  SET_ACTIVE_NETWORK,
  ADD_ERC_TOKEN_REQUEST,
  ADD_ERC_TOKEN_SUCCESS,
  ADD_ERC_TOKEN_FAILED,
  UPDATE_ERC_TOKEN_BALANCE,
  UPDATE_TOKEN_LIST,
  SET_TOTAL_WALLET_BALANCE,
  GET_MARKET_DATA_SUCCESS,
  DELETE_WALLET
} from '../actionTypes';

interface IState {
  loading: boolean;
  error?: string | null;
  phrase: string;
  privateKey: string;
  wallet: IWalletDetails | null;
  walletList: IWalletDetails[];
  activeWallet: IWalletDetails | null; /////// update
  entropy: number;
  network_list: any[];
  selectedNetwork: any;
  tokens: IBEPToken[];
  charts: any;
}

const initialState: IState = {
  loading: false,
  entropy: 16,
  phrase: '',
  privateKey: '',
  wallet: null,
  activeWallet: null,
  walletList: [],
  network_list: [],
  selectedNetwork: null,
  tokens: Object.values(TOKENS),
  charts: {}
};

const setDefaultWallet = (state: IState, payload: any) => {
  const { wallet } = payload;
  const { walletList } = state;
  const walletIndex = walletList.findIndex(
    w => w.address === payload.wallet.address
  );

  if (walletIndex > -1) {
    walletList[walletIndex].isActive = payload.isActive;
  }
  return {
    ...state,
    walletList,
    activeWallet: wallet
  };
};

const renameWallet = (
  state: IState,
  payload: { address: string; name: string }
) => {
  const { activeWallet, walletList } = state;
  const walletIndex = walletList.findIndex(w => w.address === payload.address);

  if (walletIndex > -1) {
    walletList[walletIndex].name = payload.name;
  }

  if (activeWallet?.address === payload.address) {
    activeWallet.name = payload.name;
  }
  return {
    ...state,
    activeWallet,
    walletList
  };
};

const deleteWallet = (state: IState, payload: { address: string }) => {
  let activeWallet = state.activeWallet;
  const walletList = [...(state.walletList || [])];
  const walletIndex = walletList.findIndex(w => w.address === payload.address);

  if (walletIndex > -1) {
    walletList.splice(walletIndex, 1);
  }

  if (activeWallet?.address === payload.address) {
    activeWallet = walletList[0];
    walletList[0].isActive = true;
  }
  return {
    ...state,
    activeWallet,
    walletList
  };
};

const updateWalletList = (state: IState, payload: Partial<IState>) => {
  const { wallet } = payload;
  const activeWallet = payload.activeWallet || state.activeWallet;
  const walletList = [...(state.walletList || [])];

  if (wallet) {
    walletList.push(wallet);
  }
  if (activeWallet) {
    const address = activeWallet.address;
    const walletIndex = walletList.findIndex(w => w.address === address);

    if (walletIndex > -1) {
      activeWallet.isActive = true;
      walletList[walletIndex] = activeWallet;
    } else {
      walletList.push(activeWallet);
    }
  }
  return {
    ...state,
    activeWallet,
    walletList: uniqBy(walletList, 'address')
  };
};

const updateTotalWalletBalance = (
  state: IState,
  payload: { totalBalance: any }
) => {
  const { totalBalance } = payload;
  const activeWallet = state.activeWallet;
  const walletList = [...(state.walletList || [])];

  if (activeWallet) {
    const address = activeWallet.address;
    const walletIndex = walletList.findIndex(w => w.address === address);

    activeWallet.totalBalance = totalBalance;
    if (walletIndex > -1) {
      walletList[walletIndex] = activeWallet;
    }
  }
  return {
    ...state,
    activeWallet,
    walletList
  };
};

const loadWallet = (state: IState, payload: Partial<IState>) => {
  return {
    ...state,
    ...updateWalletList(state, payload),
    loading: false
  };
};

const updateERCTokenBalance = (state: IState, payload: any) => {
  const updatedState = { ...state };
  const { tokens } = updatedState;
  const { token } = payload;
  const tokenIndex = tokens.findIndex(t => t.address === token.address);
  if (tokenIndex > -1) {
    tokens[tokenIndex] = {
      ...tokens[tokenIndex],
      balance: token.balance
    };
  }
  return updatedState;
};

const cryptoReducer = (state = initialState, action: AnyAction) => {
  const { type, payload } = action;
  switch (type) {
    case SET_PHRASE_ENTROPY:
      return {
        ...state,
        entropy: payload,
        phrase: payload === state.entropy ? state.phrase : ''
      };
    case GENERATE_PHRASE_REQUEST:
      return {
        ...state,
        loading: true
      };
    case GENERATE_PHRASE_SUCCESS:
      return {
        ...state,
        phrase: payload.phrase,
        loading: false
      };
    case GENERATE_PHRASE_FAILED:
      return {
        ...state,
        loading: false,
        error: payload.error
      };
    case GENERATE_WALLET_ADDRESS_REQUEST:
      return {
        ...state,
        loading: true
      };
    case GENERATE_WALLET_ADDRESS_SUCCESS:
      return {
        ...state,
        ...updateWalletList(state, payload),
        loading: false
      };
    case GENERATE_WALLET_ADDRESS_FAILED:
      return {
        ...state,
        error: payload.error
      };
    case SET_PRIVATE_KEY:
      return {
        ...state,
        privateKey: payload.privateKey
      };
    case SET_TOTAL_WALLET_BALANCE:
      return updateTotalWalletBalance(state, payload);
    case SET_DEFAULT_WALLET:
      return setDefaultWallet(state, payload);
    case RENAME_WALLET:
      return renameWallet(state, payload);
    case DELETE_WALLET:
      return deleteWallet(state, payload);
    case LOAD_WALLET_REQUEST:
      return {
        ...state,
        loading: true
      };
    case LOAD_WALLET_SUCCESS:
      return loadWallet(state, payload);
    case LOAD_WALLET_FAILED:
      return {
        ...state,
        error: payload.error,
        loading: false
      };
    case NETWORK_LIST_SUCCESS:
      return {
        ...state,
        network_list: action.payload
      };
    case NETWORK_LIST_FAILED:
      return {
        ...state,
        error: action.payload
      };
    case UPDATE_NETWORK_LIST:
    case SET_ACTIVE_NETWORK:
      return {
        ...state,
        network_list: action.payload.network_list,
        selectedNetwork: action.payload.selectedNetwork
      };
    case UPDATE_TOKEN_LIST:
      return {
        ...state,
        tokens: cloneDeep(payload)
      };
    case ADD_ERC_TOKEN_REQUEST:
      return {
        ...state,
        loading: true
      };
    case ADD_ERC_TOKEN_SUCCESS:
      return {
        ...state,
        tokens: uniqBy([...cloneDeep(state.tokens), payload.token], 'symbol')
      };
    case ADD_ERC_TOKEN_FAILED:
      return {
        ...state,
        error: payload.error,
        loading: false
      };
    case UPDATE_ERC_TOKEN_BALANCE:
      return updateERCTokenBalance(state, payload);
    case GET_MARKET_DATA_SUCCESS:
      return {
        ...state,
        charts: { ...payload }
      };
    default:
      return state;
  }
};

export default cryptoReducer;
