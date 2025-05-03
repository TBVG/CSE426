
// Service to manage theme customization

// Local storage keys
const OWNED_THEMES_KEY = 'user_themes';
const ACTIVE_THEME_KEY = 'active_theme';

// Get owned themes from local storage
export const getOwnedThemes = (): string[] => {
  if (typeof window === 'undefined') return ['default'];
  
  const stored = localStorage.getItem(OWNED_THEMES_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (e) {
      console.error('Error parsing owned themes:', e);
      return ['default'];
    }
  }
  return ['default']; // Default theme is always owned
};

// Save owned themes to local storage
export const saveOwnedThemes = (themes: string[]): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(OWNED_THEMES_KEY, JSON.stringify(themes));
  }
};

// Add a new theme to owned themes
export const addOwnedTheme = (themeId: string): void => {
  const ownedThemes = getOwnedThemes();
  if (!ownedThemes.includes(themeId)) {
    saveOwnedThemes([...ownedThemes, themeId]);
  }
};

// Get active theme from local storage
export const getActiveTheme = (): string => {
  if (typeof window === 'undefined') return 'default';
  
  const stored = localStorage.getItem(ACTIVE_THEME_KEY);
  return stored || 'default';
};

// Set active theme
export const setActiveTheme = (themeId: string): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(ACTIVE_THEME_KEY, themeId);
  }
};

// Apply theme to document
export const applyTheme = (themeId: string): void => {
  if (typeof window === 'undefined') return;
  
  // Theme definitions - should match those in the CustomizationShop
  const themes: Record<string, string> = {
    'default': '#f3f4f6',
    'deep-blue': '#e0f2fe',
    'sunset-gradient': 'linear-gradient(90deg, hsla(24, 100%, 83%, 1) 0%, hsla(341, 91%, 68%, 1) 100%)',
    'forest-green': '#d1fae5',
    'purple-mist': 'linear-gradient(90deg, hsla(277, 75%, 84%, 1) 0%, hsla(297, 50%, 51%, 1) 100%)',
    'golden-hour': 'linear-gradient(90deg, hsla(39, 100%, 77%, 1) 0%, hsla(22, 90%, 57%, 1) 100%)',
    'cool-mint': 'linear-gradient(90deg, hsla(46, 73%, 75%, 1) 0%, hsla(176, 73%, 88%, 1) 100%)'
  };
  
  // Apply theme to body background
  const themeValue = themes[themeId] || themes['default'];
  document.body.style.background = themeValue;
  document.body.style.backgroundAttachment = 'fixed';
};
