import React, { ReactElement } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { MoteoversiktLink } from '@/components/MoteoversiktLink';
import { Box, Heading, HStack, Tabs } from '@navikt/ds-react';
import { MagnifyingGlassIcon } from '@navikt/aksel-icons';
import { routes } from '@/routers/routes';

const texts = {
  enhetensOversikt: 'Enhetens oversikt',
  minOversikt: 'Min oversikt',
  sokSykmeldt: 'Søk etter sykmeldt',
};

export const NavigationBar = (): ReactElement => {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  return (
    <Box className="mb-4" background="surface-default">
      <HStack className="w-11/12 m-auto">
        <Tabs value={pathname} onChange={(value) => navigate(value)}>
          <Tabs.List>
            <Tabs.Tab
              value={routes.MIN_OVERSIKT}
              label={<Heading size="small">{texts.minOversikt}</Heading>}
            />
            <Tabs.Tab
              value={routes.ENHET_OVERSIKT}
              label={<Heading size="small">{texts.enhetensOversikt}</Heading>}
            />
            <Tabs.Tab
              value={routes.SOK_SYKMELDT}
              icon={<MagnifyingGlassIcon />}
              label={<Heading size="small">{texts.sokSykmeldt}</Heading>}
            />
          </Tabs.List>
        </Tabs>
        <div className="ml-auto self-center">
          <MoteoversiktLink />
        </div>
      </HStack>
    </Box>
  );
};
