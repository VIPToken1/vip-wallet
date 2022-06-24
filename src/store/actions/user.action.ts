import {
  privacyPolicy,
  termsAndCondtion,
  updateUserApi,
  listCurrenciesApi
} from 'config/api';
import {
  IAppLockPreferences,
  WalletBackupType,
  WalletProtectionType
} from 'types';
import { sortBy } from 'lodash';
import { currencyList } from 'utils';
import {
  SET_GOOGLE_USER,
  LOGOUT,
  LOGIN,
  SET_WALLET_PROTECTION,
  SET_WALLET_BACKUP,
  TERMS_SUCCESS,
  TERMS_ERROR,
  PRIVACY_POLICY_SUCCESS,
  PRIVACY_POLICY_ERROR,
  SET_APP_LOCK_PREFERENCES,
  SET_DEFAULT_CURRENCY,
  UPDATE_USER_DETAILS,
  UPDATE_USER_DETAILS_FAILED,
  CURRENCIES_LIST_SUCCESS,
  CURRENCIES_LIST_FAIL
} from '../actionTypes';

export const setGoogleDetails = (data: any) => ({
  type: SET_GOOGLE_USER,
  payload: data
});

export const setWalletProtection = (data: WalletProtectionType) => ({
  type: SET_WALLET_PROTECTION,
  payload: data
});

export const setWalletBackup = (data: WalletBackupType) => (dispatch: any) => {
  dispatch(updateUserDetailAction(data));
  dispatch({
    type: SET_WALLET_BACKUP,
    payload: data
  });
};

export const login = () => ({ type: LOGIN });
export const logout = () => ({ type: LOGOUT });

export const getPrivacyPolicy = () => async (dispatch: any) => {
  try {
    const response = await privacyPolicy();
    if (response.data && response.data.body) {
      dispatch({
        type: PRIVACY_POLICY_SUCCESS,
        payload: response.data
      });
    }
  } catch (error) {
    dispatch({
      type: PRIVACY_POLICY_ERROR,
      payload: { error }
    });
  }
};

export const getTerms = () => async (dispatch: any) => {
  try {
    const response = await termsAndCondtion();
    if (response.data && response.data.body) {
      dispatch({
        type: TERMS_SUCCESS,
        payload: response.data
      });
    }
  } catch (error) {
    dispatch({
      type: TERMS_ERROR,
      payload: { error }
    });
  }
};

export const setAppLockPreferences = (data: Partial<IAppLockPreferences>) => ({
  type: SET_APP_LOCK_PREFERENCES,
  payload: data
});

export const setDefaultCurrency = (currency: typeof currencyList) => ({
  type: SET_DEFAULT_CURRENCY,
  payload: currency
});

export const updateUserDetailAction =
  (data: any) => async (dispatch: any, getState: any) => {
    try {
      const { user } = getState();
      if (!user.userDetails) {
        throw new Error('Please provide a valid user id');
      }
      delete data.isBackup;
      const response = await updateUserApi(user.userDetails.id, data);
      if (response.data) {
        dispatch({
          type: UPDATE_USER_DETAILS,
          payload: response.data
        });
      }
    } catch (error: any) {
      dispatch({
        type: UPDATE_USER_DETAILS_FAILED,
        payload: { error: error?.toString() }
      });
    }
  };

export const listCurrenciesAction = () => async (dispatch: any) => {
  try {
    const response = await listCurrenciesApi();
    if (response.data) {
      dispatch({
        type: CURRENCIES_LIST_SUCCESS,
        payload: sortBy(response.data, 'currencyName')
      });
    }
  } catch (error) {
    dispatch({
      type: CURRENCIES_LIST_FAIL,
      payload: { error }
    });
    throw error;
  }
};
