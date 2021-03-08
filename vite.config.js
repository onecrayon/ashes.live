import vue from '@vitejs/plugin-vue'

module.exports = {
  resolve: {
    alias: {
      'vue': 'vue/dist/vue.esm-bundler.js'
    },
  },
  plugins: [vue()]
}
