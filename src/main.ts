
import { createApp } from 'vue'
import App from './App.vue'
import {router} from './router'
import VueKonva from "vue-konva";
import "@mdi/font/css/materialdesignicons.css";
import VueConfirmDialog from 'vue-confirm-dialog'




export const app = createApp(App)

app.use(router)
app.use(VueConfirmDialog)
app.use(VueKonva);

app.mount('#app')
