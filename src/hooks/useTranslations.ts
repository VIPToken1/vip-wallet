import { Dispatch, SetStateAction, useState } from 'react';
import enJson from '../translations/en.json';

export type Locale = 'en' | 'de' | 'fr';

export type Translations = {
  strings: typeof enJson;
  currentLanguage: string;
  setCurrentLanguage: Dispatch<SetStateAction<Locale>>;
};

export const useTranslations = (locale?: Locale): Translations => {
  const [currentLanguage, setCurrentLanguage] = useState(locale || 'en');
  // TODO: Add support for multiple languages
  const strings = enJson;
  return { strings, currentLanguage, setCurrentLanguage };
};

export default useTranslations;
