import React, { ReactElement } from 'react';
import styled from 'styled-components';
import { Column } from 'nav-frontend-grid';
import { Checkbox } from 'nav-frontend-skjema';
import themes from '../styles/themes';
import {
  lenkeTilModia,
  lenkeTilModiaEnkeltperson,
  lenkeTilModiaEnkeltpersonFnr,
} from '@/utils/lenkeUtil';
import { PersonData } from '@/api/types/personregisterTypes';
import { useAktivBruker } from '@/data/modiacontext/useAktivBruker';
import { PersonRadVirksomhetColumn } from '@/components/PersonRadVirksomhetColumn';
import { Labels } from '@/components/Labels';
import { OppfolgingstilfelleDTO } from '@/api/types/personoversiktTypes';
import { FristColumn } from '@/components/FristColumn';

interface PersonradProps {
  fnr: string;
  personData: PersonData;
  checkboxHandler: (fnr: string) => void;
  kryssAv: boolean;
  veilederName: string | React.ReactNode;
  index: number;
}

export const StyledPersonRad = styled.div<{ index: number; selected: boolean }>`
  display: flex;
  align-items: center;
  padding-right: 0.5em;
  margin-bottom: 1px;
  ${(props) => {
    if (props.selected) {
      return { backgroundColor: themes.color.navBlaLighten60 };
    }
    return props.index % 2 === 0
      ? { backgroundColor: 'white' }
      : { backgroundColor: themes.color.navLysGra };
  }};
`;

const VelgBoks = styled(Checkbox)`
  margin-left: 0.5em;
  padding-bottom: 2em;
`;

const getVarighetOppfolgingstilfelle = (
  oppfolgingstilfelle: OppfolgingstilfelleDTO | undefined
): string => {
  return oppfolgingstilfelle
    ? `${oppfolgingstilfelle.varighetUker} uker`
    : 'Ukjent';
};

export const Personrad = (props: PersonradProps): ReactElement => {
  const {
    fnr,
    checkboxHandler,
    personData,
    kryssAv,
    veilederName,
    index,
  } = props;

  const aktivBruker = useAktivBruker();

  const onClick = () => {
    aktivBruker.mutate(fnr, {
      onSuccess: () => {
        window.location.href = lenkeTilModia(personData);
      },
    });
  };

  const oppfolgingstilfelleLengthInWeeks = getVarighetOppfolgingstilfelle(
    personData.latestOppfolgingstilfelle
  );

  return (
    <StyledPersonRad index={index} selected={kryssAv}>
      <Column xs={'1'}>
        <VelgBoks
          label={''}
          checked={kryssAv}
          onChange={() => {
            checkboxHandler(fnr);
          }}
        />
      </Column>
      <Column xs={'2'}>{lenkeTilModiaEnkeltperson(personData, onClick)}</Column>
      <Column xs={'2'}>
        {lenkeTilModiaEnkeltpersonFnr(personData, fnr, onClick)}
      </Column>
      <Column xs={'2'}>
        <PersonRadVirksomhetColumn personData={personData} />
      </Column>
      <Column xs={'2'}>{veilederName}</Column>
      <Column xs={'1'}>{oppfolgingstilfelleLengthInWeeks}</Column>
      <Column xs={'1'}>
        <FristColumn personData={personData} />
      </Column>
      <Column xs={'1'}>
        <Labels personData={personData} />
      </Column>
    </StyledPersonRad>
  );
};
