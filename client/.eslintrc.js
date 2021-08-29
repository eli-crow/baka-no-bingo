module.exports = {
  extends: [
    'plugin:json/recommended',
    'plugin:vue/vue3-recommended',
  ],
  rules: {
    "vue/comment-directive": 0,
    "vue/singleline-html-element-content-newline": 0,
    "vue/max-attributes-per-line": ["warn", {
      "singleline": {
        "max": 3,
        "allowFirstLine": true,
      }
    }]
  }
}