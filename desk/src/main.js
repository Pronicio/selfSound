import { createApp } from 'vue'
import App from './App.vue'

import { createPinia } from 'pinia'
import router from "./router/index"

import mitt from 'mitt'
const eventBus = mitt()

const app = createApp(App);

app.use(createPinia())
app.use(router)
app.config.globalProperties.eventBus = eventBus
app.mount('#app');
