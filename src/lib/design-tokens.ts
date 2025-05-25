/**
 * Design Tokens for Agent Agreement Nexus
 * 
 * This file centralizes all design system values used throughout the application.
 * It provides a single source of truth for colors, typography, spacing, animations,
 * and other design elements.
 */

// Color System - Base colors defined as CSS variables for theme switching
export const colors = {
  // Primary color with semantic meaning
  primary: {
    50: 'var(--primary-50)',
    100: 'var(--primary-100)',
    200: 'var(--primary-200)',
    300: 'var(--primary-300)',
    400: 'var(--primary-400)',
    500: 'var(--primary-500)',
    600: 'var(--primary-600)',
    700: 'var(--primary-700)',
    800: 'var(--primary-800)',
    900: 'var(--primary-900)',
    950: 'var(--primary-950)',
  },
  // Secondary color for supporting elements
  secondary: {
    50: 'var(--secondary-50)',
    100: 'var(--secondary-100)',
    200: 'var(--secondary-200)',
    300: 'var(--secondary-300)',
    400: 'var(--secondary-400)',
    500: 'var(--secondary-500)',
    600: 'var(--secondary-600)',
    700: 'var(--secondary-700)',
    800: 'var(--secondary-800)',
    900: 'var(--secondary-900)',
    950: 'var(--secondary-950)',
  },
  // Accent color for highlights and important elements
  accent: {
    50: 'var(--accent-50)',
    100: 'var(--accent-100)',
    200: 'var(--accent-200)',
    300: 'var(--accent-300)',
    400: 'var(--accent-400)',
    500: 'var(--accent-500)',
    600: 'var(--accent-600)',
    700: 'var(--accent-700)',
    800: 'var(--accent-800)',
    900: 'var(--accent-900)',
    950: 'var(--accent-950)',
  },
  // Brand colors
  brand: {
    50: 'var(--brand-50)',
    100: 'var(--brand-100)',
    200: 'var(--brand-200)',
    300: 'var(--brand-300)',
    400: 'var(--brand-400)',
    500: 'var(--brand-500)',
    600: 'var(--brand-600)',
    700: 'var(--brand-700)',
    800: 'var(--brand-800)',
    900: 'var(--brand-900)',
    950: 'var(--brand-950)',
  },
  // Navy colors
  navy: {
    50: 'var(--navy-50)',
    100: 'var(--navy-100)',
    200: 'var(--navy-200)',
    300: 'var(--navy-300)',
    400: 'var(--navy-400)',
    500: 'var(--navy-500)',
    600: 'var(--navy-600)',
    700: 'var(--navy-700)',
    800: 'var(--navy-800)',
    900: 'var(--navy-900)',
    950: 'var(--navy-950)',
  },
  // Semantic UI colors
  background: 'var(--background)',
  foreground: 'var(--foreground)',
  card: 'var(--card)',
  cardForeground: 'var(--card-foreground)',
  popover: 'var(--popover)',
  popoverForeground: 'var(--popover-foreground)',
  muted: 'var(--muted)',
  mutedForeground: 'var(--muted-foreground)',
  destructive: 'var(--destructive)',
  destructiveForeground: 'var(--destructive-foreground)',
  border: 'var(--border)',
  input: 'var(--input)',
  ring: 'var(--ring)',
  // Success, warning, info colors
  success: {
    50: 'var(--success-50)',
    100: 'var(--success-100)',
    500: 'var(--success-500)',
    900: 'var(--success-900)',
  },
  warning: {
    50: 'var(--warning-50)',
    100: 'var(--warning-100)',
    500: 'var(--warning-500)',
    900: 'var(--warning-900)',
  },
  info: {
    50: 'var(--info-50)',
    100: 'var(--info-100)',
    500: 'var(--info-500)',
    900: 'var(--info-900)',
  },
};

