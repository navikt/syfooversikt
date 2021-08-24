import {
  PersonData,
  PersonregisterData,
  PersonregisterState,
} from '@/api/types/personregisterTypes';
import { PersonoversiktStatus } from '@/api/types/personoversiktTypes';

export const toPersonData = (
  personoversiktData: PersonoversiktStatus[],
  personregisterData: PersonregisterData[]
): PersonregisterState => {
  const personDataList: Record<string, PersonData> = {};

  personoversiktData.forEach((person) => {
    const matchingPersonRegister = personregisterData?.find(
      (reg) => reg.fnr === person.fnr
    );
    personDataList[person.fnr] = {
      navn: person.navn || matchingPersonRegister?.navn || '',
      harMotebehovUbehandlet: person.motebehovUbehandlet || false,
      harMoteplanleggerUbehandlet: person.moteplanleggerUbehandlet || false,
      harOppfolgingsplanLPSBistandUbehandlet:
        person.oppfolgingsplanLPSBistandUbehandlet || false,
      skjermingskode: matchingPersonRegister?.skjermingskode || 'INGEN',
      markert: false,
      tildeltEnhetId: person.enhet,
      tildeltVeilederIdent: person.veilederIdent || '',
      oppfolgingstilfeller: person.oppfolgingstilfeller,
    };
  });

  return personDataList;
};
