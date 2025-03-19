import { Alert, BodyShort, Label, Link } from '@navikt/ds-react';
import React, { ReactNode } from 'react';
import { ExternalLinkIcon } from '@navikt/aksel-icons';

const texts = {
  header: 'Teknisk feil påvirket forhåndsvarsler mellom 27.februar - 12. mars',
  info:
    'Grunnet teknisk feil har ikke forhåndsvarsel i perioden 27. februar – 12. mars blitt varslet på riktig måte. I mange av sakene har bruker fått forlenget frist, og fristen i Modia er oppdatert. Dersom berørte brukere tar kontakt, skal det gis forlenget frist.',
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
      <EksternLenke href={texts.url}>{texts.linkText}</EksternLenke>
    </Alert>
  );
}

interface EksternLenkeProps {
  href: string;
  children: ReactNode;
}

export function EksternLenke({ href, children }: EksternLenkeProps) {
  return (
    <Link href={href} target="_blank" rel="noopener noreferrer">
      {children}
      <ExternalLinkIcon title="Ekstern lenke" fontSize="1.25rem" />
    </Link>
  );
}
