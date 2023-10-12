import React, { ReactNode } from 'react';
import { defaultErrorTexts } from '@/api/errors';
import styled from 'styled-components';
import { Alert } from '@navikt/ds-react';

const ErrorContentContainer = styled.div`
  display: flex;
  justify-content: center;
`;

const ErrorRow = styled.div`
  display: flex;
  flex-direction: column;
  width: 50em;
  margin: 2rem;
`;

interface ErrorBoundaryProps {
  children: ReactNode;
}

type State = {
  hasError: boolean;
};

class ErrorBoundary extends React.Component<ErrorBoundaryProps, State> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }

  componentDidCatch() {
    this.setState({ hasError: true });
  }

  render() {
    if (this.state.hasError) {
      return (
        <ErrorContentContainer>
          <ErrorRow>
            <Alert variant="error">{defaultErrorTexts.generalError}</Alert>
          </ErrorRow>
        </ErrorContentContainer>
      );
    }

    return this.props.children;
  }
}
export default ErrorBoundary;
