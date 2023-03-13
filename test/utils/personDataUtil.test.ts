import { expect } from 'chai';
import {
  PersonData,
  ReadableSkjermingskode,
} from '@/api/types/personregisterTypes';
import {
  getReadableSkjermingskode,
  hasActiveAktivitetskravStatus,
} from '@/utils/personDataUtil';
import { testdata } from '../data/fellesTestdata';
import { AktivitetskravStatus } from '@/api/types/personoversiktTypes';
import dayjs from 'dayjs';

const INGEN: ReadableSkjermingskode = 'ingen';
const EGEN_ANSATT: ReadableSkjermingskode = 'egen ansatt';

describe('personDataUtils', () => {
  describe('getReadableSkjermingskode', () => {
    it('returns string with lowercase letters and underscore removed', () => {
      const person: PersonData = {
        navn: testdata.navn1,
        harMotebehovUbehandlet: false,
        skjermingskode: testdata.skjermingskode.egenAnsatt,
        markert: false,
      } as PersonData;

      const returnertString = getReadableSkjermingskode(person.skjermingskode);

      expect(returnertString).to.equal(EGEN_ANSATT);
    });
    it('returns lowercase "ingen" if kode is "INGEN"', () => {
      const person: PersonData = {
        navn: testdata.navn1,
        harMotebehovUbehandlet: false,
        skjermingskode: testdata.skjermingskode.ingen,
        markert: false,
      } as PersonData;

      const returnertString = getReadableSkjermingskode(person.skjermingskode);

      expect(returnertString).to.equal(INGEN);
    });
  });

  describe('hasAktivAktivitetskravStatus', () => {
    it('return true if AktivitetskravStatus is NY and stoppunkt after arena cutoff', () => {
      const person = {
        aktivitetskrav: AktivitetskravStatus.NY,
        aktivitetskravStoppunkt: dayjs('2023-03-11').toDate(),
      } as PersonData;

      const isActive = hasActiveAktivitetskravStatus(person);

      expect(isActive).to.equal(true);
    });

    it('return true if AktivitetskravStatus is AVVENT and stoppunkt after arena cutoff', () => {
      const person = {
        aktivitetskrav: AktivitetskravStatus.AVVENT,
        aktivitetskravStoppunkt: dayjs('2023-03-11').toDate(),
      } as PersonData;

      const isActive = hasActiveAktivitetskravStatus(person);

      expect(isActive).to.equal(true);
    });
    it('return false if AktivitetskravStatus is NY and stoppunkt equal arena cutoff', () => {
      const person = {
        aktivitetskrav: AktivitetskravStatus.NY,
        aktivitetskravStoppunkt: dayjs('2023-03-10').toDate(),
      } as PersonData;

      const isActive = hasActiveAktivitetskravStatus(person);

      expect(isActive).to.equal(false);
    });

    it('return false if AktivitetskravStatus is AVVENT and stoppunkt before arena cutoff', () => {
      const person = {
        aktivitetskrav: AktivitetskravStatus.AVVENT,
        aktivitetskravStoppunkt: dayjs('2023-03-09').toDate(),
      } as PersonData;

      const isActive = hasActiveAktivitetskravStatus(person);

      expect(isActive).to.equal(false);
    });

    it('return false if AktivitetskravStatus is AVVENT and stoppunkt missing', () => {
      const person = {
        aktivitetskrav: AktivitetskravStatus.AVVENT,
      } as PersonData;

      const isActive = hasActiveAktivitetskravStatus(person);

      expect(isActive).to.equal(false);
    });

    it('return false if AktivitetskravStatus is OPPFYLT', () => {
      const person = {
        aktivitetskrav: AktivitetskravStatus.OPPFYLT,
      } as PersonData;

      const isActive = hasActiveAktivitetskravStatus(person);

      expect(isActive).to.equal(false);
    });

    it('return false if AktivitetskravStatus is AUTOMATISK_OPPFYLT', () => {
      const person = {
        aktivitetskrav: AktivitetskravStatus.AUTOMATISK_OPPFYLT,
      } as PersonData;

      const isActive = hasActiveAktivitetskravStatus(person);

      expect(isActive).to.equal(false);
    });

    it('return false if AktivitetskravStatus is STANS', () => {
      const person = {
        aktivitetskrav: AktivitetskravStatus.STANS,
      } as PersonData;

      const isActive = hasActiveAktivitetskravStatus(person);

      expect(isActive).to.equal(false);
    });

    it('return false if AktivitetskravStatus is UNNTAK', () => {
      const person = {
        aktivitetskrav: AktivitetskravStatus.UNNTAK,
      } as PersonData;

      const isActive = hasActiveAktivitetskravStatus(person);

      expect(isActive).to.equal(false);
    });
  });
});
