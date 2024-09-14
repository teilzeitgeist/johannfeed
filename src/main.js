import { createApp } from "vue";
import App from "./App.vue";
import dayjs from "dayjs";
import "dayjs/locale/de";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import localizedFormat from "dayjs/plugin/localizedFormat";

dayjs.extend(localizedFormat);
dayjs.extend(isSameOrBefore);
dayjs.extend(isSameOrAfter);
dayjs.locale("de");

async function initApp() {
  const app = createApp(App);
  app.mount("#app");
}

initApp();
