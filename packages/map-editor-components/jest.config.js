module.exports = {
  preset: 'ts-jest/presets/js-with-babel',
  transformIgnorePatterns: [
    "/node_modules/(?!(@lit|lit|lit-element|lit-html|@pico2map-.*)/)"
  ]
}
