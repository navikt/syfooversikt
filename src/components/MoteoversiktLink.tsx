import { fullNaisUrlDefault } from '@/utils/miljoUtil';
import Lenke from 'nav-frontend-lenker';
import React, { ReactElement } from 'react';

const texts = {
  moteoversikt: 'Mine møter',
};

export const MoteoversiktLink = (): ReactElement => (
  <Lenke
    href={fullNaisUrlDefault('syfomoteoversikt', '/syfomoteoversikt/minemoter')}
  >
    {texts.moteoversikt}
  </Lenke>
);
