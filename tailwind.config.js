/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Primary - Backgrounds
        'huyet-da': '#1A0A0A',      // Main bg
        'am-hong': '#2D1B1B',       // Section bg
        'tham-hong': '#3D2424',     // Cards

        // Accent - Interactive
        'xich-viem': '#FF4444',     // Primary accent
        'hoa-quang': '#FF8C00',     // Secondary accent
        'liet-diem': '#FF6B35',     // Tertiary

        // Special
        'hoang-kim': '#FFD700',     // Gold - Important
        'linh-hoa': '#FF4500',      // Energy/particles

        // Text
        'co-chi': '#F5E6D3',        // Main text
        'tho-kim': '#C4A77D',       // Secondary text
        'am-tho': '#8B7355',        // Muted text
      },
      fontFamily: {
        heading: ['Cinzel Decorative', 'Cinzel', 'serif'],
        display: ['Cinzel', 'serif'],
        body: ['Crimson Pro', 'Cormorant Garamond', 'serif'],
        accent: ['Cormorant Garamond', 'serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      boxShadow: {
        'glow': '0 0 20px rgba(255, 68, 68, 0.4)',
        'glow-md': '0 0 30px rgba(255, 68, 68, 0.5)',
        'glow-lg': '0 0 40px rgba(255, 68, 68, 0.6)',
        'fire': '0 0 40px rgba(255, 140, 0, 0.3)',
        'gold': '0 0 30px rgba(255, 215, 0, 0.4)',
      },
      backgroundImage: {
        'gradient-fire': 'linear-gradient(135deg, #FF4444 0%, #FF8C00 50%, #FFD700 100%)',
        'gradient-dark': 'linear-gradient(180deg, #1A0A0A 0%, #2D1B1B 100%)',
        'gradient-radial-fire': 'radial-gradient(circle, #FF4444 0%, transparent 70%)',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
        'flame': 'flame 1s ease-in-out infinite',
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.5s ease-out',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'pulse-glow': {
          '0%, 100%': { boxShadow: '0 0 20px rgba(255, 68, 68, 0.4)' },
          '50%': { boxShadow: '0 0 40px rgba(255, 68, 68, 0.8)' },
        },
        flame: {
          '0%, 100%': { transform: 'scaleY(1) scaleX(1)' },
          '50%': { transform: 'scaleY(1.1) scaleX(0.9)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
};
