import { createApp } from 'vue'
import Toast from 'vue-toastification'
import router from './router.js'
import App from './App.vue'
// And import styles
import 'vue-toastification/dist/index.css'
import './index.css'

const toastOptions = {
  toastDefaults: {
    // ToastOptions object for each type of toast
    'error': {
        timeout: 30000,
        icon: 'fas fa-exclamation-triangle text-xl',
        toastClassName: 'bg-red',
    },
    'warning': {
      timeout: 15000,
      icon: 'fas fa-exclamation-circle text-xl',
      toastClassName: 'bg-orange',
    },
    'success': {
        timeout: 15000,
        icon: 'fas fa-check-circle text-xl',
        toastClassName: 'bg-green',
    },
    'info': {
      timeout: 15000,
      icon: 'fas fa-info-circle text-xl',
      toastClassName: 'bg-blue',
    }
  },
}

const vue = createApp(App)
vue.use(router)
vue.use(Toast, toastOptions)
vue.mount('#app')
