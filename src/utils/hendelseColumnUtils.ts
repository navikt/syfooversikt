import {
  AktivitetskravStatus,
  OnskerOppfolging,
  oppfolgingsgrunnToString,
  SenOppfolgingKandidatDTO,
} from '@/api/types/personoversiktTypes';
import { PersonData } from '@/api/types/personregisterTypes';
import { ManglendeMedvirkningDTO } from '@/api/types/manglendeMedvirkningDTO';
import { isPast } from '@/utils/dateUtils';

function mapAktivitetskravStatus(personData: PersonData): string {
  const status = personData?.aktivitetskravvurdering?.status;
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

      if (svarfrist) {
        return isPast(svarfrist)
          ? '- Forhåndsvarsel utløpt'
          : '- Forhåndsvarsel sendt';
      }

      return '';
    default:
      return '';
  }
}

function mapArbeidsuforhetStatus(svarfrist: Date | undefined) {
  if (svarfrist) {
    return isPast(svarfrist) ? 'Forhåndsvarsel utløpt' : 'Forhåndsvarsel sendt';
  }

  return '';
}

function mapManglendeMedvirkningStatus(
  manglendeMedvirkning: ManglendeMedvirkningDTO
) {
  const svarfrist = manglendeMedvirkning.varsel?.svarfrist;
  if (svarfrist) {
    return isPast(svarfrist) ? 'Forhåndsvarsel utløpt' : 'Forhåndsvarsel sendt';
  }

  return '';
}

function mapSenOppfolgingStatus(
  senOppfolgingKandidat: SenOppfolgingKandidatDTO
): string {
  const svar = senOppfolgingKandidat.svar;
  const varselAt = senOppfolgingKandidat.varselAt;

  if (svar) {
    if (svar.onskerOppfolging === OnskerOppfolging.JA) {
      return 'Ønsker oppfølging';
    } else {
      return 'Ønsker ikke oppfølging';
    }
  } else if (varselAt && svar === null) {
    return 'Ikke svart';
  }
  return '';
}

export function getHendelser(personData: PersonData): string[] {
  const hendelser: string[] = [];
  if (personData.aktivitetskravvurdering) {
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
    const oppfolgingsgrunn =
      oppfolgingsgrunnToString[personData.oppfolgingsoppgave.oppfolgingsgrunn]
        ?.short;
    hendelser.push(`Oppf.oppgave - ${oppfolgingsgrunn ?? ''}`);
  }
  if (personData.harOppfolgingsplanLPSBistandUbehandlet) {
    hendelser.push('Oppfølgingsplan'); //TODO: Hva skal denne egt gjøre?
  }
  if (personData.senOppfolgingKandidat) {
    hendelser.push(
      `Snart slutt på sykepengene - ${mapSenOppfolgingStatus(
        personData.senOppfolgingKandidat
      )}`
    );
  }
  if (personData.manglendeMedvirkning) {
    hendelser.push(
      `Manglende medvirkning - ${mapManglendeMedvirkningStatus(
        personData.manglendeMedvirkning
      )}`
    );
  }

  return hendelser;
}
