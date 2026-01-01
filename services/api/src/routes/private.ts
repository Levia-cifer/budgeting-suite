import { FastifyPluginAsync } from 'fastify';
import prisma from '../lib/prisma';

const priv: FastifyPluginAsync = async (fastify) => {
  fastify.get('/plaid_items', async (request, reply) => {
    try {
      await request.jwtVerify();
      const payload = request.user as any;
      const items = await prisma.plaidItem.findMany({ where: { userId: payload.userId } });
      return items;
    } catch (err) {
      return reply.status(401).send({ error: 'not_authorized' });
    }
  });
};

export default priv;
