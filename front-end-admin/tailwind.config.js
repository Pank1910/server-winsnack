module.exports = {
  purge: ['./src/**/*.{html,ts}'], // Đảm bảo Tailwind quét toàn bộ HTML & TS
  theme: {
    extend: {
      colors: {
        'orange-dark': '#FF9413',
        'orange-medium': '#FFE0C3',
        'orange-light': '#FFF8EC',
        'orange': {
          'password': '#FFE0C2',
          '500': '#FF7506',
          '600': '#E56500',
      }
    }
  },
  plugins: []
}}
