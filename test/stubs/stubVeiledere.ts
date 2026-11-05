import { SYFOVEILEDER_ROOT } from "@/apiConstants";
import { veiledereMock } from "@/mocks/data/veiledereMock";
import { mockServer } from "../setup";
import { http, HttpResponse } from "msw";

export function stubVeiledere() {
  mockServer.use(
    http.get(`*${SYFOVEILEDER_ROOT}/veiledere`, () =>
      HttpResponse.json(veiledereMock),
    ),
  );
}
