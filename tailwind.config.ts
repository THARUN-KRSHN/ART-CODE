import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // ART//CODE 2026 Official Poster Colour Palette
        vermilion: {
          DEFAULT: "#A32516", // Primary Red
          50: "#FCF0EE",
          100: "#F8DDD9",
          200: "#F0B7AE",
          300: "#E58A7D",
          400: "#D35543",
          500: "#A32516", // Primary brand red
          600: "#8C1F12",
          700: "#6E180E",
          800: "#52120A",
          900: "#360C07",
        },
        accentGold: {
          DEFAULT: "#F1B321", // Accent Yellow / Gold
          50: "#FEF9EC",
          100: "#FDF0CE",
          200: "#F9DF9C",
          300: "#F5CE6B",
          400: "#F3BE3E",
          500: "#F1B321", // Brand Accent Yellow
          600: "#CB9414",
          700: "#9C700D",
        },
        cream: {
          DEFAULT: "#F7E7C6", // Background Warm Cream
          50: "#FDFBF5",
          100: "#FAF3E3",
          200: "#F7E7C6", // Official background
          300: "#EED7A8",
          400: "#E2C386",
          500: "#D4AC64",
        },
        paleCream: {
          DEFAULT: "#FCE9CC", // Card Background / Input surfaces
          50: "#FFFAF2",
          100: "#FEF4E4",
          200: "#FCE9CC", // Official card surface
          300: "#F8D7A8",
          400: "#F2C07D",
        },
        darkRed: {
          DEFAULT: "#6B2B12", // Dark Red / Deep contrast / Footer
          50: "#F9EFEA",
          100: "#F2DEC9",
          500: "#6B2B12",
          600: "#55210D",
          700: "#401708",
        },
        ink: {
          DEFAULT: "#1F1A14", // Ink Black / Primary text
          pure: "#120E0A",
          secondary: "#4A4237",
          muted: "#756B5C",
        },
        secondaryRed: {
          DEFAULT: "#8C3D20", // Secondary Red / Terracotta
          50: "#FBF1ED",
          100: "#F6DDD3",
          500: "#8C3D20",
          600: "#732F17",
        },
        mutedGold: {
          DEFAULT: "#D9B88A", // Surface / Dividers / Fine borders
          50: "#FAF6EF",
          100: "#F3EBDD",
          200: "#E9DAC0",
          300: "#D9B88A", // Official Muted Gold
          400: "#C49A61",
        },
        border: {
          DEFAULT: "#D9B88A",
          soft: "#E8D3B5",
          dark: "#B88E56",
        },
        status: {
          success: "#2E6B42",
          warning: "#CB9414",
          error: "#A32516",
          info: "#28456C",
        }
      },
      fontFamily: {
        sans: ["var(--font-sans)", "Plus Jakarta Sans", "system-ui", "sans-serif"],
        serif: ["var(--font-serif)", "DM Serif Display", "Georgia", "serif"],
        display: ["var(--font-display)", "DM Serif Display", "Georgia", "serif"],
      },
      borderRadius: {
        'card': '14px',
        'subtle': '10px',
      },
      boxShadow: {
        'subtle': '0 2px 6px -1px rgba(31, 26, 20, 0.05), 0 1px 3px -1px rgba(31, 26, 20, 0.04)',
        'elevated': '0 8px 24px -4px rgba(107, 43, 18, 0.12), 0 3px 8px -2px rgba(107, 43, 18, 0.08)',
        'poster': '0 12px 36px -6px rgba(163, 37, 22, 0.2), 0 4px 12px -2px rgba(107, 43, 18, 0.1)',
      }
    },
  },
  plugins: [],
};
export default config;
