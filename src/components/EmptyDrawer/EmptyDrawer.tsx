import { EmptyDrawerImage } from '../../../img/ImageComponents';
import React from 'react';
import { Ingress } from 'nav-frontend-typografi';

export const texts = {
  ingenHendelser: 'Vi finner ingen personer som har hendelser',
  altText: 'Her var det ikke mye',
};

export const EmptyDrawer = () => {
  return (
    <div className="mt-16">
      <div className="text-center">
        <img alt={texts.altText} src={EmptyDrawerImage} />
        <Ingress className="mt-8">{texts.ingenHendelser}</Ingress>
      </div>
    </div>
  );
};
