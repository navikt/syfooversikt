import React, { ReactElement } from 'react';
import { linkToNewHostAndPath, Subdomain } from '@/utils/miljoUtil';
import { Link } from '@navikt/ds-react';

const texts = {
  moteoversikt: 'Mine møter',
};

export const MoteoversiktLink = (): ReactElement => (
  <Link
    href={linkToNewHostAndPath(
      Subdomain.SYFOMOTEOVERSIKT,
      '/syfomoteoversikt/minemoter'
    )}
  >
    {texts.moteoversikt}
  </Link>
);
