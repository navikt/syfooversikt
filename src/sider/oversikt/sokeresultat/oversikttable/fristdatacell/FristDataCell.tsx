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
import { TabType, useTabType } from '@/hooks/useTabType';
import AktivitetskravAvventModal from '@/sider/oversikt/sokeresultat/oversikttable/fristdatacell/AktivitetskravAvventModal';

const texts = {
  tooltipAvventerAktivitetskrav: 'Aktivitetskrav avventer til',
  tooltipAvventerDialogmotekandidat: 'Dialogmøtekandidat avventer til',
  tooltipOppfolgingsoppgave: 'Oppfølgingsoppgave frist',
  tooltipFriskmeldingTilArbeidsformidling: '§ 8-5 f.o.m.',
  arbeidsuforhetvarselFrist: '§ 8-4: Svarfrist forhåndsvarsel',
  manglendeMedvirkningVarselFrist:
    '§ 8-8: Svarfrist forhåndsvarsel manglende medvirkning',
  aktivitetskravvarselFrist: '§ 8-8: Aktivitetskrav: Svarfrist forhåndsvarsel',
};

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
    dialogmotekandidatStatus,
  }: PersonData,
  setIsOppfolgingsoppgaveModalOpen: (open: boolean) => void,
  setIsAktivitetskravModalOpen: (open: boolean) => void,
  selectedTab: TabType
): Frist[] {
  const frister: Frist[] = [];
  const aktivitetskravStatus = aktivitetskravvurdering?.status;
  const aktivitetskravVarselFrist =
    aktivitetskravvurdering?.vurderinger[0]?.varsel?.svarfrist;
  if (
    aktivitetskravvurdering?.vurderinger.length &&
    aktivitetskravvurdering?.vurderinger.length > 0
  ) {
    if (aktivitetskravvurdering?.status == AktivitetskravStatus.AVVENT) {
      const currentVurdering = aktivitetskravvurdering.vurderinger[0];
      currentVurdering?.frist &&
        frister.push({
          icon: () =>
            selectedTab === TabType.MIN_OVERSIKT ? (
              <Button
                size="xsmall"
                icon={<HourglassTopFilledIcon aria-hidden fontSize="1.5rem" />}
                className="mr-1"
                onClick={() => setIsAktivitetskravModalOpen(true)}
              />
            ) : (
              <HourglassTopFilledIcon aria-hidden fontSize="1.5rem" />
            ),
          date: currentVurdering?.frist,
          tooltip: `${
            selectedTab === TabType.MIN_OVERSIKT
              ? 'Åpne aktivitetskravvurdering'
              : texts.tooltipAvventerAktivitetskrav
          }`,
        });
    }
    if (aktivitetskravStatus == AktivitetskravStatus.FORHANDSVARSEL) {
      aktivitetskravVarselFrist &&
        frister.push({
          icon: () => <HourglassTopFilledIcon aria-hidden fontSize="1.5rem" />,
          date: aktivitetskravVarselFrist,
          tooltip: texts.aktivitetskravvarselFrist,
        });
    }
  }
  if (oppfolgingsoppgave?.frist) {
    frister.push({
      icon: () =>
        selectedTab === TabType.MIN_OVERSIKT ? (
          <Button
            size="xsmall"
            icon={<FileTextIcon aria-hidden fontSize="1.5rem" />}
            className="mr-1"
            onClick={() => setIsOppfolgingsoppgaveModalOpen(true)}
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

  if (dialogmotekandidatStatus?.isKandidat && dialogmotekandidatStatus.avvent) {
    frister.push({
      icon: () => <HourglassTopFilledIcon aria-hidden fontSize="1.5rem" />,
      date: dialogmotekandidatStatus.avvent.frist,
      tooltip: texts.tooltipAvventerDialogmotekandidat,
    });
  }

  return frister;
}

interface Props {
  personData: PersonData;
}

export function FristDataCell({ personData }: Props) {
  const [
    isOppfolgingsoppgaveModalOpen,
    setIsOppfolgingsoppgaveModalOpen,
  ] = useState<boolean>(false);
  const [
    isAktivitetskravModalOpen,
    setIsAktivitetskravModalOpen,
  ] = useState<boolean>(false);
  const { selectedTab } = useTabType();
  const frister: Frist[] = fristerInfo(
    personData,
    setIsOppfolgingsoppgaveModalOpen,
    setIsAktivitetskravModalOpen,
    selectedTab
  );

  const currentVurdering = personData.aktivitetskravvurdering?.vurderinger[0];
  const isAvventVurdering =
    personData.aktivitetskravvurdering?.status == AktivitetskravStatus.AVVENT &&
    !!currentVurdering;
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
          isOpen={isOppfolgingsoppgaveModalOpen}
          setOpen={setIsOppfolgingsoppgaveModalOpen}
          oppfolgingsoppgave={personData.oppfolgingsoppgave}
          sykmeldtNavn={personData.navn}
        />
      )}
      {isAvventVurdering && (
        <AktivitetskravAvventModal
          isOpen={isAktivitetskravModalOpen}
          setOpen={setIsAktivitetskravModalOpen}
          vurdering={currentVurdering}
          sykmeldtNavn={personData.navn}
        />
      )}
    </Table.DataCell>
  );
}
