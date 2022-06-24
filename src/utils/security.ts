import * as Keychain from 'react-native-keychain';
import { getData, storeData, keys } from './storage';

export const savePin = async (pin: string) => {
  try {
    await Keychain.setGenericPassword(keys.PIN, pin);
    console.log('PIN saved');
  } catch {
    await storeData(keys.PIN, pin);
  }
};

export const verifyPin = async (pin: string) => {
  try {
    const credentials = await Keychain.getGenericPassword();
    if (credentials) {
      const result = String(credentials.password) === String(pin);
      console.info('PIN verified', result);
      return result;
    } else {
      console.log('No credentials stored');
      const validPin = await getData(keys.PIN);
      return String(validPin) === String(pin);
    }
  } catch (error) {
    console.log("Keychain couldn't be accessed!", error);
    const validPin = await getData(keys.PIN);
    return String(validPin) === String(pin);
  }
};

export const isPinExist = async () => {
  try {
    const credentials = await Keychain.getGenericPassword();
    if (credentials) {
      return !!credentials.password;
    }
    return false;
  } catch {
    return false;
  }
};
