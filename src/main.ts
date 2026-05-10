import { createApp } from "vue";
import { IonicVue } from "@ionic/vue";
import { createPinia } from "pinia";
// import { createRouter, createWebHistory } from 'vue-router'
import { createRouter, createWebHistory } from "@ionic/vue-router";

import App from "./App.vue";
import HomeView from "./views/HomeView.vue";

/* Ionic CSS */
import "@ionic/vue/css/core.css";
import "@ionic/vue/css/normalize.css";
import "@ionic/vue/css/structure.css";
import "@ionic/vue/css/typography.css";
import "@ionic/vue/css/padding.css";
import "@ionic/vue/css/float-elements.css";
import "@ionic/vue/css/text-alignment.css";
import "@ionic/vue/css/text-transformation.css";
import "@ionic/vue/css/flex-utils.css";
import "@ionic/vue/css/display.css";

import "./styles/global.css";

const router = createRouter({
  history: createWebHistory(),
  routes: [{ path: "/", component: HomeView }],
});

const pinia = createPinia();

const app = createApp(App)
  .use(IonicVue, { mode: "ios" })
  .use(router)
  .use(pinia);

app.directive("focus", { mounted: (el) => el.focus() });

router.isReady().then(() => app.mount("#app"));
