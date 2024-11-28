import { useLocation } from 'react-router-dom';
import { Routes } from '@/routers/routes';

export enum TabType {
  ENHETENS_OVERSIKT = 'ENHETENS_OVERSIKT',
  MIN_OVERSIKT = 'MIN_OVERSIKT',
  SOK_SYKMELDT = 'SOK_SYKMELDT',
}

const routeTabs: Record<Routes, TabType> = {
  '/enhet': TabType.ENHETENS_OVERSIKT,
  '/minoversikt': TabType.MIN_OVERSIKT,
  '/sok': TabType.SOK_SYKMELDT,
};

export const useTabType = () => {
  const { pathname } = useLocation();
  const selectedTab = routeTabs[pathname as Routes];

  return { selectedTab };
};
