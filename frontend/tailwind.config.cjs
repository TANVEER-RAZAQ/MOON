module.exports = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        /* ── MOON Design System v2 — Full Palette ── */
        /* Paper backgrounds */
        'paper-0': '#FAF6EF',
        'paper-1': '#F4EDE2',
        'paper-2': '#ECE2D1',
        'paper-3': '#E0D3BC',
        /* Ink text */
        'ink-0': '#0B0806',
        'ink-1': '#1F1811',
        'ink-2': '#4A3E31',
        'ink-3': '#8A7A66',
        /* Saffron brand accent */
        'saffron-600': '#B63E0F',
        'saffron-500': '#D2571B',
        'saffron-400': '#E67336',
        'saffron-100': '#FCE4D3',
        /* Product accents */
        'amber-500': '#C58A1E',
        'amber-100': '#F6E5BE',
        'resin-500': '#5A3921',
        'moss-500': '#6B855A',
        'moss-100': '#DCE4D4',
        /* v2 Gold Luxury */
        'gold-lux': '#C9A227',
        'gold-lux-light': '#E8C547',
        'gold-lux-deep': '#8B6F1A',
        'gold-lux-soft': 'rgba(201,162,39,0.08)',
        /* v2 Obsidian dark surfaces */
        'obsidian': '#08060A',
        'obsidian-1': '#100D14',
        'obsidian-2': '#1A1620',
        'obsidian-3': '#251F2E',
        /* v2 Product card image backgrounds */
        'card-shilajit': '#2C1810',
        'card-saffron': '#3D1200',
        'card-honey': '#2B1800',
        'card-irani': '#3A2600',
        'card-almond': '#2A1C0E',
        'card-walnut': '#1E120A',
        'card-ghee': '#2E2400',
        /* Legacy tokens (compatibility) */
        background: '#131313',
        surface: '#131313',
        'surface-container-low': '#1c1b1b',
        'surface-container-high': '#2a2a2a',
        'surface-container-lowest': '#0e0e0e',
        'surface-variant': '#353534',
        secondary: '#ffb68b',
        'secondary-container': '#994702',
        primary: '#bcc2ff',
        'primary-container': '#5e67aa',
        'on-background': '#e5e2e1',
        'on-surface-variant': '#c6c5d2',
        'on-primary-container': '#eeedff',
        'on-secondary-fixed': '#321300',
        'outline-variant': '#464650',
      },
      fontFamily: {
        headline: ['Space Grotesk', 'sans-serif'],
        body: ['Manrope', 'sans-serif'],
        label: ['Manrope', 'sans-serif'],
        display: ['Syncopate', 'sans-serif'],
        serif: ['Fraunces', 'Cormorant Garamond', 'Georgia', 'serif'],
        mark: ['Syncopate', 'Manrope', 'sans-serif'],
      },
      boxShadow: {
        'premium': '0 24px 64px -12px rgba(0,0,0,0.22), 0 8px 20px rgba(0,0,0,0.08)',
        'card-hover': '0 40px 80px -16px rgba(0,0,0,0.28), 0 16px 32px rgba(42,27,16,0.14)',
        'glow-saffron': '0 0 24px rgba(210,87,27,0.16), 0 8px 24px rgba(42,27,16,0.14)',
        'glow-gold': '0 0 20px rgba(201,162,39,0.14), 0 4px 16px rgba(42,27,16,0.10)',
      },
    }
  },
  plugins: []
};