// Typography System - Fluid typography using clamp()
export const typography = {
  fontFamily: {
    sans: ['Inter', 'sans-serif'],
    heading: ['Inter', 'sans-serif'],
    body: ['Inter', 'sans-serif'],
  },
  // Fluid typography scale using clamp()
  fontSize: {
    xs: 'clamp(0.75rem, 0.7rem + 0.25vw, 0.875rem)', // 12-14px
    sm: 'clamp(0.875rem, 0.8rem + 0.375vw, 1rem)', // 14-16px
    base: 'clamp(1rem, 0.9rem + 0.5vw, 1.125rem)', // 16-18px
    lg: 'clamp(1.125rem, 1rem + 0.625vw, 1.25rem)', // 18-20px
    xl: 'clamp(1.25rem, 1.1rem + 0.75vw, 1.5rem)', // 20-24px
    '2xl': 'clamp(1.5rem, 1.3rem + 1vw, 1.875rem)', // 24-30px
    '3xl': 'clamp(1.875rem, 1.6rem + 1.375vw, 2.25rem)', // 30-36px
    '4xl': 'clamp(2.25rem, 1.9rem + 1.75vw, 3rem)', // 36-48px
    '5xl': 'clamp(3rem, 2.5rem + 2.5vw, 4rem)', // 48-64px
  },
  fontWeight: {
    thin: '100',
    extralight: '200',
    light: '300',
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
    extrabold: '800',
    black: '900',
  },
  lineHeight: {
    none: '1',
    tight: '1.25',
    snug: '1.375',
    normal: '1.5',
    relaxed: '1.625',
    loose: '2',
  },
  letterSpacing: {
    tighter: '-0.05em',
    tight: '-0.025em',
    normal: '0',
    wide: '0.025em',
    wider: '0.05em',
    widest: '0.1em',
  },
};

// Spacing System
export const spacing = {
  '0': '0',
  '0.5': '0.125rem',
  '1': '0.25rem',
  '1.5': '0.375rem',
  '2': '0.5rem',
  '2.5': '0.625rem',
  '3': '0.75rem',
  '3.5': '0.875rem',
  '4': '1rem',
  '5': '1.25rem',
  '6': '1.5rem',
  '7': '1.75rem',
  '8': '2rem',
  '9': '2.25rem',
  '10': '2.5rem',
  '11': '2.75rem',
  '12': '3rem',
  '14': '3.5rem',
  '16': '4rem',
  '18': '4.5rem',
  '20': '5rem',
  '24': '6rem',
  '28': '7rem',
  '32': '8rem',
  '36': '9rem',
  '40': '10rem',
  '44': '11rem',
  '48': '12rem',
  '52': '13rem',
  '56': '14rem',
  '60': '15rem',
  '64': '16rem',
  '72': '18rem',
  '80': '20rem',
  '88': '22rem',
  '96': '24rem',
  '128': '32rem',
};

// Border Radius
export const borderRadius = {
  none: '0',
  sm: 'calc(var(--radius) - 4px)',
  md: 'calc(var(--radius) - 2px)',
  lg: 'var(--radius)',
  xl: 'calc(var(--radius) + 2px)',
  '2xl': 'calc(var(--radius) + 4px)',
  '3xl': 'calc(var(--radius) + 8px)',
  full: '9999px',
};

// Shadows - Enhanced for depth perception
export const shadows = {
  sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
  DEFAULT: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
  md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
  lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
  xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
  '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
  inner: 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)',
  // Custom shadows for depth
  'elevation-1': '0 1px 2px rgba(0, 0, 0, 0.05), 0 1px 3px rgba(0, 0, 0, 0.1)',
  'elevation-2': '0 2px 4px rgba(0, 0, 0, 0.05), 0 3px 6px rgba(0, 0, 0, 0.1)',
  'elevation-3': '0 4px 8px rgba(0, 0, 0, 0.05), 0 6px 12px rgba(0, 0, 0, 0.1)',
  'elevation-4': '0 8px 16px rgba(0, 0, 0, 0.05), 0 12px 24px rgba(0, 0, 0, 0.1)',
  'elevation-5': '0 16px 32px rgba(0, 0, 0, 0.05), 0 24px 48px rgba(0, 0, 0, 0.1)',
  // Colored shadows
  'primary-sm': '0 2px 8px var(--shadow-primary-light)',
  'primary-md': '0 4px 12px var(--shadow-primary)',
  'primary-lg': '0 8px 20px var(--shadow-primary-dark)',
  'accent-sm': '0 2px 8px var(--shadow-accent-light)',
  'accent-md': '0 4px 12px var(--shadow-accent)',
  'accent-lg': '0 8px 20px var(--shadow-accent-dark)',
};

