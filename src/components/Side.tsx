import React, { ReactElement } from 'react';
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
      {children}
    </DocumentTitle>
  );
};

export default Side;
