import { PersonData } from '@/api/types/personregisterTypes';
import { toReadableDate } from '@/utils/dateUtils';
import {
  BriefcaseIcon,
  FileTextIcon,
  HourglassTopFilledIcon,
} from '@navikt/aksel-icons';
import React, { ReactElement, useState } from 'react';
import { AktivitetskravStatus } from '@/api/types/personoversiktTypes';
import { Button, Table, Tooltip } from '@navikt/ds-react';
import OppfolgingsoppgaveModal from '@/sider/oversikt/sokeresultat/oversikttable/fristdatacell/OppfolgingsoppgaveModal';
import * as Amplitude from '@/utils/amplitude';
import { TabType, useTabType } from '@/hooks/useTabType';

const texts = {
  tooltipAvventer: 'Avventer til',
  tooltipOppfolgingsoppgave: 'Oppfølgingsoppgave frist',
  tooltipFriskmeldingTilArbeidsformidling: '§8-5 f.o.m.',
  arbeidsuforhetvarselFrist: '§8-4: Svarfrist forhåndsvarsel',
  manglendeMedvirkningVarselFrist: '§8-8: Svarfrist forhåndsvarsel',
  aktivitetskravvarselFrist: 'Aktivitetskrav: Svarfrist forhåndsvarsel',
};

function logOppfolgingsOppgaveModalOpenEvent() {
  Amplitude.logEvent({
    type: Amplitude.EventType.ButtonClick,
    data: {
      url: window.location.href,
      tekst: 'Åpnet oppfølgingsoppgave modal',
    },
  });
}

type Frist = {
  icon: () => ReactElement;
  date: Date;
  tooltip: string;
};

function byFristAsc(fristA: Frist, fristB: Frist) {
  return fristA.date > fristB.date ? 1 : -1;
}

function fristerInfo(
  {
    oppfolgingsoppgave,
    friskmeldingTilArbeidsformidlingFom,
    arbeidsuforhetvurdering,
    aktivitetskravvurdering,
    manglendeMedvirkning,
  }: PersonData,
  setIsModalOpen: (open: boolean) => void,
  selectedTab: TabType
): Frist[] {
  const frister: Frist[] = [];
  const aktivitetskravStatus = aktivitetskravvurdering?.status;
  const aktivitetskravVurderingFrist =
    aktivitetskravvurdering?.vurderinger[0]?.frist;
  const aktivitetskravVarselFrist =
    aktivitetskravvurdering?.vurderinger[0]?.varsel?.svarfrist;
  if (
    aktivitetskravvurdering?.vurderinger.length &&
    aktivitetskravvurdering?.vurderinger.length > 0
  ) {
    aktivitetskravVurderingFrist &&
      frister.push({
        icon: () => <HourglassTopFilledIcon aria-hidden fontSize="1.5rem" />,
        date: aktivitetskravVurderingFrist,
        tooltip: texts.tooltipAvventer,
      });
    aktivitetskravVarselFrist &&
      frister.push({
        icon: () => <HourglassTopFilledIcon aria-hidden fontSize="1.5rem" />,
        date: aktivitetskravVarselFrist,
        tooltip: texts.aktivitetskravvarselFrist,
      });
  } else if (
    aktivitetskravStatus === AktivitetskravStatus.AVVENT &&
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
      icon: () =>
        selectedTab === TabType.MIN_OVERSIKT ? (
          <Button
            size="xsmall"
            icon={<FileTextIcon aria-hidden fontSize="1.5rem" />}
            className="mr-1"
            onClick={() => {
              logOppfolgingsOppgaveModalOpenEvent();
              setIsModalOpen(true);
            }}
          />
        ) : (
          <FileTextIcon aria-hidden fontSize="1.5rem" />
        ),
      date: oppfolgingsoppgave.frist,
      tooltip: `${
        selectedTab === TabType.MIN_OVERSIKT
          ? 'Åpne oppfølgingsoppgave'
          : 'Oppfølgingsoppgave frist'
      }`,
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

  if (manglendeMedvirkning && manglendeMedvirkning.varsel) {
    frister.push({
      icon: () => <HourglassTopFilledIcon aria-hidden fontSize="1.5rem" />,
      date: manglendeMedvirkning.varsel.svarfrist,
      tooltip: texts.manglendeMedvirkningVarselFrist,
    });
  }
  return frister;
}

interface Props {
  personData: PersonData;
}

export function FristDataCell({ personData }: Props) {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const { selectedTab } = useTabType();
  const frister: Frist[] = fristerInfo(personData, setIsModalOpen, selectedTab);

  return (
    <Table.DataCell textSize="small">
      {frister.sort(byFristAsc).map(({ date, icon, tooltip }, index) => (
        <div key={index} className="flex flex-wrap items-center">
          <Tooltip content={tooltip} arrow={false}>
            {icon()}
          </Tooltip>
          <div>{toReadableDate(date)}</div>
        </div>
      ))}
      {personData.oppfolgingsoppgave && (
        <OppfolgingsoppgaveModal
          isOpen={isModalOpen}
          setOpen={setIsModalOpen}
          oppfolgingsoppgave={personData.oppfolgingsoppgave}
          sykmeldtNavn={personData.navn}
        />
      )}
    </Table.DataCell>
  );
}
