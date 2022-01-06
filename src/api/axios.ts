import axios, { AxiosError, AxiosRequestHeaders } from 'axios';
import {
  accessDeniedError,
  ApiErrorException,
  generalError,
  loginRequiredError,
  networkError,
} from './errors';
import { generateUUID } from '@/utils/uuidUtils';

export const NAV_CALL_ID_HEADER = 'Nav-Call-Id';
export const NAV_CONSUMER_ID_HEADER = 'Nav-Consumer-Id';
export const NAV_CONSUMER_ID = 'syfooversikt';
export const NAV_PERSONIDENT_HEADER = 'nav-personident';

export const defaultRequestHeaders = (
  personIdent?: string
): AxiosRequestHeaders => {
  const headers: AxiosRequestHeaders = {
    'Content-Type': 'application/json',
    [NAV_CONSUMER_ID_HEADER]: NAV_CONSUMER_ID,
    [NAV_CALL_ID_HEADER]: `${NAV_CONSUMER_ID}-${generateUUID()}`,
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
  data: Record<string, unknown> | Record<string, unknown>[],
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
