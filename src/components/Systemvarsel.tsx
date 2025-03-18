import { Alert, BodyShort } from '@navikt/ds-react';
import React from 'react';

const texts = {
  forhandsvarselSystemfeil:
    'Grunnet teknisk feil har ikke forhåndsvarsel i perioden 27. februar – 12. mars blitt varslet på riktig måte. I mange av sakene har bruker fått forlenget frist, og fristen i Modia er oppdatert. Dersom berørte brukere tar kontakt, skal det gis forlenget frist.',
};

//TODO: Kan fjernes etter at ny frist har utgått: 09.04.25
export default function Systemvarsel() {
  return (
    <Alert
      variant={'error'}
      size={'medium'}
      className={'mb-4'}
      contentMaxWidth={false}
    >
      <BodyShort>{texts.forhandsvarselSystemfeil}</BodyShort>
    </Alert>
  );
}
