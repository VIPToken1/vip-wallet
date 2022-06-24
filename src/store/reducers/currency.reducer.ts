import { AnyAction } from 'redux';
import {
  GET_CRYPTO_PRICE_FAILED,
  GET_CRYPTO_PRICE_REQUEST,
  GET_CRYPTO_PRICE_SUCCESS
} from '../actionTypes';

const initialState = {
  isLoading: false,
  error: null,
  data: {},
  timestamp: 0
};

const currencyReducer = (state = initialState, action: AnyAction) => {
  switch (action.type) {
    case GET_CRYPTO_PRICE_REQUEST:
      return {
        ...state,
        isLoading: true
      };
    case GET_CRYPTO_PRICE_SUCCESS:
      return {
        ...state,
        isLoading: false,
        data: { ...action.payload },
        timestamp: action.timestamp
      };
    case GET_CRYPTO_PRICE_FAILED:
      return {
        ...state,
        isLoading: false,
        error: action.payload.error
      };
    default:
      return state;
  }
};

export default currencyReducer;
