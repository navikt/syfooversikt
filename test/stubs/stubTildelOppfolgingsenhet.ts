import { mockServer } from '../setup';
import { mockGetMuligeTildelinger } from '@/mocks/mockSyfobehandlendeenhet';

export const stubTildelOppfolgingsenhet = () => {
  mockServer.use(mockGetMuligeTildelinger());
};
