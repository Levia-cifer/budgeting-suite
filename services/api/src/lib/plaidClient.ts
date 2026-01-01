import { Configuration, PlaidApi, PlaidEnvironments } from '@plaid/plaid';

let client: PlaidApi | null = null;
const clientId = process.env.PLAID_CLIENT_ID;
const secret = process.env.PLAID_SECRET;
const env = (process.env.PLAID_ENV || 'sandbox') as keyof typeof PlaidEnvironments;

if (clientId && secret) {
  const config = new Configuration({ basePath: PlaidEnvironments[env], baseOptions: { headers: { 'PLAID-CLIENT-ID': clientId, 'PLAID-SECRET': secret } } });
  client = new PlaidApi(config);
}

export async function createLinkToken() {
  if (!client) return { link_token: 'test-link-token', environment: 'sandbox' };
  const res = await client.linkTokenCreate({
    user: { client_user_id: `user-${Date.now()}` },
    client_name: 'Budgeting Suite',
    products: ['transactions'],
    language: 'en',
    country_codes: ['US'],
  });
  return { link_token: res.data.link_token, environment: env };
}

export async function exchangePublicToken(public_token: string) {
  if (!client) return { access_token: 'access-sandbox-token', item_id: 'sandbox-item-id' };
  const res = await client.itemPublicTokenExchange({ public_token });
  const access_token = res.data.access_token;
  const item_id = res.data.item_id;
  return { access_token, item_id };
}
