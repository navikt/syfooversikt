import { Table } from '@navikt/ds-react';
import React from 'react';
import { PersonData } from '@/api/types/personregisterTypes';
import {
  AktivitetskravStatus,
  avventVurderingArsakTexts,
  OnskerOppfolging,
  oppfolgingsgrunnToString,
  SenOppfolgingKandidatDTO,
} from '@/api/types/personoversiktTypes';
import { isPast } from '@/utils/dateUtils';
import { ManglendeMedvirkningDTO } from '@/api/types/manglendeMedvirkningDTO';
import { AktivitetskravvurderingDTO } from '@/api/types/aktivitetskravDTO';
import { Hendelse, HendelseType } from '@/utils/hendelseType';

interface Props {
  personData: PersonData;
}

function mapAktivitetskravStatus(personData: PersonData): string {
  const status = personData?.aktivitetskravvurdering?.status;
  const aktivitetskravVurdering =
    personData.aktivitetskravvurdering?.vurderinger[0];
  switch (status) {
    case AktivitetskravStatus.NY:
      return '- Ny kandidat';
    case AktivitetskravStatus.NY_VURDERING:
      return '- Ny vurdering';
    case AktivitetskravStatus.AVVENT:
      return '- Avventer' + getAvventArsakerText(aktivitetskravVurdering);
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

function getAvventArsakerText(
  aktivitetskravVurdering?: AktivitetskravvurderingDTO | null
): string {
  if (
    !aktivitetskravVurdering?.arsaker ||
    aktivitetskravVurdering?.arsaker.length == 0
  ) {
    return '';
  }
  const arsaker = aktivitetskravVurdering?.arsaker;

  return ` (${arsaker
    .sort()
    .reverse()
    .map((arsak) => avventVurderingArsakTexts[arsak])
    .join(', ')})`;
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

export function getHendelser(personData: PersonData): Hendelse[] {
  const hendelser: Hendelse[] = [];
  if (personData.aktivitetskravvurdering) {
    hendelser.push({
      type: HendelseType.AKTIVITETSKRAV,
      text: `Aktivitetskrav ${mapAktivitetskravStatus(personData)}`,
    });
  }
  if (personData.arbeidsuforhetvurdering) {
    hendelser.push({
      type: HendelseType.ARBEIDSUFORHET,
      text: `Arbeidsuførhet - ${mapArbeidsuforhetStatus(
        personData.arbeidsuforhetvurdering.varsel?.svarfrist
      )}`,
    });
  }
  if (personData.behandlerBerOmBistandUbehandlet) {
    hendelser.push({
      type: HendelseType.BISTANDSBEHOV_FRA_BEHANDLER,
      text: 'Bistandsbehov fra behandler',
    });
  }
  if (personData.harBehandlerdialogUbehandlet) {
    hendelser.push({
      type: HendelseType.DIALOGMELDING,
      text: 'Dialogmelding',
    });
  }
  if (personData.dialogmotekandidatStatus?.isKandidat) {
    if (personData.dialogmotekandidatStatus.avvent) {
      hendelser.push({
        type: HendelseType.DIALOGMOTE,
        text: 'Dialogmøte - Avventer',
      });
    } else {
      hendelser.push({
        type: HendelseType.DIALOGMOTE,
        text: 'Dialogmøte - Kandidat',
      });
    }
  }
  if (personData.harMotebehovUbehandlet) {
    hendelser.push({
      type: HendelseType.DIALOGMOTE_MOTEBEHOV,
      text: 'Dialogmøte - Møtebehov',
    });
  }
  if (personData.harDialogmotesvar) {
    hendelser.push({
      type: HendelseType.DIALOGMOTE_NYTT_SVAR,
      text: 'Dialogmøte - Nytt svar',
    });
  }
  if (personData.friskmeldingTilArbeidsformidlingFom) {
    hendelser.push({
      type: HendelseType.FRISKMELDING_TIL_ARBEIDSFORMIDLING,
      text: 'Friskmelding til arbeidsformidling',
    });
  }
  if (personData.oppfolgingsoppgave) {
    const oppfolgingsgrunn =
      oppfolgingsgrunnToString[personData.oppfolgingsoppgave.oppfolgingsgrunn]
        ?.short;
    hendelser.push({
      type: HendelseType.OPPFOLGINGSOPPGAVE,
      text: `Oppf.oppgave - ${oppfolgingsgrunn ?? ''}`,
    });
  }
  if (personData.harOppfolgingsplanLPSBistandUbehandlet) {
    hendelser.push({
      type: HendelseType.OPPFOLGINGSPLAN,
      text: 'Oppfølgingsplan',
    });
  }
  if (personData.senOppfolgingKandidat) {
    hendelser.push({
      type: HendelseType.SEN_OPPFOLGING,
      text: `Snart slutt på sykepengene - ${mapSenOppfolgingStatus(
        personData.senOppfolgingKandidat
      )}`,
    });
  }
  if (personData.manglendeMedvirkning) {
    hendelser.push({
      type: HendelseType.MANGLENDE_MEDVIRKNING,
      text: `Manglende medvirkning - ${mapManglendeMedvirkningStatus(
        personData.manglendeMedvirkning
      )}`,
    });
  }
  if (personData.isAktivKartleggingssporsmalVurdering) {
    hendelser.push({
      type: HendelseType.KARTLEGGINGSSPORSMAL,
      text: 'Svart på kartleggingsspørsmål',
    });
  }
  return hendelser;
}

export default function HendelseColumn({ personData }: Props) {
  return (
    <Table.DataCell textSize="small" className="[&>*:not(:last-child)]:mb-1.5">
      {getHendelser(personData).map((hendelse, index) => (
        <p key={index} className="m-0">
          {hendelse.text}
        </p>
      ))}
    </Table.DataCell>
  );
}
