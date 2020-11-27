import { createApp } from 'vue'
import Toast from 'vue-toastification'
import router from './router.js'
import store from './store/index.js'
import App from './App.vue'
import CardLink from '/src/components/global/CardLink.vue'
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

const app = createApp(App)
// CardLink needs to be a global component because otherwise circular imports break things
app.component('card-link', CardLink)
// Setup plug-ins
app.use(router)
app.use(store)
app.use(Toast, toastOptions)
// And finally mount up and get running!
app.mount('#app')
