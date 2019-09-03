import React, { useEffect, useState } from 'react';
import Side from './Side';
import LandingssideHeader from '../components/LandingssideHeader';
import OversiktVelger from '../components/OversiktVelger';
import ChangelogWrapper from '../components/changelog/ChangelogWrapper';

export const Landingsside = () => {
  return (
    <Side tittel="">
      <LandingssideHeader />
      <OversiktVelger />
      <ChangelogWrapper />
    </Side>
  );
};
