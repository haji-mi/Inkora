/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        mac: {
          bg: {
            light: '#F5F5F7',
            dark: '#1E1E1E',
          },
          surface: {
            light: 'rgba(255, 255, 255, 0.72)',
            dark: 'rgba(36, 36, 36, 0.76)',
          },
          border: {
            light: 'rgba(0, 0, 0, 0.08)',
            dark: 'rgba(255, 255, 255, 0.08)',
          },
          text: {
            primary: '#1D1D1F',
            secondary: '#86868B',
            darkPrimary: '#F5F5F7',
            darkSecondary: '#A1A1A6',
          },
          accent: '#0071E3',
        }
      },
      fontFamily: {
        sans: [
          "-apple-system",
          "BlinkMacSystemFont",
          "SF Pro Text",
          "PingFang SC",
          "Hiragino Sans GB",
          "Microsoft YaHei",
          "Segoe UI",
          "sans-serif"
        ],
        mono: [
          "SF Mono",
          "Menlo",
          "Monaco",
          "Consolas",
          "Fira Code",
          "Courier New",
          "monospace"
        ]
      },
      boxShadow: {
        'mac-window': '0 20px 48px -12px rgba(0, 0, 0, 0.28), 0 0 0 1px rgba(0, 0, 0, 0.08)',
        'mac-window-dark': '0 20px 48px -12px rgba(0, 0, 0, 0.65), 0 0 0 1px rgba(255, 255, 255, 0.1)',
        'mac-card': '0 2px 8px rgba(0, 0, 0, 0.04), 0 0 0 1px rgba(0, 0, 0, 0.04)',
      }
    },
  },
  plugins: [],
}
