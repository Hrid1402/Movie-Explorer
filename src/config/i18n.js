import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

i18n
  .use(LanguageDetector) // Detect user's language
  .use(initReactI18next)
  .init({
    fallbackLng: "en", // Default language if detection fails
    supportedLngs: ["en", "es", "fr"], // Add more as needed
    interpolation: { escapeValue: false },
    resources: {
        en: {
          translation: {
            movies: 'Movies',
            shows: 'Shows',
            home: 'Home',
            ogTitle: 'Original Title',
            add: 'Add to Library',
            seasons: 'Seasons',
            episodes: 'Episodes',
            cast: 'Cast',
            similar: 'Similar Titles'
          }
        },
        es: {
          translation: {
            movies: 'Peliculas',
            shows: 'Series',
            home: 'Inicio',
            ogTitle: 'Título Original',
            add: 'Agregar a la Biblioteca',
            seasons: 'Temporadas',
            episodes: 'Episodios',
            cast: 'Elenco',
            similar: 'Títulos Similares'
          }
        }
      }
  });

export default i18n;