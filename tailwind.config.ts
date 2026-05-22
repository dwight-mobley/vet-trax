// tailwind.config.ts
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Clinical Teal
        primary: {
          DEFAULT: '#0F766E',
          light: '#2DD4BF',
          dark: '#115E59',
          contrast: '#FFFFFF',
        },
        // Approachable Warm Orange
        secondary: {
          DEFAULT: '#F97316',
          light: '#FDBA74',
          dark: '#C2410C',
          contrast: '#FFFFFF',
        },
        accent: {
          DEFAULT: '#0EA5E9',
          light: '#7DD3FC',
          dark: '#0284C7',
        },
        // Base UI Colors
        background: {
          DEFAULT: '#F8FAFC',
          paper: '#FFFFFF',
        },
        text: {
          primary: '#0F172A',
          secondary: '#64748B',
          disabled: '#CBD5E1',
        },
        // Medical/Notification Statuses
        status: {
          healthy: '#22C55E',
          warning: '#F59E0B',
          critical: '#EF4444',
          info: '#3B82F6',
        }
      },
      fontFamily: {
        // Maps to the CSS variable we'll set in layout.tsx
        sans: ['var(--font-inter)'],
      },
      borderRadius: {
        small: '4px',
        DEFAULT: '8px', // Our medium friendly corner
        large: '16px',
      }
    },
  },
  plugins: [],
};
export default config;