import { isProd } from "@/utils/miljoUtil.ts";

export function loadDecoratorScript() {
  const cdnEnvironment = isProd() ? "prod" : "dev";
  const script = document.createElement("script");
  script.type = "module";
  script.src = `https://cdn.nav.no/personoversikt/internarbeidsflate-decorator-v3/${cdnEnvironment}/latest/dist/internarbeidsflate-decorator.wc.js`;
  document.head.appendChild(script);
}
