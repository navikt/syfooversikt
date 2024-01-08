import React, { ReactNode } from 'react';
import { defaultErrorTexts } from '@/api/errors';
import { Alert } from '@navikt/ds-react';

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
        <div className="flex justify-center">
          <div className="flex flex-col w-[50rem] m-8">
            <Alert variant="error">{defaultErrorTexts.generalError}</Alert>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
