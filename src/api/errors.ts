export const defaultErrorTexts = {
  accessDenied: "Du har ikke tilgang til å utføre denne handlingen.",
  generalError: "Det skjedde en uventet feil. Vennligst prøv igjen senere.",
  networkError: "Vi har problemer med nettet, prøv igjen senere.",
  loginRequired: "Handlingen krever at du logger på.",
  conflictError:
    "Det skjedde en uventet feil. Det kan hende en annen veileder har oppdatert siden. Last inn siden på nytt og prøv igjen.",
};

export enum ErrorType {
  ACCESS_DENIED = "ACCESS_DENIED",
  GENERAL_ERROR = "GENERAL_ERROR",
  NETWORK_ERROR = "NETWORK_ERROR",
  LOGIN_REQUIRED = "LOGIN_REQUIRED",
  CONFLICT_ERROR = "CONFLICT_ERROR",
}

export function resolveErrorMessage(error: unknown) {
  return error instanceof ApiErrorException
    ? error.error.defaultErrorMsg
    : defaultErrorTexts.generalError;
}

export class ApiErrorException extends Error {
  constructor(
    public readonly error: ApiError,
    public readonly code?: number,
  ) {
    super(error.message);
  }
}

export interface ApiError {
  type: ErrorType;
  message: string;
  defaultErrorMsg: string;
}

export const generalError = (error: Error): ApiError => ({
  type: ErrorType.GENERAL_ERROR,
  message: error.message,
  defaultErrorMsg: defaultErrorTexts.generalError,
});

export const loginRequiredError = (error: Error): ApiError => ({
  type: ErrorType.LOGIN_REQUIRED,
  message: error.message,
  defaultErrorMsg: defaultErrorTexts.loginRequired,
});

export const accessDeniedError = (error: Error): ApiError => {
  return {
    type: ErrorType.ACCESS_DENIED,
    message: error.message,
    defaultErrorMsg: defaultErrorTexts.accessDenied,
  };
};

export const conflictError = (error: Error): ApiError => {
  return {
    type: ErrorType.CONFLICT_ERROR,
    message: error.message,
    defaultErrorMsg: defaultErrorTexts.conflictError,
  };
};

export const networkError = (error: Error): ApiError => ({
  type: ErrorType.NETWORK_ERROR,
  message: error.message,
  defaultErrorMsg: defaultErrorTexts.networkError,
});

export const isClientError = (error: unknown): boolean =>
  error instanceof ApiErrorException &&
  error.error.type !== ErrorType.LOGIN_REQUIRED &&
  !!error.code &&
  error.code.toString().startsWith("4");

/**
 * Checks whether the given error represents an HTTP 4xx client error response
 * (status code in the 400-499 range), including 401 and 403.
 *
 * Unlike {@link isClientError}, this does not exclude LOGIN_REQUIRED (401), so
 * it can be used to determine that a request should not be retried.
 */
export const is4xxError = (error: unknown): boolean =>
  error instanceof ApiErrorException &&
  error.code !== undefined &&
  error.code >= 400 &&
  error.code < 500;
