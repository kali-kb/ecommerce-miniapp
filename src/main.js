import { createApp } from 'vue'
import './main.css'
import router from '../src/navigation/routes'
import App from './App.vue'

const app = createApp(App);

app.use(router);
app.mount('#app');