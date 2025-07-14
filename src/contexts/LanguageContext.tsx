
import React, { createContext, useContext, useState, useEffect } from 'react';
import { translations } from '@/locales';

interface Language {
  code: string;
  name: string;
  flag: string;
}

interface LanguageContextProps {
  language: string;
  setLanguage: (language: string) => void;
  t: (key: string) => string;
  currentLanguage: Language;
  languages: Language[];
  changeLanguage: (language: Language) => void;
}

const languages: Language[] = [
  { code: 'az', name: 'Azərbaycan', flag: '🇦🇿' },
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'ru', name: 'Русский', flag: '🇷🇺' },
];

const LanguageContext = createContext<LanguageContextProps>({
  language: 'az',
  setLanguage: () => {},
  t: (key: string) => key,
  currentLanguage: languages[0],
  languages,
  changeLanguage: () => {},
});

export const useLanguage = () => useContext(LanguageContext);

interface LanguageProviderProps {
  children: React.ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [language, setLanguage] = useState(localStorage.getItem('language') || 'az');

  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  const currentLanguage = languages.find(lang => lang.code === language) || languages[0];

  const changeLanguage = (lang: Language) => {
    setLanguage(lang.code);
  };

  const t = (key: string) => {
    const keys = key.split('.');
    let value: any = translations[language as keyof typeof translations];
    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        return key;
      }
    }
    return typeof value === 'string' ? value : key;
  };

  return (
    <LanguageContext.Provider value={{ 
      language, 
      setLanguage, 
      t, 
      currentLanguage,
      languages,
      changeLanguage
    }}>
      {children}
    </LanguageContext.Provider>
  );
};
