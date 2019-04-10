import { expect } from 'chai';
import { hentEnhetensMotebehovHentet } from '../../../src/store/enhetensMotebehov/enhetensMotebehov_actions';
import { hentPersonNavnHentet } from '../../../src/store/personNavn/personNavn_actions';
import personregisterReducer from '../../../src/store/personregister/personregisterReducer';

describe('personregisterReducer', () => {
  describe('Henter persondata', () => {
    const initialState = Object.freeze({ });

    it('handterer HENT_ENHETENS_MOTEBEHOV_HENTET', () => {
      const dataIForsteKall = [ { fnr: '99999911111', skjermingskode: 'INGEN'}, { fnr: '99999922222', skjermingskode: 'DISKRESJONSMERKET'} ];
      const dataIAndreKall = [ { fnr: '99999933333', skjermingskode: 'EGEN_ANSATT'} ];
      const forsteAction = hentEnhetensMotebehovHentet(dataIForsteKall);
      const andreAction = hentEnhetensMotebehovHentet(dataIAndreKall);
      const forsteState = personregisterReducer(initialState, forsteAction);
      expect(forsteState).to.deep.equal({
        ['99999911111']: { harSvartPaaMotebehov: true, skjermingskode: 'INGEN' },
        ['99999922222']: { harSvartPaaMotebehov: true, skjermingskode: 'DISKRESJONSMERKET' }
      });
      const andreState = personregisterReducer(forsteState, andreAction);
      expect(andreState).to.deep.equal({
        ['99999911111']: { harSvartPaaMotebehov: true, skjermingskode: 'INGEN' },
        ['99999922222']: { harSvartPaaMotebehov: true, skjermingskode: 'DISKRESJONSMERKET' },
        ['99999933333']: { harSvartPaaMotebehov: true, skjermingskode: 'EGEN_ANSATT' }
      });
    });

    it('handterer HENT_PERSON_NAVN_HENTET', () => {
      const dataIForsteKall = [ { fnr: '99999911111', navn: 'Et navn' }, { fnr: '99999922222', navn: 'Et annet navn' } ];
      const dataIAndreKall = [ {fnr: '99999933333', navn: 'Nok et navn..'} ];
      const forsteAction = hentPersonNavnHentet(dataIForsteKall);
      const andreAction = hentPersonNavnHentet(dataIAndreKall);
      const forsteState = personregisterReducer(initialState, forsteAction);
      expect(forsteState).to.deep.equal({
        ['99999911111']: { navn: 'Et navn' },
        ['99999922222']: { navn: 'Et annet navn' }
      });
      const andreState = personregisterReducer(forsteState, andreAction);
      expect(andreState).to.deep.equal({
        ['99999911111']: { navn: 'Et navn' },
        ['99999922222']: { navn: 'Et annet navn' },
        ['99999933333']: { navn: 'Nok et navn..' }
      });
    });

    it('handterer kombinasjoner', () => {
      const dataIForsteKall = [ { fnr: '99999911111', skjermingskode: 'INGEN'}, { fnr: '99999922222', skjermingskode: 'DISKRESJONSMERKET'}, { fnr: '99999933333', skjermingskode: 'EGEN_ANSATT'} ];
      const dataIAndreKall = [ { fnr: '99999911111', navn: 'Et navn' }, { fnr: '99999922222', navn: 'Et annet navn' }, {fnr: '99999933333', navn: 'Nok et navn..'} ];
      const forsteAction = hentEnhetensMotebehovHentet(dataIForsteKall);
      const andreAction = hentPersonNavnHentet(dataIAndreKall);
      const forsteState = personregisterReducer(initialState, forsteAction);
      expect(forsteState).to.deep.equal({
        ['99999911111']: { harSvartPaaMotebehov: true, skjermingskode: 'INGEN' },
        ['99999922222']: { harSvartPaaMotebehov: true, skjermingskode: 'DISKRESJONSMERKET' },
        ['99999933333']: { harSvartPaaMotebehov: true, skjermingskode: 'EGEN_ANSATT' }
      });
      const andreState = personregisterReducer(forsteState, andreAction);
      expect(andreState).to.deep.equal({
        ['99999911111']: { navn: 'Et navn', harSvartPaaMotebehov: true, skjermingskode: 'INGEN' },
        ['99999922222']: { navn: 'Et annet navn', harSvartPaaMotebehov: true, skjermingskode: 'DISKRESJONSMERKET' },
        ['99999933333']: { navn: 'Nok et navn..', harSvartPaaMotebehov: true, skjermingskode: 'EGEN_ANSATT' }
      });
    });
  });
});