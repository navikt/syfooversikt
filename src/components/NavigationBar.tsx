import React, { ReactElement } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Box, Heading, HStack, Tabs } from '@navikt/ds-react';
import { MagnifyingGlassIcon } from '@navikt/aksel-icons';
import { routes } from '@/routers/routes';
import { linkToNewHostAndPath, Subdomain } from '@/utils/miljoUtil';
import LinkAsTab from '@/components/LinkAsTab';

const texts = {
  enhetensOversikt: 'Enhetens oversikt',
  minOversikt: 'Min oversikt',
  sokSykmeldt: 'Søk etter sykmeldt',
  moteoversikt: 'Mine møter',
};

export default function NavigationBar(): ReactElement {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  return (
    <Box className="mb-4" background="surface-default">
      <HStack className="w-11/12">
        <Tabs value={pathname} onChange={(value) => navigate(value)}>
          <Tabs.List>
            <Tabs.Tab
              value={routes.MIN_OVERSIKT}
              label={<Heading size="xsmall">{texts.minOversikt}</Heading>}
            />
            <Tabs.Tab
              value={routes.ENHET_OVERSIKT}
              label={<Heading size="xsmall">{texts.enhetensOversikt}</Heading>}
            />
            <LinkAsTab
              href={linkToNewHostAndPath(
                Subdomain.SYFOMOTEOVERSIKT,
                '/syfomoteoversikt/minemoter'
              )}
              label={<Heading size="xsmall">{texts.moteoversikt}</Heading>}
            />
            <Tabs.Tab
              value={routes.SOK_SYKMELDT}
              icon={<MagnifyingGlassIcon />}
              label={<Heading size="xsmall">{texts.sokSykmeldt}</Heading>}
            />
          </Tabs.List>
        </Tabs>
      </HStack>
    </Box>
  );
}
