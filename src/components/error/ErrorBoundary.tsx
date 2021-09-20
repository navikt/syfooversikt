import React, { ReactElement, ReactNode } from 'react';
import * as Sentry from '@sentry/react';
import { ApiErrorException } from '@/api/errors';
import styled from 'styled-components';
import AlertStripe from 'nav-frontend-alertstriper';

export type ErrorContext = 'mainPage' | 'appRouter' | 'oversiktContainer';

interface ContentProps {
  message: string;
}

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

const ErrorContent = ({ message }: ContentProps): ReactElement => {
  return (
    <ErrorContentContainer>
      <ErrorRow>
        <AlertStripe type="feil">{message}</AlertStripe>
      </ErrorRow>
    </ErrorContentContainer>
  );
};

const renderErrorContent = (
  error: Error,
  customError?: CustomError
): ReactElement => {
  if (customError) {
    return <ErrorContent message={customError.message} />;
  }

  if (error instanceof ApiErrorException) {
    return <ErrorContent message={error.error.defaultErrorMsg} />;
  }

  return <ErrorContent message={error.message} />;
};

interface CustomError {
  header: string;
  message: string;
}

interface ErrorBoundaryProps {
  children: ReactNode;
  context: ErrorContext;
  customError?: CustomError;
}

export const ErrorBoundary = ({
  context,
  children,
  customError,
}: ErrorBoundaryProps) => {
  return (
    <Sentry.ErrorBoundary
      beforeCapture={(scope) => {
        scope.setTag('context', context);
      }}
      fallback={({ error }) => renderErrorContent(error, customError)}
    >
      {children}
    </Sentry.ErrorBoundary>
  );
};
