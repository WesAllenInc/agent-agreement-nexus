import type { Config } from 'tailwindcss'

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
        'h1': ['24px', { lineHeight: '1.2', fontWeight: '600' }],
        'h2': ['20px', { lineHeight: '1.3', fontWeight: '600' }],
        'h3': ['16px', { lineHeight: '1.4', fontWeight: '600' }],
        'body': ['14px', { lineHeight: '1.5' }],
        'small': ['12px', { lineHeight: '1.4' }]
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      keyframes: {
        'accordion-down': {
          from: {
            height: '0'
          },
          to: {
            height: 'var(--radix-accordion-content-height)'
          }
        },
        'accordion-up': {
          from: {
            height: 'var(--radix-accordion-content-height)'
          },
          to: {
            height: '0'
          }
        },
        'fade-in': {
          '0%': {
            opacity: '0',
            transform: 'translateY(10px)'
          },
          '100%': {
            opacity: '1',
            transform: 'translateY(0)'
          }
        }
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'fade-in': 'fade-in 0.5s ease-out'
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('tailwindcss-animate')
  ]
}

export default config
