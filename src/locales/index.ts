
import { az } from './az';
import { en } from './en';
import { ru } from './ru';

export const translations = {
  az,
  en,
  ru,
};

export type TranslationKey = keyof typeof az;
export type Language = keyof typeof translations;
