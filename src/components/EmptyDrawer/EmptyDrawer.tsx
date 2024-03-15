import { EmptyDrawerImage } from '../../../img/ImageComponents';
import React from 'react';
import { BodyShort } from '@navikt/ds-react';

export const texts = {
  ingenHendelser: 'Vi finner ingen personer som har hendelser',
  altText: 'Her var det ikke mye',
};

export const EmptyDrawer = () => (
  <div className="mt-16 text-center">
    <img alt={texts.altText} src={EmptyDrawerImage} />
    <BodyShort size="large" className="mt-8">
      {texts.ingenHendelser}
    </BodyShort>
  </div>
);
