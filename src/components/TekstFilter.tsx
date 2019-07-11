import React, { useState } from 'react';
import { Input } from 'nav-frontend-skjema';

interface Props {
    // todo
    initialValue?: string;
    onFilterChange: (query: string) => void;
}

export default ({ onFilterChange, initialValue }: Props) => {

    const [value, setValue] = useState(initialValue || '');

    return (
        <Input label={'Navn / Fødselsnummer'} value={value} onChange={(e) => {
            // tslint:disable-next-line:no-console
            setValue(e.target.value);
            onFilterChange(e.target.value);
        }} />
    );
};
