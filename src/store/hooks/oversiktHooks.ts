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
      state.modiacontext.henterEnhet ||
      state.veilederinfo.henter ||
      state.personoversikt.henter ||
      state.veilederenheter.aktivEnhetId === '',
    hentingEnhetFeilet: state.modiacontext.hentingEnhetFeilet,
    aktivEnhet: state.veilederenheter.aktivEnhetId,
  };
}
