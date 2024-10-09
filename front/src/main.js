import Vue from "vue";

// Importación de la aplicación principal y configuración del enrutador
import App from "./App.vue";
import router from "./router";

// Importación de BootstrapVue y el complemento de íconos
import { BootstrapVue, IconsPlugin } from "bootstrap-vue";

// Importación del componente AvisoModal
import AvisoModal from "./views/AvisoModal.vue";

// Importación de estilos de Bootstrap y BootstrapVue
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-vue/dist/bootstrap-vue.css";

// Importar el store de Vuex si lo usas
import store from './store'

Vue.config.productionTip = false;

// Uso de BootstrapVue y IconsPlugin
Vue.use(BootstrapVue);
Vue.use(IconsPlugin);

// Registro global del componente AvisoModal
Vue.component("AvisoModal", AvisoModal);

// Montaje de la instancia principal de Vue
new Vue({
  router, // Enrutador
  store, // Store Vuex
  render: (h) => h(App), // Renderizado de la app
}).$mount("#app"); // Monte la app en el elemento con id "app"