// Glassmorphism utilities
export const glass = {
  sm: 'backdrop-blur-sm bg-white/30 dark:bg-black/30',
  DEFAULT: 'backdrop-blur-md bg-white/40 dark:bg-black/40',
  md: 'backdrop-blur-md bg-white/50 dark:bg-black/50',
  lg: 'backdrop-blur-lg bg-white/60 dark:bg-black/60',
  xl: 'backdrop-blur-xl bg-white/70 dark:bg-black/70',
  // Colored glass
  primary: 'backdrop-blur-md bg-primary-500/10',
  secondary: 'backdrop-blur-md bg-secondary-500/10',
  accent: 'backdrop-blur-md bg-accent-500/10',
};

// Gradients
export const gradients = {
  'primary-to-accent': 'bg-gradient-to-r from-primary-500 to-accent-500',
  'accent-to-primary': 'bg-gradient-to-r from-accent-500 to-primary-500',
  'primary-to-secondary': 'bg-gradient-to-r from-primary-500 to-secondary-500',
  'secondary-to-primary': 'bg-gradient-to-r from-secondary-500 to-primary-500',
  'accent-to-secondary': 'bg-gradient-to-r from-accent-500 to-secondary-500',
  'secondary-to-accent': 'bg-gradient-to-r from-secondary-500 to-accent-500',
  'primary-fade': 'bg-gradient-to-r from-primary-500 to-primary-500/50',
  'accent-fade': 'bg-gradient-to-r from-accent-500 to-accent-500/50',
  'secondary-fade': 'bg-gradient-to-r from-secondary-500 to-secondary-500/50',
  'dark-to-light': 'bg-gradient-to-b from-gray-900 to-gray-600',
  'light-to-dark': 'bg-gradient-to-b from-gray-100 to-gray-300',
};

// Animation keyframes
export const keyframes = {
  // Existing animations
  'accordion-down': {
    from: { height: '0' },
    to: { height: 'var(--radix-accordion-content-height)' },
  },
  'accordion-up': {
    from: { height: 'var(--radix-accordion-content-height)' },
    to: { height: '0' },
  },
  'fade-in': {
    '0%': { opacity: '0', transform: 'translateY(10px)' },
    '100%': { opacity: '1', transform: 'translateY(0)' },
  },
  // New animations
  'fade-up': {
    '0%': { opacity: '0', transform: 'translateY(20px)' },
    '100%': { opacity: '1', transform: 'translateY(0)' },
  },
  'slide-in': {
    '0%': { transform: 'translateX(-100%)' },
    '100%': { transform: 'translateX(0)' },
  },
  'shimmer': {
    '0%': { backgroundPosition: '-200% 0' },
    '100%': { backgroundPosition: '200% 0' },
  },
  'float': {
    '0%, 100%': { transform: 'translateY(0)' },
    '50%': { transform: 'translateY(-10px)' },
  },
  'pulse-border': {
    '0%, 100%': { borderColor: 'transparent' },
    '50%': { borderColor: 'currentColor' },
  },
  'scale': {
    '0%': { transform: 'scale(0.95)' },
    '100%': { transform: 'scale(1)' },
  },
  'rotate': {
    '0%': { transform: 'rotate(0deg)' },
    '100%': { transform: 'rotate(360deg)' },
  },
  'ping': {
    '75%, 100%': { transform: 'scale(2)', opacity: '0' },
  },
};

