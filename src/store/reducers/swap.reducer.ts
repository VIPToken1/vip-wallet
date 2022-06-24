import { AnyAction } from 'redux';
import { ISwapState, SwapSpeeds } from 'types';
import {
  SET_SWAP_SLIPPAGE,
  SET_SWAP_SPEED,
  SET_SWAP_TXN_TIME
} from '../actionTypes';

const initialState: ISwapState = {
  isLoading: false,
  error: null,
  timestamp: 0,
  slippage: 12,
  speed: SwapSpeeds.STD,
  txnTime: 10
};

const swapReducer = (state = initialState, action: AnyAction) => {
  switch (action.type) {
    case SET_SWAP_SLIPPAGE:
      return {
        ...state,
        slippage: action.payload.slippage
      };
    case SET_SWAP_SPEED:
      return {
        ...state,
        speed: action.payload.speed
      };
    case SET_SWAP_TXN_TIME:
      return {
        ...state,
        txnTime: action.payload.txnTime
      };
    default:
      return state;
  }
};

export default swapReducer;
