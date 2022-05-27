import { createApp } from 'vue'
import App from './App.vue'

import router from "./router/index"
import { createPinia } from 'pinia'

import mitt from 'mitt'
const eventBus = mitt()

const app = createApp(App);

app.use(router)
app.use(createPinia())
app.config.globalProperties.eventBus = eventBus
app.mount('#app');
