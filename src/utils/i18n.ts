type Translations = {
  [key: string]: {
    [key: string]: string;
  };
};

// Simple translations for demonstration
const translations: Translations = {
  en: {
    'search.placeholder': 'Search agreements, documents, and more...',
    'notifications.empty': 'No notifications',
    'notifications.markAllRead': 'Mark all as read',
    'notifications.viewAll': 'View all notifications',
    'breadcrumbs.home': 'Home',
    'user.profile': 'Your Profile',
    'user.settings': 'Settings',
    'user.signOut': 'Sign out',
    'user.theme.light': 'Light Mode',
    'user.theme.dark': 'Dark Mode',
    'help.title': 'Help & Support',
    'help.faqs': 'FAQs',
    'help.contact': 'Contact Support',
    'settings.profile': 'Profile',
    'settings.security': 'Security',
    'settings.preferences': 'Preferences',
    'settings.notifications': 'Notifications',
    'security.password': 'Password',
    'security.password.update': 'Update Password',
    'security.twoFactor': 'Two-Factor Authentication',
    'security.twoFactor.enable': 'Enable',
    'security.twoFactor.disable': 'Disable',
    'security.sessions': 'Sessions',
    'security.sessions.signOutAll': 'Sign Out All Other Sessions',
    'auditLog.title': 'Audit Log',
    'auditLog.filter': 'Filter',
    'auditLog.export': 'Export',
    'import.title': 'Import/Export',
    'pagination.previous': 'Previous',
    'pagination.next': 'Next',
    'onboarding.skip': 'Skip',
    'onboarding.next': 'Next',
    'onboarding.getStarted': 'Get Started',
  },
  es: {
    'search.placeholder': 'Buscar acuerdos, documentos y más...',
    'notifications.empty': 'No hay notificaciones',
    'notifications.markAllRead': 'Marcar todo como leído',
    'notifications.viewAll': 'Ver todas las notificaciones',
    'breadcrumbs.home': 'Inicio',
    'user.profile': 'Tu Perfil',
    'user.settings': 'Configuración',
    'user.signOut': 'Cerrar sesión',
    'user.theme.light': 'Modo Claro',
    'user.theme.dark': 'Modo Oscuro',
    'help.title': 'Ayuda y Soporte',
    'help.faqs': 'Preguntas Frecuentes',
    'help.contact': 'Contactar Soporte',
    'settings.profile': 'Perfil',
    'settings.security': 'Seguridad',
    'settings.preferences': 'Preferencias',
    'settings.notifications': 'Notificaciones',
    'security.password': 'Contraseña',
    'security.password.update': 'Actualizar Contraseña',
    'security.twoFactor': 'Autenticación de Dos Factores',
    'security.twoFactor.enable': 'Habilitar',
    'security.twoFactor.disable': 'Deshabilitar',
    'security.sessions': 'Sesiones',
    'security.sessions.signOutAll': 'Cerrar Todas las Otras Sesiones',
    'auditLog.title': 'Registro de Auditoría',
    'auditLog.filter': 'Filtrar',
    'auditLog.export': 'Exportar',
    'import.title': 'Importar/Exportar',
    'pagination.previous': 'Anterior',
    'pagination.next': 'Siguiente',
    'onboarding.skip': 'Omitir',
    'onboarding.next': 'Siguiente',
    'onboarding.getStarted': 'Comenzar',
  },
};

// Current language
let currentLanguage = 'en';

// Translation function
export const t = (key: string, params?: Record<string, string>): string => {
  const translation = translations[currentLanguage]?.[key] || translations.en[key] || key;
  
  if (params) {
    return Object.entries(params).reduce(
      (str, [key, value]) => str.replace(new RegExp(`{{${key}}}`, 'g'), value),
      translation
    );
  }
  
  return translation;
};

// Set language
export const setLanguage = (lang: string): void => {
  if (translations[lang]) {
    currentLanguage = lang;
  }
};

// Get current language
export const getLanguage = (): string => currentLanguage;

// Get available languages
export const getAvailableLanguages = (): string[] => Object.keys(translations);
