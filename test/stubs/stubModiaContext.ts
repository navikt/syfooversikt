import { MODIACONTEXTHOLDER_ROOT } from "@/apiConstants";
import { aktivEnhetMock } from "@/mocks/data/aktivEnhetMock";
import { mockServer } from "../setup";
import { http, HttpResponse } from "msw";
import { mockModiacontextholder } from "@/mocks/modiacontextholder/mockModiacontextholder.ts";

export const stubModiaContext = () => {
  mockServer.use(
    ...mockModiacontextholder,
    http.get(`*${MODIACONTEXTHOLDER_ROOT}/context/aktivenhet`, () =>
      HttpResponse.json(aktivEnhetMock),
    ),
  );
};
