import {
  Row
} from 'nav-frontend-grid';
import React from 'react';
import ContextContainer from '../context/ContextContainer';

interface SideProps {
  children: object;
  tittel: string;
}

const DocumentTitle = require('react-document-title'); // tslint:disable-line no-var-requires

const Side = ({ tittel = '', children }: SideProps) => {
  return (<DocumentTitle title={tittel + (tittel.length > 0 ? ' - Syfooversikt' : 'Syfooversikt')}>
      <div>
        <Row>
            <ContextContainer />
        </Row>
        <Row>
            {children}
        </Row>
      </div>
  </DocumentTitle>);
};

export default Side;
