import React, { ReactElement } from 'react';
import { fullNaisUrlDefault } from '@/utils/miljoUtil';
import { Link } from '@navikt/ds-react';

const texts = {
  moteoversikt: 'Mine møter',
};

export const MoteoversiktLink = (): ReactElement => (
  <Link
    href={fullNaisUrlDefault('syfomoteoversikt', '/syfomoteoversikt/minemoter')}
  >
    {texts.moteoversikt}
  </Link>
);
