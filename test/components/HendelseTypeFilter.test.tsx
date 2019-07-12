import chai from 'chai';
import chaiEnzyme from 'chai-enzyme';
import { shallow } from 'enzyme';
import SokeresultatFilter from '../../src/components/HendelseTypeFilter';
import React from 'react';
import { Checkbox } from 'nav-frontend-skjema';

chai.use(chaiEnzyme());
const expect = chai.expect;

describe('SokeresultatFilter', () => {
    // tslint:disable-next-line:no-empty
    const callback = () => {};
    const component = shallow(<SokeresultatFilter onFilterChange={callback} /> );

    it('Skal inneholde checkbokser med riktige labels', () => {
        expect(component.contains(<Checkbox label={'Ønsker møte'} checked={false} />));
        expect(component.contains(<Checkbox label={'Svar møteplanlegger'} checked={false} />));
        expect(component.contains(<Checkbox label={'Ufordelte brukere'} checked={false} />));
    });

    // TODO: test click handling?

});
