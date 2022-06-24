import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Keychain from 'react-native-keychain';

const keys = {
  AUTHENTICATED: '@authenticated',
  CREDENTIALS: '@credentials',
  PIN: '@pin',
  PIN_ENABLED: '@pin_enabled',
  TOKEN: '@token',
  USER: '@user',
  LANGUAGE: '@language',
  CURRENCY: '@currency',
  PRIVACY_PREFERENCE: '@privacy_preference',
  ERC_TOKENS: '@ERC_tokens'
};

const storeData = async (key: string, value: string) => {
  try {
    const jsonValue = JSON.stringify(value);
    await AsyncStorage.setItem(key, jsonValue);
  } catch (e) {
    // saving error
  }
};

const getData = async (key: string) => {
  try {
    const jsonValue = await AsyncStorage.getItem(key);
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (e) {
    // error reading value
  }
};

const removeData = async (key: string) => {
  try {
    if (key) {
      await AsyncStorage.removeItem(key);
    } else {
      await AsyncStorage.clear();
    }
  } catch (e) {
    // error removing value
  }
};

const clear = async () => {
  try {
    await AsyncStorage.clear();
    await Keychain.resetGenericPassword();
  } catch (e) {
    // error clearing storage
    console.log('Error clearing storage: ', e);
  }
};

export { keys, storeData, getData, removeData, clear };
