import { Alert, BodyShort, Label } from '@navikt/ds-react';
import React from 'react';

const texts = {
  header: 'Teknisk feil påvirket forhåndsvarsler mellom 27. februar - 12. mars',
  info:
    'Grunnet teknisk feil har ikke forhåndsvarsel i perioden 27. februar – 12. mars blitt varslet på riktig måte. I mange av sakene har bruker fått forlenget frist til 9. april 2025, og fristen i Modia er oppdatert tilsvarende. Dersom berørte brukere tar kontakt, skal det gis forlenget frist.',
  linkText: 'Du kan lese mer om dette på Navet',
  url: '',
};

export default function Systemvarsel() {
  return (
    <Alert
      variant={'error'}
      size={'medium'}
      className={'mb-4'}
      contentMaxWidth={false}
    >
      <Label>{texts.header}</Label>
      <BodyShort>{texts.info}</BodyShort>
    </Alert>
  );
}
