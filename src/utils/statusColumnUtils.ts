import {
  Oppfolgingsgrunn,
  AktivitetskravStatus,
} from '@/api/types/personoversiktTypes';
import { PersonData } from '@/api/types/personregisterTypes';

function mapOppfolgingsgrunn(oppfolgingsgrunn: Oppfolgingsgrunn) {
  switch (oppfolgingsgrunn) {
    case Oppfolgingsgrunn.ANNET:
      return 'Annet';
    case Oppfolgingsgrunn.FOLG_OPP_ETTER_NESTE_SYKMELDING:
      return 'Følg opp etter sykmelding';
    case Oppfolgingsgrunn.FRISKMELDING_TIL_ARBEIDSFORMIDLING:
      return 'Vurder § 8-5';
    case Oppfolgingsgrunn.TA_KONTAKT_ARBEIDSGIVER:
      return 'Kontakt arbeidsgiver';
    case Oppfolgingsgrunn.TA_KONTAKT_BEHANDLER:
      return 'Kontakt behandler';
    case Oppfolgingsgrunn.TA_KONTAKT_SYKEMELDT:
      return 'Kontakt sykmeldt';
    case Oppfolgingsgrunn.VURDER_14A:
      return 'Vurder § 14a';
    case Oppfolgingsgrunn.VURDER_ANNEN_YTELSE:
      return 'Vurder annen ytelse';
    case Oppfolgingsgrunn.VURDER_ARBEIDSUFORHET:
      return 'Vurder § 8-4';
    case Oppfolgingsgrunn.VURDER_DIALOGMOTE_SENERE:
      return 'Vurder dialogmøte';
    case Oppfolgingsgrunn.VURDER_TILTAK_BEHOV:
      return 'Vurder tiltak';
    default:
      return '';
  }
}

function mapAktivitetskravStatus(personData: PersonData): string {
  const status =
    personData?.aktivitetskravvurdering?.status ?? personData.aktivitetskrav;
  switch (status) {
    case AktivitetskravStatus.NY:
      return '- Ny kandidat';
    case AktivitetskravStatus.NY_VURDERING:
      return '- Ny vurdering';
    case AktivitetskravStatus.AVVENT:
      return '- Avventer';
    case AktivitetskravStatus.FORHANDSVARSEL:
      const svarfrist =
        personData.aktivitetskravvurdering?.vurderinger[0]?.varsel?.svarfrist;
      const fristDate = svarfrist ? new Date(svarfrist) : undefined;
      const today = new Date();

      if (fristDate && fristDate >= today) {
        return '- Forhåndsvarsel sendt';
      } else {
        return '- Forhåndsvarsel utløpt';
      }
    default:
      return '';
  }
}

function mapArbeidsuforhetStatus(svarfrist: Date | undefined) {
  const fristDate = svarfrist ? new Date(svarfrist) : undefined;
  const today = new Date();

  if (fristDate && fristDate >= today) {
    return 'Forhåndsvarsel sendt';
  } else {
    return 'Forhåndsvarsel utløpt';
  }
}

export function getHendelser(personData: PersonData): string[] {
  const hendelser: string[] = [];
  if (
    personData.aktivitetskravvurdering ||
    personData.aktivitetskrav === AktivitetskravStatus.NY ||
    personData.aktivitetskrav === AktivitetskravStatus.NY_VURDERING
  ) {
    hendelser.push(`Akt.krav ${mapAktivitetskravStatus(personData)}`);
  }
  if (personData.arbeidsuforhetvurdering) {
    hendelser.push(
      `Arbeidsuførhet - ${mapArbeidsuforhetStatus(
        personData.arbeidsuforhetvurdering.varsel?.svarfrist
      )}`
    );
  }
  if (personData.behandlerBerOmBistandUbehandlet) {
    hendelser.push('Bistandsbehov fra behandler');
  }
  if (personData.harBehandlerdialogUbehandlet) {
    hendelser.push('Dialogmelding');
  }
  if (personData.dialogmotekandidat) {
    hendelser.push('Dialogmøte - Kandidat');
  }
  if (personData.harMotebehovUbehandlet) {
    hendelser.push('Dialogmøte - Møtebehov');
  }
  if (personData.harDialogmotesvar) {
    hendelser.push('Dialogmøte - Nytt svar');
  }
  if (personData.friskmeldingTilArbeidsformidlingFom) {
    hendelser.push('Friskmelding til arbeidsformidling');
  }
  if (personData.oppfolgingsoppgave) {
    hendelser.push(
      `Oppf.oppgave - ${mapOppfolgingsgrunn(
        personData.oppfolgingsoppgave.oppfolgingsgrunn
      )}`
    );
  }
  if (personData.harOppfolgingsplanLPSBistandUbehandlet) {
    hendelser.push('Oppfølgingsplan'); //TODO: Hva skal denne egt gjøre?
  }
  if (personData.isAktivSenOppfolgingKandidat) {
    hendelser.push('Snart slutt på sykepengene');
  }
  return hendelser;
}
