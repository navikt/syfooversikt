import { useSelector } from 'react-redux';
import { ApplicationState } from '../index';

export interface OversiktData {
  laster: boolean;
  hentingEnhetFeilet: boolean;
  aktivEnhet: string;
}

export function useOversiktData(): OversiktData {
  const state = useSelector((state: ApplicationState) => state);

  return {
    laster:
      state.veilederenheter.henter ||
      state.veilederinfo.henter ||
      state.personoversikt.henter,
    hentingEnhetFeilet: state.modiacontext.hentingEnhetFeilet,
    aktivEnhet: state.veilederenheter.aktivEnhetId,
  };
}
