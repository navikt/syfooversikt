import React from 'react';
import cn from 'classnames';

interface NumberIndicatorProps {
    antall: number;
    valgtIndex: number;
}

const NumberIndicator = ({ antall, valgtIndex }: NumberIndicatorProps) => {
    const mapTilSteg = () => {
        return new Array(antall)
            .fill(0)
            .map((_, i) => (
                <div key={i} className={cn('step-indicator__step', {'step-indicator__step--selected': i === valgtIndex})}/>
            ));
    };

    return (
        <div className="step-indicator">
            {mapTilSteg()}
        </div>
    );
};

export default NumberIndicator;
