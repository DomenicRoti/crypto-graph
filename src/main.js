import { createApp } from 'vue'
import axios from 'axios';
import App from './App.vue'
import router from './router'
import store from "./store/store"

axios.interceptors.request.use((config) => ({
  ...config,
  headers: {
    ...config.headers,
    'X-CoinAPI-Key': '6184C51D-212D-4C7D-92EC-772993FA4DFD'
  }
}))

createApp(App).use(router).use(store).mount('#app')
