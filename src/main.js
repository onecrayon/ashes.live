import { createApp } from 'vue'
import router from './router.js'
import App from './App.vue'
import './index.css'

const vue = createApp(App)
vue.use(router)
vue.mount('#app')
