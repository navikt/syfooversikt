import {
  Column,
  Container,
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
    <Container>
      <Row>
        <Column className="col-xs-12">
          <ContextContainer />
        </Column>
      </Row>
      <Row>
        <Column className="col-xs-12">
          {children}
        </Column>
      </Row>
    </Container>
  </DocumentTitle>);
};

export default Side;