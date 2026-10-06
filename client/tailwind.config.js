/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        navy: '#0B2A6F',
        blue: '#1649B8',
        'bright-blue': '#2563D9',
        orange: '#FF6B00',
        'light-orange': '#FFF1E6',
        'off-white': '#F8FAFC',
        'light-blue-bg': '#F1F6FF',
        'text-primary': '#102A56',
        'text-secondary': '#526581',
        'text-muted': '#7B8BA3',
        border: '#DCE5F2',
        success: '#16A34A',
        warning: '#F59E0B',
        error: '#DC2626',
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card: '0 1px 2px rgba(16, 42, 86, 0.06), 0 4px 16px rgba(16, 42, 86, 0.06)',
        panel: '0 8px 32px rgba(11, 42, 111, 0.12)',
      },
      borderRadius: {
        xl: '14px',
        '2xl': '20px',
      },
    },
  },
  plugins: [],
};
