/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      animation: {
        'fadeIn': 'fadeIn 0.5s ease-in-out',
        'shake': 'shake 0.5s',
        'spin': 'spin 1s ease-in-out infinite',
        'scale': 'scale 0.3s ease-in-out',
      },
      keyframes: {
        fadeIn: {
          'from': { opacity: '0', transform: 'translateY(20px)' },
          'to': { opacity: '1', transform: 'translateY(0)' },
        },
        shake: {
          '0%': { transform: 'translateX(0)' },
          '20%': { transform: 'translateX(-10px)' },
          '40%': { transform: 'translateX(10px)' },
          '60%': { transform: 'translateX(-10px)' },
          '80%': { transform: 'translateX(10px)' },
          '100%': { transform: 'translateX(0)' },
        },
        scale: {
          'from': { transform: 'scale(0.95)' },
          'to': { transform: 'scale(1)' },
        }
      },
      borderWidth: {
        '3': '3px',
      },
      colors: {
        'primary-color': '#1877f2',
        'primary-hover': '#166fe5',
        'secondary-color': '#42b72a',
        'secondary-hover': '#36a420',
        'danger-color': '#ff3333',
        'text-primary': '#050505',
        'text-secondary': '#65676b',
        'bg-primary': '#ffffff',
        'bg-secondary': '#f0f2f5',
        'divider-color': '#ced0d4',
      },
      scale: {
        '103': '1.03',
      },
    },
  },
  plugins: [],
}