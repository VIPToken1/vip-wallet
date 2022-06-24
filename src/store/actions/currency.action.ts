import merge from 'lodash/merge';
import {
  GET_CRYPTO_PRICE_FAILED,
  GET_CRYPTO_PRICE_REQUEST,
  GET_CRYPTO_PRICE_SUCCESS
} from '../actionTypes';
import * as api from 'config/api';
import { RootState } from 'store/types';

export const getCryptoToFiatAction =
  (coin: string | string[], currency?: string) =>
  async (dispatch: any, getState: () => RootState) => {
    try {
      dispatch({ type: GET_CRYPTO_PRICE_REQUEST });
      const { data } = getState().currency;

      const response = await api.cryptoToFiatApi(coin, currency);
      dispatch({
        type: GET_CRYPTO_PRICE_SUCCESS,
        payload: merge(data, response.data),
        timestamp: Date.now()
      });
      return response.data;
    } catch (error) {
      console.log('error crypto price => ', error);
      dispatch({ type: GET_CRYPTO_PRICE_FAILED, payload: { error } });
    }
  };
