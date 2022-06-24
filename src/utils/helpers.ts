import { getLocales, getNumberFormatSettings } from 'react-native-localize';
console.log('[LOCALE INFO]: ', getLocales());

export const countDecimals = (value: any) => {
  if (Math.floor(value) == value || value == '0') {
    return 0;
  }
  return value.toString().split('.')[1].length || 0;
};

export const getVIPLevel = (balance: number | string) => {
  if (!balance) {
    return 'Standard';
  }

  if (balance < 1000000000) {
    return 'Standard';
  } else if (balance >= 1000000000 && balance < 10000000000) {
    return 'Silver';
  } else if (balance >= 10000000000 && balance < 100000000000) {
    return 'Gold';
  } else if (balance >= 100000000000 && balance < 1000000000000) {
    return 'Platinum';
  } else if (balance >= 1000000000000 && balance < 5000000000000) {
    return 'Black';
  } else if (balance >= 5000000000000) {
    return 'Whale!';
  }
};

export const parseLocaleNumber = (stringNumber: string) => {
  const { decimalSeparator, groupingSeparator } = getNumberFormatSettings();

  return Number(
    stringNumber
      .replace(new RegExp(`\\${groupingSeparator}`, 'g'), '')
      .replace(new RegExp(`\\${decimalSeparator}`), '.')
  );
};
