import {
  PersonData,
  PersonregisterData,
  PersonregisterState,
} from '@/api/types/personregisterTypes';
import { PersonOversiktStatusDTO } from '@/api/types/personoversiktTypes';

export const toPersonData = (
  personoversiktData: PersonOversiktStatusDTO[],
  personregisterData: PersonregisterData[]
): PersonregisterState => {
  const personDataList: Record<string, PersonData> = {};

  personoversiktData.forEach((person) => {
    const matchingPersonRegister = personregisterData?.find(
      (reg) => reg.fnr === person.fnr
    );
    personDataList[person.fnr] = {
      navn: person.navn || '',
      harMotebehovUbehandlet: person.motebehovUbehandlet || false,
      harDialogmotesvar: person.dialogmotesvarUbehandlet,
      harOppfolgingsplanLPSBistandUbehandlet:
        person.oppfolgingsplanLPSBistandUbehandlet || false,
      skjermingskode: matchingPersonRegister?.skjermingskode || 'INGEN',
      markert: false,
      tildeltEnhetId: person.enhet,
      tildeltVeilederIdent: person.veilederIdent || '',
      dialogmotekandidat: person?.dialogmotekandidat,
      latestOppfolgingstilfelle: person.latestOppfolgingstilfelle,
      aktivitetskrav: person.aktivitetskrav,
      aktivitetskravActive: person.aktivitetskravActive,
      aktivitetskravVurderingFrist: person.aktivitetskravVurderingFrist,
      harBehandlerdialogUbehandlet: person.behandlerdialogUbehandlet,
      harAktivitetskravVurderStansUbehandlet:
        person.aktivitetskravVurderStansUbehandlet,
      behandlerBerOmBistandUbehandlet: person.behandlerBerOmBistandUbehandlet,
      arbeidsuforhetvurdering: person.arbeidsuforhetvurdering,
      friskmeldingTilArbeidsformidlingFom:
        person.friskmeldingTilArbeidsformidlingFom,
      snartSluttPaSykepengene: person.snartSluttPaSykepengene,
      oppfolgingsoppgave: person.oppfolgingsoppgave,
    };
  });

  return personDataList;
};
