import React, { ReactElement } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { MoteoversiktLink } from '@/components/MoteoversiktLink';
import {
  enhetOversiktRoutePath,
  minOversiktRoutePath,
  sokSykmeldtRoutePath,
} from '@/routers/AppRouter';
import { Box, Heading, HStack, Tabs } from '@navikt/ds-react';
import { useFeatureToggles } from '@/data/unleash/unleashQueryHooks';
import { MagnifyingGlassIcon } from '@navikt/aksel-icons';

const texts = {
  enhetensOversikt: 'Enhetens oversikt',
  minOversikt: 'Min oversikt',
  sokSykmeldt: 'Søk etter sykmeldt',
};

export const NavigationBar = (): ReactElement => {
  const { toggles } = useFeatureToggles();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  return (
    <Box className="mb-4" background="surface-default">
      <HStack className="w-11/12 m-auto">
        <Tabs value={pathname} onChange={(value) => navigate(value)}>
          <Tabs.List>
            <Tabs.Tab
              value={minOversiktRoutePath}
              label={<Heading size="small">{texts.minOversikt}</Heading>}
            ></Tabs.Tab>
            <Tabs.Tab
              value={enhetOversiktRoutePath}
              label={<Heading size="small">{texts.enhetensOversikt}</Heading>}
            ></Tabs.Tab>
            {toggles.isSokEnabled && (
              <Tabs.Tab
                value={sokSykmeldtRoutePath}
                icon={<MagnifyingGlassIcon />}
                label={<Heading size="small">{texts.sokSykmeldt}</Heading>}
              ></Tabs.Tab>
            )}
          </Tabs.List>
        </Tabs>
        <div className="ml-auto self-center">
          <MoteoversiktLink />
        </div>
      </HStack>
    </Box>
  );
};
