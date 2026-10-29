import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import es from './locales/es.json';

// Todo el texto de la web del móvil vive en es.json.
void i18n.use(initReactI18next).init({ lng: 'es', fallbackLng: 'es', resources: { es: { translation: es } }, interpolation: { escapeValue: false } });

export default i18n;
