module.exports = {
  preset: 'ts-jest/presets/js-with-babel',
  transformIgnorePatterns: [
    "/node_modules/(?!(lit-element|lit-html)/)"
  ]
}
