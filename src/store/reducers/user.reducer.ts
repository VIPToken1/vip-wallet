import moment from 'moment';
import { AnyAction } from 'redux';
import {
  SET_PRIVACY_PREFERENCES,
  SET_TERMS_ACCEPTANCE,
  SET_GOOGLE_USER,
  SET_WALLET_BACKUP,
  SET_WALLET_PROTECTION,
  LOGIN,
  TERMS_SUCCESS,
  PRIVACY_POLICY_SUCCESS,
  VALID_USERNAME_SUCCESS,
  VALID_USERNAME_ERROR,
  RESET_USERNAME_DATA,
  SET_USERNAME,
  LOGOUT,
  SET_APP_LOCK_PREFERENCES,
  SET_DEFAULT_CURRENCY,
  LOGIN_FAILED,
  LOGIN_SUCCESS,
  UPDATE_USER_DETAILS,
  UPDATE_USER_DETAILS_FAILED,
  CURRENCIES_LIST_SUCCESS,
  CURRENCIES_LIST_FAIL
} from '../actionTypes';

const initialState = {
  isLoggedIn: false,
  privacy: 'public',
  googleUser: null,
  walletProtection: null,
  walletBackup: null,
  isUsernameAvailable: true,
  userName: '',
  defaultCurrency: {
    conversionRate: 1,
    currencyCode: 'USD',
    currencyName: 'US Dollar',
    currencySign: '$',
    id: '62175c26677e31f209c79934'
  },
  termsAcceptance: {
    isAccepted: false
  },
  legal: {
    privacy_policy: '',
    privacy_last_updated: moment().format('MMMM DD, YYYY'),
    terms_policy: '',
    terms_last_updated: moment().format('MMMM DD, YYYY')
  },
  appLockPreferences: {
    lockMethod: '',
    isBiometricEnabled: false,
    appLock: false,
    transactionLock: true,
    biometricChangeProtection: false
  },
  token: '',
  userDetails: null,
  currencyList: []
};

const userReducer = (state = { ...initialState }, action: AnyAction) => {
  switch (action.type) {
    case SET_PRIVACY_PREFERENCES:
      return {
        ...state,
        privacy: action.payload
      };
    case SET_TERMS_ACCEPTANCE:
      return {
        ...state,
        termsAcceptance: action.payload
      };
    case SET_GOOGLE_USER:
      return {
        ...state,
        googleUser: action.payload
      };
    case SET_WALLET_PROTECTION:
      return {
        ...state,
        walletProtection: action.payload
      };
    case SET_WALLET_BACKUP:
      return {
        ...state,
        walletBackup: action.payload
      };
    case LOGIN:
      return {
        ...state,
        isLoggedIn: true
      };
    case TERMS_SUCCESS:
      var { body, updatedAt } = action.payload;
      return {
        ...state,
        legal: {
          ...state.legal,
          terms_policy: body,
          terms_last_updated: moment(updatedAt).format('MMMM DD, YYYY')
        }
      };
    case PRIVACY_POLICY_SUCCESS:
      var { updatedAt, body } = action.payload;
      return {
        ...state,
        legal: {
          ...state.legal,
          privacy_policy: body,
          privacy_last_updated: moment(updatedAt).format('MMMM DD, YYYY')
        }
      };
    case VALID_USERNAME_SUCCESS:
      const { isAvailable } = action.payload;
      console.log('isAvailable', isAvailable);
      return {
        ...state,
        isUsernameAvailable: isAvailable
      };
    case VALID_USERNAME_ERROR:
      const { error } = action.payload;
      return {
        ...state,
        error: error
      };
    case RESET_USERNAME_DATA:
      return {
        ...state,
        isUsernameAvailable: true,
        userName: ''
      };
    case SET_USERNAME:
      return {
        ...state,
        userName: action.payload
      };
    case SET_DEFAULT_CURRENCY:
      return {
        ...state,
        defaultCurrency: action.payload
      };
    case SET_APP_LOCK_PREFERENCES:
      return {
        ...state,
        appLockPreferences: {
          ...state.appLockPreferences,
          ...action.payload
        }
      };
    case LOGIN_SUCCESS:
      const {
        user,
        tokens: {
          access: { token }
        }
      } = action.payload;
      return {
        ...state,
        token: token,
        userDetails: user
      };
    case UPDATE_USER_DETAILS_FAILED:
    case LOGIN_FAILED:
      return {
        ...state,
        error: action.payload.error
      };
    case UPDATE_USER_DETAILS:
      return {
        ...state,
        userDetails: action.payload
      };
    case CURRENCIES_LIST_SUCCESS:
      return {
        ...state,
        currencyList: [...action.payload]
      };
    case CURRENCIES_LIST_FAIL:
      return {
        ...state
      };
    default:
      return state;
  }
};

export default userReducer;
