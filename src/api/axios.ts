import axios, { AxiosError } from 'axios';
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

export function defaultRequestHeaders(
  personident?: string
): Record<string, string> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    [NAV_CONSUMER_ID_HEADER]: NAV_CONSUMER_ID,
    [NAV_CALL_ID_HEADER]: `${NAV_CONSUMER_ID}-${generateUUID()}`,
  };

  if (personident) {
    headers[NAV_PERSONIDENT_HEADER] = personident;
  }
  return headers;
}

function handleAxiosError(error: AxiosError) {
  if (error.response) {
    switch (error.response.status) {
      case 401: {
        window.location.href = `/oauth2/login?redirectTo=${window.location.pathname}`;
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
  personident?: string
): Promise<ResponseData> => {
  return axios
    .get(url, {
      headers: defaultRequestHeaders(personident),
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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: Record<string, any> | Record<string, any>[],
  personident?: string
): Promise<ResponseData> => {
  return axios
    .post(url, data, {
      headers: defaultRequestHeaders(personident),
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
