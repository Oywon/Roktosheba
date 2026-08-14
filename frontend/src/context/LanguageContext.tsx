import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'en' | 'bn';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const translations: Record<Language, Record<string, string>> = {
  en: {
    'nav.home': 'Home',
    'nav.find': 'Find Donor',
    'nav.register': 'Register',
    'nav.requests': 'Requests',
    'nav.orgs': 'Organizations',
    'emergency.title': 'Emergency Blood Hotline',
    'emergency.description': 'Call for immediate blood assistance',
    'emergency.spondon': 'Spondon',
    'emergency.badhon': 'BADHON Dhaka Central Zone',
    'language.select': 'Select Language',
    'language.english': 'English',
    'language.bangla': 'বাংলা',
    'theme.dark': 'Dark Mode',
    'theme.light': 'Light Mode',
    'maps.findNearest': 'Find Nearest Blood Center',
    'maps.noResults': 'No blood centers found nearby',
  },
  bn: {
    'nav.home': 'হোম',
    'nav.find': 'দাতা খুঁজুন',
    'nav.register': 'নিবন্ধন',
    'nav.requests': 'অনুরোধ',
    'nav.orgs': 'সংস্থা',
    'emergency.title': 'জরুরি রক্ত হটলাইন',
    'emergency.description': 'তাৎক্ষণিক রক্ত সহায়তার জন্য কল করুন',
    'emergency.spondon': 'স্পন্দন',
    'emergency.badhon': 'বধন ঢাকা কেন্দ্রীয় অঞ্চল',
    'language.select': 'ভাষা নির্বাচন করুন',
    'language.english': 'English',
    'language.bangla': 'বাংলা',
    'theme.dark': 'ডার্ক মোড',
    'theme.light': 'লাইট মোড',
    'maps.findNearest': 'নিকটতম রক্ত কেন্দ্র খুঁজুন',
    'maps.noResults': 'কাছাকাছি কোন রক্ত কেন্দ্র পাওয়া যায়নি',
  },
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('language') as Language | null;
    return saved || 'en';
  });

  useEffect(() => {
    localStorage.setItem('language', language);
    document.documentElement.lang = language;
    document.documentElement.dir = language === 'bn' ? 'ltr' : 'ltr';
  }, [language]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
  };

  const t = (key: string): string => {
    return translations[language][key] || translations.en[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
};
