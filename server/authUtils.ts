import { Request } from 'express';
import { auth } from './config';

interface TokenIntrospectionResponse {
  active: boolean;
  // see texas documentation for more fields: https://doc.nais.io/auth/entra-id/how-to/secure/#success-response
}

interface TokenExchangeResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
}

function extractBearerToken(req: Request): string | undefined {
  return req.headers.authorization?.replace('Bearer ', '');
}

export async function validateToken(req: Request): Promise<boolean> {
  const token = extractBearerToken(req);
  if (!token) return false;

  const response = await fetch(auth.texas.introspectionEndpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ identity_provider: 'entra_id', token }),
  });

  if (!response.ok) {
    console.error(`Token introspection failed: ${response.status}`);
    return false;
  }

  const data = (await response.json()) as TokenIntrospectionResponse;
  return data.active;
}

export async function getOnBehalfOfToken(
  req: Request,
  target: string
): Promise<string | undefined> {
  const userToken = extractBearerToken(req);
  if (!userToken) return undefined;

  const response = await fetch(auth.texas.tokenExchangeEndpoint, {
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

  const data = (await response.json()) as TokenExchangeResponse;
  return data.access_token;
}
