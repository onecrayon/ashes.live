import vue from '@vitejs/plugin-vue'

module.exports = {
  alias: {
    'vue': 'vue/dist/vue.esm-bundler.js'
  },
  plugins: [vue()]
}
