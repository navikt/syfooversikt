import React, { ReactNode } from 'react';
import { QueryErrorResetBoundary } from 'react-query';
import { ErrorBoundary } from '@sentry/react';
import { Knapp } from 'nav-frontend-knapper';

interface Props {
  children: ReactNode;
}

export const ErrorHandler = ({ children }: Props) => {
  return (
    <QueryErrorResetBoundary>
      {({ reset }) => (
        <ErrorBoundary
          fallback={({ error, componentStack, resetError }) => (
            <React.Fragment>
              <div>You have encountered an error</div>
              <div>{error.toString()}</div>
              <div>{componentStack}</div>
              <Knapp
                onClick={() => {
                  resetError();
                  reset();
                }}
              >
                Click here to reset!
              </Knapp>
            </React.Fragment>
          )}
        >
          {children}
        </ErrorBoundary>
      )}
    </QueryErrorResetBoundary>
  );
};
