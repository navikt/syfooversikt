import React from 'react';
import { PersonData } from '@/api/types/personregisterTypes';
import { getReadableSkjermingskode } from '@/utils/personDataUtil';
import styled from 'styled-components';
import { AktivitetskravStatus } from '@/api/types/personoversiktTypes';
import { EtikettFokus } from 'nav-frontend-etiketter';
import { toReadableDate } from '@/utils/dateUtils';
import { useFeatureToggles } from '@/data/unleash/unleashQueryHooks';
import { ToggleNames } from '@/data/unleash/types/unleash_types';

const LabelColumnWrapper = styled.div`
  padding: 0.5em 0;

  > * {
    margin: 0.2em;
  }
`;

interface LabelColumnProps {
  personData: PersonData;
}

export const Labels = ({ personData }: LabelColumnProps) => {
  const showSkjermingskode =
    personData.skjermingskode && personData.skjermingskode !== 'INGEN';
  const showAktivitetskrav =
    personData.aktivitetskrav === AktivitetskravStatus.AVVENT;
  const { isFeatureEnabled } = useFeatureToggles();
  const showAvventerFrist = isFeatureEnabled(
    ToggleNames.aktivitetskravVurderingFrist
  );
  const avventerDato = showAvventerFrist
    ? personData.aktivitetskravVurderingFrist
    : personData.aktivitetskravSistVurdert;

  return (
    <LabelColumnWrapper>
      {showSkjermingskode && (
        <EtikettFokus mini>
          {getReadableSkjermingskode(personData.skjermingskode)}
        </EtikettFokus>
      )}

      {showAktivitetskrav && (
        <EtikettFokus mini>
          {avventerDato
            ? `Avventer (${toReadableDate(avventerDato)})`
            : 'Avventer'}
        </EtikettFokus>
      )}
    </LabelColumnWrapper>
  );
};
