/// <reference types="vite/client" />
/* eslint-disable */
declare module "*.vue" {
  import type { DefineComponent } from "vue";
  const component: DefineComponent<{}, {}, any>;
  export default component;
}

interface ImportMetaEnv {
  // env variables...
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
