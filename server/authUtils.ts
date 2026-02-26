import { Request } from 'express';

const introspectionEndpoint = () =>
  process.env.NAIS_TOKEN_INTROSPECTION_ENDPOINT ?? '';
const tokenExchangeEndpoint = () =>
  process.env.NAIS_TOKEN_EXCHANGE_ENDPOINT ?? '';

const extractBearerToken = (req: Request): string | undefined =>
  req.headers.authorization?.replace('Bearer ', '');

export const validateToken = async (req: Request): Promise<boolean> => {
  const token = extractBearerToken(req);
  if (!token) return false;

  const response = await fetch(introspectionEndpoint(), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ identity_provider: 'entra_id', token }),
  });

  if (!response.ok) {
    console.error(`Token introspection failed: ${response.status}`);
    return false;
  }

  const data = await response.json();
  return data.active === true;
};

export const getOnBehalfOfToken = async (
  req: Request,
  target: string
): Promise<string | undefined> => {
  const userToken = extractBearerToken(req);
  if (!userToken) return undefined;

  const response = await fetch(tokenExchangeEndpoint(), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      identity_provider: 'entra_id',
      target,
      user_token: userToken,
    }),
  });

  if (!response.ok) {
    console.error(`Token exchange failed: ${response.status}`);
    return undefined;
  }

  const data = await response.json();
  return data.access_token;
};
