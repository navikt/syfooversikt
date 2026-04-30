import React from 'react';
import { BodyShort } from '@navikt/ds-react';
import EmptyDrawerImage from '@/svg/EmptyDrawer.svg';

const texts = {
  ingenHendelser: 'Vi finner ingen personer som har hendelser',
  altText: 'Her var det ikke mye',
};

export default function EmptyDrawer() {
  return (
    <div className="flex flex-col mt-16 items-center">
      <EmptyDrawerImage />
      <BodyShort size="large" className="mt-8">
        {texts.ingenHendelser}
      </BodyShort>
    </div>
  );
}
