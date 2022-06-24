import { cloneDeep } from 'lodash';
import { AnyAction } from 'redux';
import {
  GET_TRANSACTION_HISTORY_FAILED,
  GET_TRANSACTION_HISTORY_REQUEST,
  GET_TRANSACTION_HISTORY_SUCCESS
} from '../actionTypes';

const initialState = {
  isLoading: false,
  error: null,
  data: {},
  timestamp: 0
};

const transactionsReducer = (state = initialState, action: AnyAction) => {
  switch (action.type) {
    case GET_TRANSACTION_HISTORY_REQUEST:
      return {
        ...state,
        isLoading: true
      };
    case GET_TRANSACTION_HISTORY_SUCCESS:
      return {
        ...state,
        isLoading: false,
        data: cloneDeep(action.payload),
        timestamp: action.timestamp
      };
    case GET_TRANSACTION_HISTORY_FAILED:
      return {
        ...state,
        isLoading: false,
        error: action.payload.error
      };
    default:
      return state;
  }
};

export default transactionsReducer;
