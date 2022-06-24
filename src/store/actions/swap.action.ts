import {
  SET_SWAP_SLIPPAGE,
  SET_SWAP_SPEED,
  SET_SWAP_TXN_TIME
} from 'store/actionTypes';
import { SwapSpeeds } from 'types';

export const setSwapSlippage = (slippage: number) => ({
  type: SET_SWAP_SLIPPAGE,
  payload: {
    slippage
  }
});

export const setSwapSpeed = (speed: SwapSpeeds) => ({
  type: SET_SWAP_SPEED,
  payload: {
    speed
  }
});

export const setSwapTxnTime = (txnTime: number) => ({
  type: SET_SWAP_TXN_TIME,
  payload: {
    txnTime
  }
});
