export const NAV_CONSUMER_ID_HEADER = 'nav-consumer-id';
export const NAV_CONSUMER_ID = 'syfooversikt';

const log = (...data: unknown[]): void => {
  if (
    window.location.search.indexOf('log=true') > -1 ||
    process.env.NODE_ENV === 'development'
  ) {
    console.log(data);
  }
};

export const lagreRedirectUrlILocalStorage = (href: string): void => {
  localStorage.setItem('redirecturl', href);
};

export function get(url: string): Promise<any> {
  const headers = {
    [NAV_CONSUMER_ID_HEADER]: NAV_CONSUMER_ID,
  };
  return fetch(url, {
    credentials: 'include',
    headers,
  })
    .then((res) => {
      if (res.status === 401) {
        log(res, 'Redirect til login');
        lagreRedirectUrlILocalStorage(window.location.href);
        window.location.href = `/login?redirectTo=${window.location.pathname}`;
      } else if (res.status === 403) {
        window.location.href = `/na`;
      } else if (res.status > 400) {
        log(res);
        throw new Error('Forespørsel feilet');
      } else if (res.status === 204) {
        return [];
      }
      return res.json();
    })
    .catch((err) => {
      log(err);
      throw err;
    });
}

export function post(url: string, body: Record<string, any>): Promise<any> {
  return fetch(url, {
    credentials: 'include',
    method: 'POST',
    body: JSON.stringify(body),
    headers: new Headers({
      'Content-Type': 'application/json',
    }),
  })
    .then((res) => {
      if (res.status === 401) {
        log(res, 'Redirect til login');
        lagreRedirectUrlILocalStorage(window.location.href);
        window.location.href = `/login?redirectTo=${window.location.pathname}`;
        return null;
      } else if (res.status === 403) {
        window.location.href = `/na`;
      } else if (res.status > 400) {
        log(res);
        throw new Error('Forespørsel feilet');
      } else {
        const contentType = res.headers.get('Content-Type') || '';
        if (contentType.includes('json')) {
          return res.json();
        }
        return res;
      }
    })
    .catch((err) => {
      log(err);
      throw err;
    });
}
