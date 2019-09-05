import { erProd } from '../utils/miljoUtil';

const getCookie = (name: string) => {
    const re = new RegExp(`${name}=([^;]+)`);
    const match = re.exec(document.cookie);
    return match !== null ? match[1] : '';
};

const createLogger = () => {
    if (window.location.search.indexOf('log=true') > -1 || (process.env.NODE_ENV === 'development')) {
        // tslint:disable-next-line
        return console.log;
    }
    // tslint:disable-next-line
    return () => {};
};

const log = createLogger();

export const hentLoginUrl = () => {
    if (erProd()) {
        return 'https://loginservice.nais.adeo.no/login';
    }
    // Preprod
    return 'https://loginservice.nais.preprod.local/login';
};

export const hentRedirectBaseUrl = (windowLocationHref: string) => {
    if (erProd()) {
        return 'https://syfooversikt.nais.adeo.no';
    }
    return 'https://syfooversikt.nais.preprod.local';

};

export const lagreRedirectUrlILocalStorage = (href: string) => {
    localStorage.setItem('redirecturl', href);
};

export function get(url: string) {
    return fetch(url, {
        credentials: 'include',
    })
        .then((res) => {
            if (res.status === 401) {
                log(res, 'Redirect til login');
                lagreRedirectUrlILocalStorage(window.location.href);
                window.location.href = `${hentLoginUrl()}?redirect=${hentRedirectBaseUrl(window.location.href)}`;
            } else if (res.status === 403) {
                window.location.href = `/na`;
            } else if (res.status > 400) {
                log(res);
                throw new Error('Forespørsel feilet');
            } else if(res.status === 204) {
                return [];
            }
            return res.json();
        })
        .catch((err) => {
            log(err);
            throw err;
        });
}

export function post(url: string, body: object) {
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
                window.location.href = `${hentLoginUrl()}?redirect=${hentRedirectBaseUrl(window.location.href)}`;
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

export function getWithoutThrows(url: string) {
    return fetch(url, {
        credentials: 'include',
    })
        .then((res) => {
            return res.json();
        })
        .catch((err) => {
            log(err);
            throw err;
        });
}
