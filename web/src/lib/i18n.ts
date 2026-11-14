import vi from "@/locales/vi.json";
import en from "@/locales/en.json";

export type Locale = "vi" | "en";

const dictionaries = { vi, en };

// getDictionary resolves the active localization bundle.
export function getDictionary(locale: Locale = "vi") {
  return dictionaries[locale] || dictionaries.vi;
}

