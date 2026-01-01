import { FastifyPluginAsync } from 'fastify';

const plaidRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.post('/create_link_token', async (request, reply) => {
    // TODO: Replace with Plaid API call. For now return a sandbox stub used for local dev.
    return { link_token: 'test-link-token', environment: process.env.PLAID_ENV || 'sandbox' };
  });

  fastify.post('/exchange_public_token', async (request, reply) => {
    const body = request.body as any;
    const public_token = body?.public_token;
    if (!public_token) return reply.status(400).send({ error: 'public_token required' });
    // TODO: Exchange public_token with Plaid for access_token and store securely
    return { access_token: 'access-sandbox-token', item_id: 'sandbox-item-id' };
  });
};

export default plaidRoutes;
