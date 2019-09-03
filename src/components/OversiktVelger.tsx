import React, {
  Component,
} from 'react';
import cn from 'classnames';
import { OverviewTabType } from '../konstanter';
import OversiktContainer from '../containers/OversiktContainer';
import ChangelogModal from '../components/changelog/ChangelogModal';

const tekster = {
  enhetensOversikt: 'Enhetens oversikt',
  minOversikt: 'Min oversikt',
};

interface StateProps {
  visning: OverviewTabType;
  changeLogModalOpen: boolean;
}

const getButtonClassNames = (aktiv: boolean) => {
  const aktivClass = aktiv
    ? 'oversiktVelger__knapp--aktiv'
    : undefined;
  return cn(aktivClass);
};

class OversiktVelger extends Component<{}, StateProps> {
  constructor(props: any) {
    super(props);
    this.state = {
      visning: OverviewTabType.ENHET_OVERVIEW,
      changeLogModalOpen: true,
    };
    this.byttVisning = this.byttVisning.bind(this);
    this.closeChangeLogModal = this.closeChangeLogModal.bind(this);
  }

  byttVisning(visning: OverviewTabType) {
    this.setState({
      visning,
    });
  }

  closeChangeLogModal() {
    this.setState({
      changeLogModalOpen: false,
    });
  }

  render() {
    const visning = this.state.visning;
    return (<>
      <div className="oversiktVelger">
        <ul>
          <li>
            <button
                className={getButtonClassNames(visning === OverviewTabType.ENHET_OVERVIEW)}
                aria-pressed={visning === OverviewTabType.ENHET_OVERVIEW}
                onClick={() => {
                  this.byttVisning(OverviewTabType.ENHET_OVERVIEW);
                }}>
              {tekster.enhetensOversikt}
            </button>
            <button
                className={getButtonClassNames(visning === OverviewTabType.MY_OVERVIEW)}
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
    </>);
  }
}

export default OversiktVelger;
