import React, { ReactNode } from 'react';
import { Link } from '@navikt/ds-react';
import { ExternalLinkIcon } from '@navikt/aksel-icons';

interface Props {
  href: string;
  children: ReactNode;
  className?: string;
}

export function EksternLenke({ href, children, className }: Props) {
  return (
    <Link
      href={href}
      className={className}
      target="_blank"
      rel="noopener noreferrer"
    >
      {children}
      <ExternalLinkIcon title="Ekstern lenke" fontSize="1.25rem" />
    </Link>
  );
}
