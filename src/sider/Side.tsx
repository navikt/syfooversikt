import { Row } from 'nav-frontend-grid';
import React, { ReactElement, useEffect } from 'react';
import DocumentTitle from 'react-document-title';
import { trackPageLoad } from '@/amplitude/amplitude';

interface SideProps {
  children: ReactElement;
  tittel: string;
}

const Side = ({ tittel = '', children }: SideProps): ReactElement => {
  useEffect(() => {
    trackPageLoad(tittel);
  }, [tittel]);

  return (
    <DocumentTitle
      title={tittel + (tittel.length > 0 ? ' - Syfooversikt' : 'Syfooversikt')}
    >
      <div>
        <Row>{children}</Row>
      </div>
    </DocumentTitle>
  );
};

export default Side;
