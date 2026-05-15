/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,ts}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Outfit', 'ui-sans-serif', 'system-ui', 'Segoe UI', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', 'sans-serif'],
        display: ['Space Grotesk', 'Outfit', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        glow: '0 24px 60px rgba(24, 86, 79, 0.12)',
        card: '0 18px 50px rgba(34, 24, 76, 0.08)',
      },
      backgroundImage: {
        'editorial-mesh': 'radial-gradient(circle at 12% 18%, rgba(150, 184, 172, 0.18), transparent 28%), radial-gradient(circle at 84% 16%, rgba(196, 209, 203, 0.2), transparent 24%), radial-gradient(circle at 76% 74%, rgba(221, 229, 225, 0.28), transparent 22%), linear-gradient(180deg, #f6f2ea 0%, #f4f1eb 52%, #eef2ef 100%)',
      },
    },
  },
  plugins: [],
}
