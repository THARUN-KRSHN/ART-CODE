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
        ivory: {
          DEFAULT: "#FAF8F3",
          50: "#FDFCFB",
          100: "#FAF8F3",
          200: "#F2EFE8",
          300: "#E9E5DD",
        },
        ink: {
          DEFAULT: "#20201E",
          pure: "#121211",
          secondary: "#62615C",
          muted: "#8A8882",
        },
        terracotta: {
          DEFAULT: "#C66A4A",
          50: "#FAF0EC",
          100: "#F5DFD7",
          200: "#E8BDB0",
          500: "#C66A4A",
          600: "#B0583A",
          700: "#8C4229",
        },
        indigo: {
          DEFAULT: "#414B75",
          50: "#EDEFF6",
          100: "#D7DBED",
          500: "#414B75",
          600: "#343D61",
          700: "#272E4C",
        },
        saffron: {
          DEFAULT: "#D5A545",
          50: "#FBF6E9",
          100: "#F6ECCF",
          500: "#D5A545",
          600: "#BE9035",
        },
        sage: {
          DEFAULT: "#82947B",
          50: "#F3F5F2",
          100: "#E4E9E2",
          500: "#82947B",
          600: "#6D7E66",
        },
        border: {
          DEFAULT: "#E9E5DD",
          soft: "#E9E5DD",
          dark: "#D1CBC1",
        },
        status: {
          success: "#347553",
          warning: "#D5A545",
          error: "#B74343",
          info: "#414B75",
        }
      },
      fontFamily: {
        sans: ["var(--font-sans)", "Plus Jakarta Sans", "Manrope", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "sans-serif"],
        serif: ["var(--font-serif)", "DM Serif Display", "Georgia", "serif"],
      },
      borderRadius: {
        'card': '16px',
        'subtle': '12px',
      },
      boxShadow: {
        'subtle': '0 2px 8px -2px rgba(32, 32, 30, 0.05), 0 1px 3px -1px rgba(32, 32, 30, 0.03)',
        'elevated': '0 8px 24px -4px rgba(32, 32, 30, 0.08), 0 2px 6px -2px rgba(32, 32, 30, 0.04)',
      }
    },
  },
  plugins: [],
};
export default config;

