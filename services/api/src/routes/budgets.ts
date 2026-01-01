import { FastifyPluginAsync } from 'fastify';
import prisma from '../lib/prisma';

const budgets: FastifyPluginAsync = async (fastify) => {
  // require auth for budgets
  fastify.addHook('preHandler', async (request, reply) => {
    try { await request.jwtVerify(); } catch (err) { return reply.status(401).send({ error: 'not_authorized' }); }
  });

  fastify.get('/', async (request, reply) => {
    const payload = request.user as any;
    return await prisma.budget.findMany({ where: { userId: payload.userId }, orderBy: { createdAt: 'desc' } });
  });

  fastify.post('/', async (request, reply) => {
    const body = request.body as any;
    if (!body?.name || typeof body?.limit !== 'number') return reply.status(400).send({ error: 'name_and_limit_required' });
    const payload = request.user as any;
    const created = await prisma.budget.create({ data: { name: body.name, limit: body.limit, category: body.category || 'general', recurring: !!body.recurring, userId: payload.userId } });
    return created;
  });

  fastify.put('/:id', async (request, reply) => {
    const id = (request.params as any).id;
    const body = request.body as any;
    const payload = request.user as any;
    const ex = await prisma.budget.findUnique({ where: { id } });
    if (!ex || ex.userId !== payload.userId) return reply.status(404).send({ error: 'not_found' });
    const updated = await prisma.budget.update({ where: { id }, data: { ...body } });
    return updated;
  });

  fastify.delete('/:id', async (request, reply) => {
    const id = (request.params as any).id;
    const payload = request.user as any;
    const ex = await prisma.budget.findUnique({ where: { id } });
    if (!ex || ex.userId !== payload.userId) return reply.status(404).send({ error: 'not_found' });
    await prisma.budget.delete({ where: { id } });
    return { ok: true };
  });
};

export default budgets;
