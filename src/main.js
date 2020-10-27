import { createApp } from 'vue'
import router from './router.js'
import App from './App.vue'
import './index.css'
import 'noty/lib/noty.css'
import 'noty/lib/themes/metroui.css'

const vue = createApp(App)
vue.use(router)
vue.mount('#app')
