import { createApp, type Directive } from "vue";
import App from "./App.vue";
import router from "./router";
import Table from "@pureadmin/table";
import VueTippy from "vue-tippy";
import { setupStore } from "@/store";
import { initializeLocale, useI18n } from "@/plugins/i18n";
import { useElementPlus } from "@/plugins/elementPlus";
import { getPlatformConfig } from "@/config";
import { injectResponsiveStorage } from "@/utils/responsive";
import * as directives from "@/directives";
import { Auth } from "@/components/ReAuth";
import { Perms } from "@/components/RePerms";
import {
  IconifyIconOffline,
  IconifyIconOnline,
  FontIcon
} from "@/components/ReIcon";
import "./style/reset.scss";
import "./style/index.scss";
import "./style/tailwind.css";
import "element-plus/dist/index.css";
import "tippy.js/dist/tippy.css";
import "tippy.js/themes/light.css";

const app = createApp(App);

Object.entries(directives).forEach(([name, directive]) => {
  app.directive(name, directive as Directive);
});

app.component("Auth", Auth);
app.component("Perms", Perms);
app.component("IconifyIconOffline", IconifyIconOffline);
app.component("IconifyIconOnline", IconifyIconOnline);
app.component("FontIcon", FontIcon);
app.use(VueTippy);

getPlatformConfig(app).then(async config => {
  initializeLocale();
  setupStore(app);
  app.use(router);
  await router.isReady();
  injectResponsiveStorage(app, config);
  app.use(useI18n).use(useElementPlus).use(Table);
  app.mount("#app");
});
