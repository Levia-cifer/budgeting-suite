import { FastifyPluginAsync } from 'fastify';
import prisma from '../lib/prisma';

const tx: FastifyPluginAsync = async (fastify) => {
  // require auth for all transaction routes
  fastify.addHook('preHandler', async (request, reply) => {
    try { await request.jwtVerify(); } catch (err) { return reply.status(401).send({ error: 'not_authorized' }); }
  });

  fastify.get('/', async (request, reply) => {
    const payload = request.user as any;
    const items = await prisma.transaction.findMany({ where: { userId: payload.userId }, orderBy: { date: 'desc' } });
    return items;
  });

  fastify.post('/', async (request, reply) => {
    const body = request.body as any;
    if (typeof body?.amount !== 'number' || !body?.date) return reply.status(400).send({ error: 'amount_and_date_required' });
    const payload = request.user as any;
    const created = await prisma.transaction.create({ data: { amount: body.amount, date: body.date, name: body.name || '', category: body.category || 'uncategorized', userId: payload.userId } });
    return created;
  });

  fastify.post('/import_csv', async (request, reply) => {
    const body = request.body as any;
    const csv = body?.csv;
    if (!csv) return reply.status(400).send({ error: 'csv_required' });
    const lines = (csv as string).split('\n').map(l => l.trim()).filter(Boolean);
    const added: any[] = [];
    const payload = request.user as any;
    for (const ln of lines) {
      const [date, amountStr, name, category] = ln.split(',').map(x => x?.trim());
      const amount = Number(amountStr);
      if (isNaN(amount)) continue;
      const obj = await prisma.transaction.create({ data: { amount, date, name: name||'', category: category||'uncategorized', userId: payload.userId } });
      added.push(obj);
    }
    return { added };
  });

  fastify.delete('/:id', async (request, reply) => {
    const id = (request.params as any).id;
    const payload = request.user as any;
    const existing = await prisma.transaction.findUnique({ where: { id } });
    if (!existing || existing.userId !== payload.userId) return reply.status(404).send({ error: 'not_found' });
    await prisma.transaction.delete({ where: { id } });
    return { ok: true };
  });
};

export default tx;
