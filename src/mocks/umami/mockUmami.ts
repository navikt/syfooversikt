import { http, HttpResponse } from "msw";

export const mockUmami = http.post(
  "https://reops-event-proxy.ekstern.dev.nav.no/api/send",
  () => {
    return HttpResponse.text("mocked umami");
  },
);
