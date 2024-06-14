import { PersonData } from '@/api/types/personregisterTypes';
import { toReadableDate } from '@/utils/dateUtils';
import {
  FileTextIcon,
  HourglassTopFilledIcon,
  BriefcaseIcon,
} from '@navikt/aksel-icons';
import React, { ReactElement } from 'react';
import {
  AktivitetskravStatus,
  Oppfolgingsgrunn,
} from '@/api/types/personoversiktTypes';
import { Tooltip } from '@navikt/ds-react';

const texts = {
  tooltipAvventer: 'Avventer til',
  tooltipOppfolgingsoppgave: 'Oppfølgingsoppgave frist',
  tooltipFriskmeldingTilArbeidsformidling: '§8-5 f.o.m.',
  arbeidsuforhetvarselFrist: '§8-4: Svarfrist forhåndsvarsel',
};

interface FristColumnProps {
  personData: PersonData;
}

type Frist = {
  icon: () => ReactElement;
  date: Date;
  tooltip: string;
};

const byFristAsc = (fristA: Frist, fristB: Frist) => {
  return fristA.date > fristB.date ? 1 : -1;
};

const oppfolgingsgrunnTekster = (
  oppfolgingsgrunn: Oppfolgingsgrunn
): string => {
  switch (oppfolgingsgrunn) {
    case Oppfolgingsgrunn.TA_KONTAKT_SYKEMELDT:
      return 'Ta kontakt med den sykmeldte';
    case Oppfolgingsgrunn.TA_KONTAKT_ARBEIDSGIVER:
      return 'Ta kontakt med arbeidsgiver';
    case Oppfolgingsgrunn.TA_KONTAKT_BEHANDLER:
      return 'Ta kontakt med behandler';
    case Oppfolgingsgrunn.VURDER_DIALOGMOTE_SENERE:
      return 'Vurder behov for dialogmøte';
    case Oppfolgingsgrunn.FOLG_OPP_ETTER_NESTE_SYKMELDING:
      return 'Følg opp etter neste sykmelding';
    case Oppfolgingsgrunn.VURDER_TILTAK_BEHOV:
      return 'Vurder behov for tiltak';
    case Oppfolgingsgrunn.VURDER_ARBEIDSUFORHET:
      return 'Vurder §8-4 - Arbeidsuførhet';
    case Oppfolgingsgrunn.FRISKMELDING_TIL_ARBEIDSFORMIDLING:
      return 'Vurder §8-5 - Friskmelding til arbeidsformidling';
    case Oppfolgingsgrunn.VURDER_14A:
      return 'Vurder §14a';
    case Oppfolgingsgrunn.VURDER_ANNEN_YTELSE:
      return 'Vurder annen ytelse';
    case Oppfolgingsgrunn.ANNET:
      return 'Annet';
    default:
      return 'Ukjent oppfølgingsgrunn';
  }
};

export const FristColumn = ({ personData }: FristColumnProps) => {
  const {
    aktivitetskrav,
    aktivitetskravVurderingFrist,
    oppfolgingsoppgave,
    friskmeldingTilArbeidsformidlingFom,
    arbeidsuforhetvurdering,
  } = personData;
  const frister: Frist[] = [];
  if (
    aktivitetskrav === AktivitetskravStatus.AVVENT &&
    aktivitetskravVurderingFrist
  ) {
    frister.push({
      icon: () => <HourglassTopFilledIcon aria-hidden fontSize="1.5rem" />,
      date: aktivitetskravVurderingFrist,
      tooltip: texts.tooltipAvventer,
    });
  }
  if (oppfolgingsoppgave?.frist) {
    frister.push({
      icon: () => <FileTextIcon aria-hidden fontSize="1.5rem" />,
      date: oppfolgingsoppgave.frist,
      tooltip: `${oppfolgingsgrunnTekster(
        oppfolgingsoppgave.oppfolgingsgrunn
      )}`,
    });
  }

  if (friskmeldingTilArbeidsformidlingFom) {
    frister.push({
      icon: () => <BriefcaseIcon aria-hidden fontSize="1.5rem" />,
      date: friskmeldingTilArbeidsformidlingFom,
      tooltip: texts.tooltipFriskmeldingTilArbeidsformidling,
    });
  }

  if (arbeidsuforhetvurdering && arbeidsuforhetvurdering.varsel) {
    frister.push({
      icon: () => <HourglassTopFilledIcon aria-hidden fontSize="1.5rem" />,
      date: arbeidsuforhetvurdering.varsel.svarfrist,
      tooltip: texts.arbeidsuforhetvarselFrist,
    });
  }

  return (
    <>
      {frister.sort(byFristAsc).map(({ date, icon, tooltip }, index) => (
        <div key={index} className="flex flex-wrap items-center">
          <Tooltip content={tooltip} arrow={false}>
            {icon()}
          </Tooltip>
          <div>{toReadableDate(date)}</div>
        </div>
      ))}
    </>
  );
};
