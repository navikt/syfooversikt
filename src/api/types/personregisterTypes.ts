import {
  ArbeidsuforhetvurderingDTO,
  OppfolgingsoppgaveDTO,
  OppfolgingstilfelleDTO,
  PersonOversiktStatusDTO,
  SenOppfolgingKandidatDTO,
} from './personoversiktTypes';
import { AktivitetskravDTO } from '@/api/types/aktivitetskravDTO';
import { ManglendeMedvirkningDTO } from '@/api/types/manglendeMedvirkningDTO';

export type Skjermingskode = 'INGEN' | 'DISKRESJONSMERKET' | 'EGEN_ANSATT';

export interface PersonData {
  navn: string;
  harMotebehovUbehandlet: boolean;
  harDialogmotesvar: boolean;
  harOppfolgingsplanLPSBistandUbehandlet: boolean;
  skjermingskode: Skjermingskode;
  tildeltVeilederIdent: string;
  dialogmotekandidat?: boolean;
  latestOppfolgingstilfelle?: OppfolgingstilfelleDTO;
  harBehandlerdialogUbehandlet: boolean;
  behandlerBerOmBistandUbehandlet: boolean;
  friskmeldingTilArbeidsformidlingFom: Date | null;
  arbeidsuforhetvurdering: ArbeidsuforhetvurderingDTO | null;
  senOppfolgingKandidat: SenOppfolgingKandidatDTO | null;
  oppfolgingsoppgave: OppfolgingsoppgaveDTO | null;
  aktivitetskravvurdering: AktivitetskravDTO | null;
  manglendeMedvirkning: ManglendeMedvirkningDTO | null;
  isAktivKartleggingssporsmalVurdering: boolean;
}

export interface PersonregisterState {
  [fnr: string]: PersonData;
}

export interface PersonSkjermingskode {
  fnr: string;
  skjermingskode: Skjermingskode;
}

export function toPersonData(
  personoversiktData: PersonOversiktStatusDTO[],
  personSkjermingskode: PersonSkjermingskode[]
): PersonregisterState {
  const personDataList: Record<string, PersonData> = {};

  personoversiktData.forEach((person) => {
    const matchingPersonRegister = personSkjermingskode?.find(
      (reg) => reg.fnr === person.fnr
    );
    personDataList[person.fnr] = {
      navn: person.navn || '',
      harMotebehovUbehandlet: person.motebehovUbehandlet || false,
      harDialogmotesvar: person.dialogmotesvarUbehandlet,
      harOppfolgingsplanLPSBistandUbehandlet:
        person.oppfolgingsplanLPSBistandUbehandlet || false,
      skjermingskode: matchingPersonRegister?.skjermingskode || 'INGEN',
      tildeltVeilederIdent: person.veilederIdent || '',
      dialogmotekandidat: person?.dialogmotekandidat,
      latestOppfolgingstilfelle: person.latestOppfolgingstilfelle,
      harBehandlerdialogUbehandlet: person.behandlerdialogUbehandlet,
      behandlerBerOmBistandUbehandlet: person.behandlerBerOmBistandUbehandlet,
      arbeidsuforhetvurdering: person.arbeidsuforhetvurdering,
      friskmeldingTilArbeidsformidlingFom:
        person.friskmeldingTilArbeidsformidlingFom,
      senOppfolgingKandidat: person.senOppfolgingKandidat,
      oppfolgingsoppgave: person.oppfolgingsoppgave,
      aktivitetskravvurdering: person.aktivitetskravvurdering,
      manglendeMedvirkning: person.manglendeMedvirkning,
      isAktivKartleggingssporsmalVurdering:
        person.isAktivKartleggingssporsmalVurdering,
    };
  });

  return personDataList;
}
