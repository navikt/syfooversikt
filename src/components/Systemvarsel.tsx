import { Alert, BodyShort, Label } from '@navikt/ds-react';
import React from 'react';
import { EksternLenke } from '@/components/EksternLenke';

const texts = {
  header: 'Teknisk feil påvirket forhåndsvarsler mellom 27. februar - 12. mars',
  info:
    'Grunnet teknisk feil har ikke forhåndsvarsel i perioden 27. februar – 12. mars blitt varslet på riktig måte. I mange av sakene har bruker fått forlenget frist til 9. april 2025, og fristen i Modia er oppdatert tilsvarende. Dersom berørte brukere tar kontakt, skal det gis forlenget frist.',
  linkText: 'Du kan lese mer om dette på Navet',
  url:
    'https://navno.sharepoint.com/sites/fag-og-ytelser-arbeid-sykefravarsoppfolging-og-sykepenger/SitePages/Teknisk-feil-med-varslinger-i-perioden-27.02.2025-til-13.03.2025.aspx',
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
      <EksternLenke href={texts.url}>{texts.linkText}</EksternLenke>
    </Alert>
  );
}
