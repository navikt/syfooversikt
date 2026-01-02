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

export function getHendelser(personData: PersonData): string[] {
  const hendelser: string[] = [];
  if (personData.aktivitetskravvurdering) {
    hendelser.push(`Aktivitetskrav ${mapAktivitetskravStatus(personData)}`);
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
  if (personData.dialogmotekandidatStatus?.isKandidat) {
    if (personData.dialogmotekandidatStatus.avvent) {
      hendelser.push('Dialogmøte - Avventer');
    } else {
      hendelser.push('Dialogmøte - Kandidat');
    }
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
    hendelser.push('Oppfølgingsplan');
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
  if (personData.isAktivKartleggingssporsmalVurdering) {
    hendelser.push('Svart på kartleggingsspørsmål');
  }
  return hendelser;
}

export default function HendelseColumn({ personData }: Props) {
  return (
    <Table.DataCell textSize="small" className="[&>*:not(:last-child)]:mb-1.5">
      {getHendelser(personData).map((status, index) => (
        <p key={index} className="m-0">
          {status}
        </p>
      ))}
    </Table.DataCell>
  );
}
