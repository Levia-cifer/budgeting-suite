import { FastifyPluginAsync } from 'fastify';
import { promises as fs } from 'fs';
import { join } from 'path';
import { randomUUID } from 'crypto';

const STORE = join(__dirname, '..', 'data', 'budgets.json');

async function readStore() {
  try { const raw = await fs.readFile(STORE, 'utf-8'); return JSON.parse(raw || '{}'); } catch (e) { await fs.writeFile(STORE, JSON.stringify({}), 'utf-8'); return {}; }
}
async function writeStore(data: any) { await fs.writeFile(STORE, JSON.stringify(data, null, 2), 'utf-8'); }

const budgets: FastifyPluginAsync = async (fastify) => {
  fastify.get('/', async () => {
    const s = await readStore();
    return Object.values(s);
  });

  fastify.post('/', async (request, reply) => {
    const body = request.body as any;
    if (!body?.name || typeof body?.limit !== 'number') return reply.status(400).send({ error: 'name_and_limit_required' });
    const id = randomUUID();
    const obj = { id, name: body.name, limit: body.limit, category: body.category || 'general', recurring: !!body.recurring };
    const s = await readStore();
    s[id] = obj;
    await writeStore(s);
    return obj;
  });

  fastify.put('/:id', async (request, reply) => {
    const id = (request.params as any).id;
    const body = request.body as any;
    const s = await readStore();
    const ex = s[id];
    if (!ex) return reply.status(404).send({ error: 'not_found' });
    const updated = { ...ex, ...body };
    s[id] = updated;
    await writeStore(s);
    return updated;
  });

  fastify.delete('/:id', async (request, reply) => {
    const id = (request.params as any).id;
    const s = await readStore();
    delete s[id];
    await writeStore(s);
    return { ok: true };
  });
};

export default budgets;
