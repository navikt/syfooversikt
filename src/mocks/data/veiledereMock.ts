import { VeilederDTO } from '@/api/types/veiledereTypes';

export const veiledereMock: VeilederDTO[] = [
  {
    ident: 'Z999991',
    fornavn: 'Veil',
    etternavn: 'Eder',
    enabled: true,
  },
  {
    ident: 'Z000000',
    fornavn: '',
    etternavn: '',
    enabled: true,
  },
  {
    ident: '-----',
    fornavn: 'Bør',
    etternavn: 'Børson',
    enabled: true,
  },
  {
    ident: 'Wienerbrød',
    fornavn: 'Støren',
    etternavn: 'Bakeri',
    enabled: true,
  },
  {
    ident: 'Z101010',
    fornavn: 'F_Z101010',
    etternavn: 'E_Z101010',
    enabled: true,
  },
  {
    ident: 'S123456',
    fornavn: 'Dana',
    etternavn: 'Scully',
    enabled: true,
  },
  {
    ident: 'M987654',
    fornavn: 'Fox',
    etternavn: 'Mulder',
    enabled: true,
  },
  {
    ident: 'Z101013',
    fornavn: 'Inaktiv',
    etternavn: 'Veileder',
    enabled: false,
  },
  {
    ident: 'Z101019',
    fornavn: '',
    etternavn: '',
    enabled: null,
  },
];
