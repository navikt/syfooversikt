import React, { useRef, useState } from 'react';
import {
  companyNamesFromPersonData,
  firstCompanyNameFromPersonData,
} from '@/utils/personDataUtil';
import { Popover } from '@navikt/ds-react';
import styled from 'styled-components';
import { PersonData } from '@/api/types/personregisterTypes';

const StyledPopover = styled(Popover)`
  position: relative;
  margin-left: -5em;
  margin-right: -5em;
`;

interface PersonRadVirksomhetColumnProps {
  personData: PersonData;
}

export const PersonRadVirksomhetColumn = ({
  personData,
}: PersonRadVirksomhetColumnProps) => {
  const virksomehtRef = useRef(null);
  const [showVirksomheter, setShowVirksomheter] = useState(false);
  const showPopover = () => setShowVirksomheter(true);
  const dontShowPopover = () => setShowVirksomheter(false);
  const companyNames = companyNamesFromPersonData(personData);

  return (
    <>
      <p
        ref={virksomehtRef}
        onMouseEnter={showPopover}
        onMouseLeave={dontShowPopover}
      >
        {firstCompanyNameFromPersonData(personData)}
      </p>
      <StyledPopover
        open={showVirksomheter}
        onClose={() => setShowVirksomheter(false)}
        anchorEl={virksomehtRef.current}
      >
        <Popover.Content>{companyNames.join(', ')}</Popover.Content>
      </StyledPopover>
    </>
  );
};