// Animation configurations
export const animations = {
  // Existing animations
  'accordion-down': 'accordion-down 0.2s ease-out',
  'accordion-up': 'accordion-up 0.2s ease-out',
  'fade-in': 'fade-in 0.5s ease-out',
  // New animations
  'fade-up': 'fade-up 0.5s ease-out',
  'slide-in': 'slide-in 0.3s ease-out',
  'shimmer': 'shimmer 2s infinite linear',
  'float': 'float 3s ease-in-out infinite',
  'pulse-border': 'pulse-border 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
  'scale': 'scale 0.2s ease-in-out',
  'rotate': 'rotate 1s linear infinite',
  'ping': 'ping 1s cubic-bezier(0, 0, 0.2, 1) infinite',
  // Combinations
  'enter': 'fade-up 0.3s ease-out, scale 0.3s ease-out',
};

// CSS Variables to be injected into :root
export const cssVariables = {
  light: {
    // Base colors
    '--background': '0 0% 100%',
    '--foreground': '240 10% 3.9%',
    '--card': '0 0% 100%',
    '--card-foreground': '240 10% 3.9%',
    '--popover': '0 0% 100%',
    '--popover-foreground': '240 10% 3.9%',
    '--primary-50': '166 84% 97%',
    '--primary-100': '167 85% 89%',
    '--primary-200': '168 84% 78%',
    '--primary-300': '171 77% 64%',
    '--primary-400': '172 66% 50%',
    '--primary-500': '173 80% 40%',
    '--primary-600': '174 84% 32%',
    '--primary-700': '175 77% 26%',
    '--primary-800': '176 69% 22%',
    '--primary-900': '176 61% 19%',
    '--primary-950': '178 75% 9%',
    '--primary-foreground': '0 0% 98%',
    '--secondary-50': '220 14% 96%',
    '--secondary-100': '220 13% 91%',
    '--secondary-200': '220 13% 86%',
    '--secondary-300': '216 12% 70%',
    '--secondary-400': '217 11% 55%',
    '--secondary-500': '220 9% 46%',
    '--secondary-600': '215 14% 34%',
    '--secondary-700': '217 33% 17%',
    '--secondary-800': '215 28% 13%',
    '--secondary-900': '221 39% 11%',
    '--secondary-950': '224 71% 4%',
    '--secondary-foreground': '0 0% 98%',
    '--accent-50': '217 100% 97%',
    '--accent-100': '214 95% 93%',
    '--accent-200': '213 97% 87%',
    '--accent-300': '212 96% 78%',
    '--accent-400': '213 94% 68%',
    '--accent-500': '217 91% 60%',
    '--accent-600': '221 83% 53%',
    '--accent-700': '224 76% 48%',
    '--accent-800': '226 71% 40%',
    '--accent-900': '224 64% 33%',
    '--accent-950': '226 57% 21%',
    '--accent-foreground': '0 0% 98%',
    '--muted': '240 4.8% 95.9%',
    '--muted-foreground': '240 3.8% 46.1%',
    '--destructive': '0 84.2% 60.2%',
    '--destructive-foreground': '0 0% 98%',
    '--border': '240 5.9% 90%',
    '--input': '240 5.9% 90%',
    '--ring': '240 5.9% 10%',
    '--radius': '0.5rem',
    // Shadow colors
    '--shadow-primary-light': 'rgba(20, 184, 166, 0.1)',
    '--shadow-primary': 'rgba(20, 184, 166, 0.2)',
    '--shadow-primary-dark': 'rgba(20, 184, 166, 0.3)',
    '--shadow-accent-light': 'rgba(37, 99, 235, 0.1)',
    '--shadow-accent': 'rgba(37, 99, 235, 0.2)',
    '--shadow-accent-dark': 'rgba(37, 99, 235, 0.3)',
    // Success, warning, info colors
    '--success-50': '142 76% 97%',
    '--success-100': '141 84% 93%',
    '--success-500': '142 71% 45%',
    '--success-900': '144 61% 20%',
    '--warning-50': '38 92% 95%',
    '--warning-100': '38 94% 88%',
    '--warning-500': '38 92% 50%',
    '--warning-900': '32 81% 29%',
    '--info-50': '214 100% 97%',
    '--info-100': '214 95% 93%',
    '--info-500': '217 91% 60%',
    '--info-900': '224 64% 33%',
  },
  dark: {
    // Base colors
    '--background': '240 10% 3.9%',
    '--foreground': '0 0% 98%',
    '--card': '240 10% 3.9%',
    '--card-foreground': '0 0% 98%',
    '--popover': '240 10% 3.9%',
    '--popover-foreground': '0 0% 98%',
    '--primary-50': '166 84% 97%',
    '--primary-100': '167 85% 89%',
    '--primary-200': '168 84% 78%',
    '--primary-300': '171 77% 64%',
    '--primary-400': '172 66% 50%',
    '--primary-500': '173 80% 40%',
    '--primary-600': '174 84% 32%',
    '--primary-700': '175 77% 26%',
    '--primary-800': '176 69% 22%',
    '--primary-900': '176 61% 19%',
    '--primary-950': '178 75% 9%',
    '--primary-foreground': '0 0% 98%',
    '--secondary-50': '220 14% 96%',
    '--secondary-100': '220 13% 91%',
    '--secondary-200': '220 13% 86%',
    '--secondary-300': '216 12% 70%',
    '--secondary-400': '217 11% 55%',
    '--secondary-500': '220 9% 46%',
    '--secondary-600': '215 14% 34%',
    '--secondary-700': '217 33% 17%',
    '--secondary-800': '215 28% 13%',
    '--secondary-900': '221 39% 11%',
    '--secondary-950': '224 71% 4%',
    '--secondary-foreground': '0 0% 98%',
    '--accent-50': '217 100% 97%',
    '--accent-100': '214 95% 93%',
    '--accent-200': '213 97% 87%',
    '--accent-300': '212 96% 78%',
    '--accent-400': '213 94% 68%',
    '--accent-500': '217 91% 60%',
    '--accent-600': '221 83% 53%',
    '--accent-700': '224 76% 48%',
    '--accent-800': '226 71% 40%',
    '--accent-900': '224 64% 33%',
    '--accent-950': '226 57% 21%',
    '--accent-foreground': '0 0% 98%',
    '--muted': '240 3.7% 15.9%',
    '--muted-foreground': '240 5% 64.9%',
    '--destructive': '0 62.8% 30.6%',
    '--destructive-foreground': '0 0% 98%',
    '--border': '240 3.7% 15.9%',
    '--input': '240 3.7% 15.9%',
    '--ring': '240 4.9% 83.9%',
    '--radius': '0.5rem',
    // Shadow colors
    '--shadow-primary-light': 'rgba(20, 184, 166, 0.1)',
    '--shadow-primary': 'rgba(20, 184, 166, 0.2)',
    '--shadow-primary-dark': 'rgba(20, 184, 166, 0.3)',
    '--shadow-accent-light': 'rgba(37, 99, 235, 0.1)',
    '--shadow-accent': 'rgba(37, 99, 235, 0.2)',
    '--shadow-accent-dark': 'rgba(37, 99, 235, 0.3)',
    // Success, warning, info colors
    '--success-50': '142 76% 97%',
    '--success-100': '141 84% 93%',
    '--success-500': '142 71% 45%',
    '--success-900': '144 61% 20%',
    '--warning-50': '38 92% 95%',
    '--warning-100': '38 94% 88%',
    '--warning-500': '38 92% 50%',
    '--warning-900': '32 81% 29%',
    '--info-50': '214 100% 97%',
    '--info-100': '214 95% 93%',
    '--info-500': '217 91% 60%',
    '--info-900': '224 64% 33%',
  },
};

export default {
  colors,
  typography,
  spacing,
  borderRadius,
  shadows,
  glass,
  gradients,
  keyframes,
  animations,
  cssVariables,
};
