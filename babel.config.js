module.exports = {
  presets: [
    '@vue/cli-plugin-babel/preset'
  ],
  "plugins": [
    "@babel/plugin-transform-runtime", "@babel/plugin-transform-optional-chaining",
    "@babel/plugin-transform-nullish-coalescing-operator", "@babel/plugin-transform-object-rest-spread"
  ]
}