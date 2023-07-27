import { Changelog } from '@/api/types/changelogTypes';

export const changelogsMock: Changelog[] = [
  {
    title: 'Ny oppdatering',
    date: '10-09-19',
    items: [
      {
        title: 'Tildel veileder',
        text:
          'Tildel meg er fjernet. Denne funksjonaliteten finner du nå under Tildel veileder',
        image: '/syfooversikt/changelogs/image/1/tildelmeg1.png',
      },
      {
        title: 'Tildel meg',
        text: 'Navnet ditt/nav-identen din finner du øverst i denne listen',
        image: '/syfooversikt/changelogs/image/1/tildelmeg2.png',
      },
    ],
    version: 1,
  },
];
