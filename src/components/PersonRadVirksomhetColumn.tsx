import React, { useRef, useState } from 'react';
import { virksomhetnummerFromPersonData } from '@/utils/personDataUtil';
import { Popover } from '@navikt/ds-react';
import styled from 'styled-components';
import { PersonData } from '@/api/types/personregisterTypes';
import { useVirksomheterQueries } from '@/data/virksomhet/virksomhetQueryHooks';

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

  const virksomhetsnumre = virksomhetnummerFromPersonData(personData);
  const companyNames = useVirksomheterQueries(virksomhetsnumre);

  return (
    <>
      <p
        ref={virksomehtRef}
        onMouseEnter={showPopover}
        onMouseLeave={dontShowPopover}
      >
        {companyNames[0]}
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
