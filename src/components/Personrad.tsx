import React from 'react';
import styled from 'styled-components';
import { Column } from 'nav-frontend-grid';
import { Checkbox } from 'nav-frontend-skjema';
import themes from '../styles/themes';
import { lenkeTilModiaEnkeltperson } from '../utils/lenkeUtil';
import { PersonData } from '../store/personregister/personregisterTypes';
import {
  skjermingskode,
  companyNamesFromPersonData,
  firstCompanyNameFromPersonData,
} from '../utils/personDataUtil';

interface PersonradProps {
  fnr: string;
  personData: PersonData;
  checkboxHandler: (fnr: string) => void;
  kryssAv: boolean;
  veilederName: string | React.ReactNode;
  index: number;
}

export const PersonRad = styled.div<{ index: number, selected: boolean }>`
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

const NoWrapText = styled.p`
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
`;

const VelgBoks = styled(Checkbox)`
  margin-left: 0.5em;
  padding-bottom: 1em;
`;

export default (props: PersonradProps) => {
  const {
    fnr,
    checkboxHandler,
    personData,
    kryssAv,
    veilederName,
    index,
  } = props;

  return (
    <PersonRad index={index} selected={kryssAv}>
      <Column xs={'1'}>
        <VelgBoks
          label={''}
          checked={!!kryssAv}
          onChange={() => {
            checkboxHandler(fnr);
          }}
        />
      </Column>
      <Column xs={'3'}>{lenkeTilModiaEnkeltperson(personData.navn, fnr)}</Column>
      <Column xs={'2'}>{fnr}</Column>
      <Column xs={'2'}>{firstCompanyNameFromPersonData(personData)}</Column>
      <Column xs={'2'}>{veilederName}</Column>
      <Column xs={'2'}><NoWrapText>{skjermingskode(personData)}</NoWrapText></Column>
    </PersonRad>
  );
};
