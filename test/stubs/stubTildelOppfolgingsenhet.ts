import { mockServer } from "../setup";
import {
  mockGetMuligeTildelinger,
  mockPostTildelOppfolgingsenhet,
} from "@/mocks/mockSyfobehandlendeenhet";

export function stubTildelOppfolgingsenhet() {
  mockServer.use(mockGetMuligeTildelinger(), mockPostTildelOppfolgingsenhet());
}
