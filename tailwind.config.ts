import type { Config } from 'tailwindcss'
import plugin from 'tailwindcss/plugin'
import { keyframes, animations } from './src/lib/design-tokens'

const config: Config = {
  content: [
    './src/**/*.{js,jsx,ts,tsx,html}',
    './index.html',
    './public/**/*.html'
  ],
  darkMode: 'class',
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px"
      }
    },
    // CSS variables for theme switching
    cssVariables: {
      light: {
        // Defined in design-tokens.ts
      },
      dark: {
        // Defined in design-tokens.ts
      }
    },
    extend: {
      colors: {
        primary: {
          DEFAULT: '#14b8a6',
          50: '#f0fdfa',
          100: '#ccfbf1',
          200: '#99f6e4',
          300: '#5eead4',
          400: '#2dd4bf',
          500: '#14b8a6',
          600: '#0d9488',
          700: '#0f766e',
          800: '#115e59',
          900: '#134e4a',
          foreground: 'hsl(0 0% 98%)',
        },
        secondary: {
          DEFAULT: 'hsl(217 33% 17%)',
          50: '#f8fafc',
          100: '#E2E8F0',
          200: '#CBD5E1',
          300: '#94A3B8',
          400: '#64748B',
          500: '#475569',
          600: '#334155',
          700: '#1E293B',
          800: '#0F172A',
          900: '#0A0F1A',
          foreground: 'hsl(0 0% 98%)',
        },
        accent: {
          DEFAULT: '#2563EB',
          50: '#EFF6FF',
          100: '#DBEAFE',
          200: '#BFDBFE',
          300: '#93C5FD',
          400: '#60A5FA',
          500: '#2563EB',
          600: '#2058D9',
          700: '#1C4EC6',
          800: '#1844B4',
          900: '#143AA1',
          foreground: 'hsl(0 0% 98%)',
        },
        brand: {
          50: "#f0f7ff",
          100: "#e0f1ff",
          200: "#b9dfff",
          300: "#7cc3ff",
          400: "#36a3ff",
          500: "#0c84ff",
          600: "#0062cc",
          700: "#004999",
          800: "#003166",
          900: "#001f40",
          950: "#000f1f",
        },
        navy: {
          50: "#f0f4ff",
          100: "#e0e9ff",
          200: "#c7d6ff",
          300: "#a4bbff",
          400: "#8197ff",
          500: "#6371ff",
          600: "#1e3c72",
          700: "#192f5a",
          800: "#142444",
          900: "#0f1d37",
          950: "#080e1b",
        },
        background: 'hsl(0 0% 100%)',
        foreground: 'hsl(240 10% 3.9%)',
        card: 'hsl(0 0% 100%)',
        'card-foreground': 'hsl(240 10% 3.9%)',
        popover: 'hsl(0 0% 100%)',
        'popover-foreground': 'hsl(240 10% 3.9%)',
        muted: 'hsl(240 4.8% 95.9%)',
        'muted-foreground': 'hsl(240 3.8% 46.1%)',
        destructive: 'hsl(0 84.2% 60.2%)',
        'destructive-foreground': 'hsl(0 0% 98%)',
        border: 'hsl(240 5.9% 90%)',
        input: 'hsl(240 5.9% 90%)',
        ring: 'hsl(240 5.9% 10%)',
        sidebar: {
          DEFAULT: 'hsl(var(--sidebar-background, 240 10% 3.9%))',
          foreground: 'hsl(var(--sidebar-foreground, 0 0% 98%))',
          primary: 'hsl(var(--sidebar-primary, 142 72% 29%))',
          'primary-foreground': 'hsl(var(--sidebar-primary-foreground, 0 0% 98%))',
          accent: 'hsl(var(--sidebar-accent, 217 33% 17%))',
          'accent-foreground': 'hsl(var(--sidebar-accent-foreground, 0 0% 98%))',
          border: 'hsl(var(--sidebar-border, 240 3.7% 15.9%))',
          ring: 'hsl(var(--sidebar-ring, 240 4.9% 83.9%))'
        },
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        heading: ['Inter', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
      },
      fontSize: {
        // Semantic sizes
        'h1': ['clamp(1.875rem, 1.6rem + 1.375vw, 2.25rem)', { lineHeight: '1.2', fontWeight: '600' }],
        'h2': ['clamp(1.5rem, 1.3rem + 1vw, 1.875rem)', { lineHeight: '1.3', fontWeight: '600' }],
        'h3': ['clamp(1.25rem, 1.1rem + 0.75vw, 1.5rem)', { lineHeight: '1.4', fontWeight: '600' }],
        'body': ['clamp(1rem, 0.9rem + 0.5vw, 1.125rem)', { lineHeight: '1.5' }],
        'small': ['clamp(0.875rem, 0.8rem + 0.375vw, 1rem)', { lineHeight: '1.4' }],
        // Fluid typography scale
        'xs': 'clamp(0.75rem, 0.7rem + 0.25vw, 0.875rem)', // 12-14px
        'sm': 'clamp(0.875rem, 0.8rem + 0.375vw, 1rem)', // 14-16px
        'base': 'clamp(1rem, 0.9rem + 0.5vw, 1.125rem)', // 16-18px
        'lg': 'clamp(1.125rem, 1rem + 0.625vw, 1.25rem)', // 18-20px
        'xl': 'clamp(1.25rem, 1.1rem + 0.75vw, 1.5rem)', // 20-24px
        '2xl': 'clamp(1.5rem, 1.3rem + 1vw, 1.875rem)', // 24-30px
        '3xl': 'clamp(1.875rem, 1.6rem + 1.375vw, 2.25rem)', // 30-36px
        '4xl': 'clamp(2.25rem, 1.9rem + 1.75vw, 3rem)', // 36-48px
        '5xl': 'clamp(3rem, 2.5rem + 2.5vw, 4rem)', // 48-64px
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      // Keyframes imported from design-tokens.ts
      keyframes,
      // Animations imported from design-tokens.ts
      animation: animations,
      
      // Custom shadow utilities
      boxShadow: {
        sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
        DEFAULT: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
        md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
        lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
        xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
        '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
        inner: 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)',
        none: 'none',
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
      },
      
      // Backdrop blur for glassmorphism
      backdropBlur: {
        xs: '2px',
        sm: '4px',
        DEFAULT: '8px',
        md: '12px',
        lg: '16px',
        xl: '24px',
        '2xl': '40px',
        '3xl': '64px',
      },
      
      // Background gradients
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'primary-to-accent': 'linear-gradient(to right, var(--primary-500), var(--accent-500))',
        'accent-to-primary': 'linear-gradient(to right, var(--accent-500), var(--primary-500))',
        'primary-to-secondary': 'linear-gradient(to right, var(--primary-500), var(--secondary-500))',
        'secondary-to-primary': 'linear-gradient(to right, var(--secondary-500), var(--primary-500))',
        'accent-to-secondary': 'linear-gradient(to right, var(--accent-500), var(--secondary-500))',
        'secondary-to-accent': 'linear-gradient(to right, var(--secondary-500), var(--accent-500))',
        'primary-fade': 'linear-gradient(to right, var(--primary-500), rgba(var(--primary-500), 0.5))',
        'accent-fade': 'linear-gradient(to right, var(--accent-500), rgba(var(--accent-500), 0.5))',
        'secondary-fade': 'linear-gradient(to right, var(--secondary-500), rgba(var(--secondary-500), 0.5))',
        'shimmer': 'linear-gradient(to right, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0.3) 50%, rgba(255, 255, 255, 0) 100%)',
        'gradient-shimmer': 'linear-gradient(to right, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0.3) 50%, rgba(255, 255, 255, 0) 100%)',
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('tailwindcss-animate'),
    // Custom plugin for glassmorphism utilities
    plugin(function({ addUtilities }) {
      const newUtilities = {
        '.glass-sm': {
          backdropFilter: 'blur(4px)',
          backgroundColor: 'rgba(255, 255, 255, 0.3)',
          '.dark &': {
            backgroundColor: 'rgba(0, 0, 0, 0.3)',
          },
        },
        '.glass': {
          backdropFilter: 'blur(8px)',
          backgroundColor: 'rgba(255, 255, 255, 0.4)',
          '.dark &': {
            backgroundColor: 'rgba(0, 0, 0, 0.4)',
          },
        },
        '.glass-md': {
          backdropFilter: 'blur(12px)',
          backgroundColor: 'rgba(255, 255, 255, 0.5)',
          '.dark &': {
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
          },
        },
        '.glass-lg': {
          backdropFilter: 'blur(16px)',
          backgroundColor: 'rgba(255, 255, 255, 0.6)',
          '.dark &': {
            backgroundColor: 'rgba(0, 0, 0, 0.6)',
          },
        },
        '.glass-xl': {
          backdropFilter: 'blur(24px)',
          backgroundColor: 'rgba(255, 255, 255, 0.7)',
          '.dark &': {
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
          },
        },
        '.glass-primary': {
          backdropFilter: 'blur(12px)',
          backgroundColor: 'rgba(var(--primary-500), 0.1)',
        },
        '.glass-secondary': {
          backdropFilter: 'blur(12px)',
          backgroundColor: 'rgba(var(--secondary-500), 0.1)',
        },
        '.glass-accent': {
          backdropFilter: 'blur(12px)',
          backgroundColor: 'rgba(var(--accent-500), 0.1)',
        },
      }
      addUtilities(newUtilities)
    }),
    // Custom plugin for CSS variables
    plugin(function({ addBase }) {
      addBase({
        ':root': {
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
        '.dark': {
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
        },
      })
    })
  ]
}

export default config
