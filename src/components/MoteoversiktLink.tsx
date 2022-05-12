import React, { ReactElement } from 'react';
import Lenke from 'nav-frontend-lenker';
import { fullNaisUrlDefault } from '@/utils/miljoUtil';

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
