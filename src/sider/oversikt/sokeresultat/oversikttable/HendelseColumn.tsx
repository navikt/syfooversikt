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

interface Hendelse {
  beskrivelse: string;
  frist?: Date;
}

function getAktivitetskravFrist(personData: PersonData): Date | undefined {
  const vurdering = personData.aktivitetskravvurdering?.vurderinger[0];
  const status = personData.aktivitetskravvurdering?.status;
  if (status === AktivitetskravStatus.AVVENT) {
    return vurdering?.frist ?? undefined;
  }
  if (status === AktivitetskravStatus.FORHANDSVARSEL) {
    return vurdering?.varsel?.svarfrist ?? undefined;
  }
  return undefined;
}

function byFristOrBottom(a: Hendelse, b: Hendelse): number {
  if (a.frist && b.frist) {
    return a.frist > b.frist ? 1 : -1;
  }
  if (a.frist) return -1;
  if (b.frist) return 1;
  return 0;
}

export function getHendelser(personData: PersonData): Hendelse[] {
  const hendelser: Hendelse[] = [];
  if (personData.aktivitetskravvurdering) {
    hendelser.push({
      beskrivelse: `Aktivitetskrav ${mapAktivitetskravStatus(personData)}`,
      frist: getAktivitetskravFrist(personData),
    });
  }
  if (personData.arbeidsuforhetvurdering) {
    hendelser.push({
      beskrivelse: `Arbeidsuførhet - ${mapArbeidsuforhetStatus(
        personData.arbeidsuforhetvurdering.varsel?.svarfrist
      )}`,
      frist: personData.arbeidsuforhetvurdering.varsel?.svarfrist ?? undefined,
    });
  }
  if (personData.behandlerBerOmBistandUbehandlet) {
    hendelser.push({
      beskrivelse: 'Bistandsbehov fra behandler',
    });
  }
  if (personData.harBehandlerdialogUbehandlet) {
    hendelser.push({
      beskrivelse: 'Dialogmelding',
    });
  }
  if (personData.dialogmotekandidatStatus?.isKandidat) {
    if (personData.dialogmotekandidatStatus.avvent) {
      hendelser.push({
        beskrivelse: 'Dialogmøte - Avventer',
        frist: personData.dialogmotekandidatStatus.avvent.frist,
      });
    } else {
      hendelser.push({
        beskrivelse: 'Dialogmøte - Kandidat',
      });
    }
  }
  if (personData.harMotebehovUbehandlet) {
    hendelser.push({
      beskrivelse: 'Dialogmøte - Møtebehov',
    });
  }
  if (personData.harDialogmotesvar) {
    hendelser.push({
      beskrivelse: 'Dialogmøte - Nytt svar',
    });
  }
  if (personData.friskmeldingTilArbeidsformidlingFom) {
    hendelser.push({
      beskrivelse: 'Friskmelding til arbeidsformidling',
      frist: personData.friskmeldingTilArbeidsformidlingFom,
    });
  }
  if (personData.oppfolgingsoppgave) {
    const oppfolgingsgrunn =
      oppfolgingsgrunnToString[personData.oppfolgingsoppgave.oppfolgingsgrunn]
        ?.short;
    hendelser.push({
      beskrivelse: `Oppf.oppgave - ${oppfolgingsgrunn ?? ''}`,
      frist: personData.oppfolgingsoppgave.frist ?? undefined,
    });
  }
  if (personData.harOppfolgingsplanLPSBistandUbehandlet) {
    hendelser.push({
      beskrivelse: 'Oppfølgingsplan',
    });
  }
  if (personData.senOppfolgingKandidat) {
    hendelser.push({
      beskrivelse: `Snart slutt på sykepengene - ${mapSenOppfolgingStatus(
        personData.senOppfolgingKandidat
      )}`,
    });
  }
  if (personData.manglendeMedvirkning) {
    hendelser.push({
      beskrivelse: `Manglende medvirkning - ${mapManglendeMedvirkningStatus(
        personData.manglendeMedvirkning
      )}`,
      frist: personData.manglendeMedvirkning.varsel?.svarfrist ?? undefined,
    });
  }
  if (personData.isAktivKartleggingssporsmalVurdering) {
    hendelser.push({
      beskrivelse: 'Svart på kartleggingsspørsmål',
    });
  }
  return hendelser.sort(byFristOrBottom);
}

export default function HendelseColumn({ personData }: Props) {
  return (
    <Table.DataCell
      textSize="small"
      className="align-top [&>*:not(:last-child)]:mb-1.5"
    >
      {getHendelser(personData).map((hendelse, index) => (
        <p key={index} className="m-0">
          {hendelse.beskrivelse}
        </p>
      ))}
    </Table.DataCell>
  );
}
