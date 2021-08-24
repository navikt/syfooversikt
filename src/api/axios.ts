import axios, { AxiosError } from 'axios';
import {
  accessDeniedError,
  ApiErrorException,
  generalError,
  loginRequiredError,
  networkError,
} from './errors';

export const NAV_CONSUMER_ID_HEADER = 'nav-consumer-id';
export const NAV_CONSUMER_ID = 'syfomodiaperson';
export const NAV_PERSONIDENT_HEADER = 'nav-personident';

export const defaultRequestHeaders = (personIdent?: string): HeadersInit => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    [NAV_CONSUMER_ID_HEADER]: NAV_CONSUMER_ID,
  };

  if (personIdent) {
    headers[NAV_PERSONIDENT_HEADER] = personIdent;
  }
  return headers;
};

function handleAxiosError(error: AxiosError) {
  if (error.response) {
    switch (error.response.status) {
      case 401: {
        window.location.href = `/login?redirectTo=${window.location.pathname}`;
        throw new ApiErrorException(
          loginRequiredError(error),
          error.response.status
        );
      }
      case 403: {
        throw new ApiErrorException(
          accessDeniedError(error),
          error.response.status
        );
      }
      default:
        throw new ApiErrorException(generalError(error), error.response.status);
    }
  } else if (error.request) {
    throw new ApiErrorException(networkError(error));
  } else {
    throw new ApiErrorException(generalError(error));
  }
}

export const get = <ResponseData>(
  url: string,
  personIdent?: string
): Promise<ResponseData> => {
  return axios
    .get(url, {
      headers: defaultRequestHeaders(personIdent),
    })
    .then((response) => response.data)
    .catch(function (error) {
      if (axios.isAxiosError(error)) {
        handleAxiosError(error);
      } else {
        throw new ApiErrorException(generalError(error), error.code);
      }
    });
};

export const post = <ResponseData>(
  url: string,
  data: Record<string, any>,
  personIdent?: string
): Promise<ResponseData> => {
  return axios
    .post(url, data, {
      headers: defaultRequestHeaders(personIdent),
    })
    .then((response) => response.data)
    .catch(function (error) {
      if (axios.isAxiosError(error)) {
        handleAxiosError(error);
      } else {
        throw new ApiErrorException(generalError(error), error.code);
      }
    });
};
