import { FastifyPluginAsync } from 'fastify';
import { createLinkToken, exchangePublicToken } from '../lib/plaidClient';
import { promises as fs } from 'fs';
import { join } from 'path';

const PLAID_STORE = join(__dirname, '..', 'data', 'plaid.json');

async function readStore() {
  try { const raw = await fs.readFile(PLAID_STORE, 'utf-8'); return JSON.parse(raw || '{}'); } catch (e) { await fs.writeFile(PLAID_STORE, JSON.stringify({}), 'utf-8'); return {}; }
}

async function writeStore(data: any) { await fs.writeFile(PLAID_STORE, JSON.stringify(data, null, 2), 'utf-8'); }

const plaidRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.post('/create_link_token', async (request, reply) => {
    try {
      const token = await createLinkToken();
      return token;
    } catch (err) {
      fastify.log.error(err);
      return reply.status(500).send({ error: 'link_token_error' });
    }
  });

  fastify.post('/exchange_public_token', async (request, reply) => {
    try {
      await request.jwtVerify();
    } catch (err) {
      return reply.status(401).send({ error: 'not_authorized' });
    }
    const body = request.body as any;
    const public_token = body?.public_token;
    if (!public_token) return reply.status(400).send({ error: 'public_token required' });
    try {
      const res = await exchangePublicToken(public_token);
      const payload = (request.user as any) || {};
      const userId = payload.userId;
      // save to DB
      const prisma = require('../lib/prisma').default;
      await prisma.plaidItem.create({ data: { itemId: res.item_id, accessToken: res.access_token, userId, institutionName: body?.institution_name || null } });
      const store = await readStore();
      store[res.item_id] = res;
      await writeStore(store);
      return res;
    } catch (err) {
      fastify.log.error(err);
      return reply.status(500).send({ error: 'exchange_failed' });
    }
  });

  fastify.get('/items', async (request, reply) => {
    const store = await readStore();
    return store;
  });
};

export default plaidRoutes;
