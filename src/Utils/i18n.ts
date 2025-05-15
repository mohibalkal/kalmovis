import { useState, useEffect } from "react";

// Import all translation files
import ar from "../locales/ar.json";
import en from "../locales/en.json";

// Define available languages
export const languages = {
  ar: "العربية",
  en: "English",
};

// Create translations object
const translations = {
  ar,
  en,
};

const SERVER_DEFAULT_LANG = "en";

// Get user's preferred language from localStorage or default to English
export const getLanguagePreference = () => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("language") || SERVER_DEFAULT_LANG;
  }
  return SERVER_DEFAULT_LANG;
};

// Custom hook for translations
export const useTranslation = () => {
  // Start with the server's default language
  const [language, setLanguage] = useState(SERVER_DEFAULT_LANG);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // This effect runs only on the client after hydration
    setIsClient(true);
    const preferredLanguage = getLanguagePreference();
    if (languages[preferredLanguage as keyof typeof languages]) {
      setLanguage(preferredLanguage);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty dependency array ensures this runs once after mount

  useEffect(() => {
    if (isClient && languages[language as keyof typeof languages]) {
      localStorage.setItem("language", language);
      document.documentElement.dir = "ltr"; // Force LTR for scrollbar on right, content direction will be handled by Layout
    }
  }, [language, isClient]);

  const t = (key: string) => {
    const currentLang = isClient ? language : SERVER_DEFAULT_LANG;
    // Ensure currentLang is a valid key for translations
    const langToUse = translations[currentLang as keyof typeof translations]
      ? currentLang
      : SERVER_DEFAULT_LANG;

    const keys = key.split(".");
    let translation: any = translations[langToUse as keyof typeof translations];

    for (const k of keys) {
      if (translation && translation[k] !== undefined) {
        translation = translation[k];
      } else {
        // console.warn(`Translation key not found: ${key} for language ${langToUse}`);
        // Fallback to English if key not found in current language, or return key itself
        let fallbackTranslation: any =
          translations[SERVER_DEFAULT_LANG as keyof typeof translations];
        let foundInFallback = true;
        for (const fb_k of keys) {
          if (fallbackTranslation && fallbackTranslation[fb_k] !== undefined) {
            fallbackTranslation = fallbackTranslation[fb_k];
          } else {
            foundInFallback = false;
            break;
          }
        }
        return foundInFallback ? fallbackTranslation : key; // Key not found in fallback either
      }
    }
    return translation;
  };

  const setDisplayLanguage = (langKey: string) => {
    if (languages[langKey as keyof typeof languages]) {
      setLanguage(langKey);
    } else {
      console.warn(`Attempted to set an unsupported language: ${langKey}`);
    }
  };

  return {
    language: isClient ? language : SERVER_DEFAULT_LANG,
    setLanguage: setDisplayLanguage,
    t,
    isClient, // Optionally expose isClient if needed by components
  };
};
