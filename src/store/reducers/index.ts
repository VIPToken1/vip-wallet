import { combineReducers } from 'redux';
import { LOGOUT } from 'store/actionTypes';
import cryptoReducer from './crypto.reducer';
import currencyReducer from './currency.reducer';
import loaderStatus from './loader.reducer';
import swapReducer from './swap.reducer';
import transactionsReducer from './transactions.reducer';
import userReducer from './user.reducer';

const appReducers = combineReducers({
  loader: loaderStatus,
  crypto: cryptoReducer,
  currency: currencyReducer,
  swap: swapReducer,
  transactions: transactionsReducer,
  user: userReducer
});
const rootReducer = (state: any, action: any) => {
  if (action.type === LOGOUT) {
    return appReducers(undefined, action);
  }

  return appReducers(state, action);
};
export default rootReducer;
