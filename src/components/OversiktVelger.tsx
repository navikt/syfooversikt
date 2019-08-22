import React, {
  Component,
  Fragment,
} from 'react';
import cn from 'classnames';
import { OverviewTabType } from '../konstanter';
import OversiktContainer from '../containers/OversiktContainer';

const tekster = {
  enhetensOversikt: 'Enhetens oversikt',
  minOversikt: 'Min oversikt',
};

interface StateProps {
  visning: OverviewTabType;
}

const getBtnClassNames = (aktiv: boolean) => {
  const aktivClass = aktiv ? 'oversiktVelger__knapp--aktiv' : undefined;
  return cn(aktivClass);
};

class OversiktVelger extends Component<{}, StateProps> {
  constructor(props: any) {
    super(props);
    this.state = {
      visning: OverviewTabType.ENHET_OVERVIEW,
    };
    this.byttVisning = this.byttVisning.bind(this);
  }

  byttVisning(visning: OverviewTabType) {
    this.setState({
      visning,
    });
  }

  render() {
    const visning = this.state.visning;
    return (<Fragment>
      <div className="oversiktVelger">
        <ul>
          <li>
            <button
                className={getBtnClassNames(visning === OverviewTabType.ENHET_OVERVIEW)}
                aria-pressed={visning === OverviewTabType.ENHET_OVERVIEW}
                onClick={() => {
                  this.byttVisning(OverviewTabType.ENHET_OVERVIEW);
                }}>
              {tekster.enhetensOversikt}
            </button>
            <button
                className={getBtnClassNames(visning === OverviewTabType.MY_OVERVIEW)}
                aria-pressed={visning === OverviewTabType.MY_OVERVIEW}
                onClick={() => {
                  this.byttVisning(OverviewTabType.MY_OVERVIEW);
                }}>
              {tekster.minOversikt}
            </button>
          </li>
        </ul>
      </div>
      <OversiktContainer type={visning}/>
    </Fragment>);
  }
}

export default OversiktVelger;
