export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
    ...(process.env.NODE_ENV === 'production' && {
      cssnano: {
        preset: ['default', {
          discardComments: { removeAll: true },
          minifyFontValues: { removeQuotes: false },
          normalizeWhitespace: true,
          colormin: false, // Preserve CSS custom properties
          reduceIdents: false, // Preserve animation names
        }]
      }
    })
  },
}
