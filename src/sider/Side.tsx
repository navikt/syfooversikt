import { Row } from 'nav-frontend-grid';
import React, { ReactElement } from 'react';
import ContextContainer from '../context/ContextContainer';
import DocumentTitle from 'react-document-title';

interface SideProps {
  children: ReactElement;
  tittel: string;
}

const Side = ({ tittel = '', children }: SideProps): ReactElement => {
  return (
    <DocumentTitle
      title={tittel + (tittel.length > 0 ? ' - Syfooversikt' : 'Syfooversikt')}
    >
      <div>
        <Row>
          <ContextContainer />
        </Row>
        <Row>{children}</Row>
      </div>
    </DocumentTitle>
  );
};

export default Side;
