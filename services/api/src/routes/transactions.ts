import { FastifyPluginAsync } from 'fastify';
import { promises as fs } from 'fs';
import { join } from 'path';
import { randomUUID } from 'crypto';

const STORE = join(__dirname, '..', 'data', 'transactions.json');

async function readStore() {
  try { const raw = await fs.readFile(STORE, 'utf-8'); return JSON.parse(raw || '{}'); } catch (e) { await fs.writeFile(STORE, JSON.stringify({}), 'utf-8'); return {}; }
}
async function writeStore(data: any) { await fs.writeFile(STORE, JSON.stringify(data, null, 2), 'utf-8'); }

const tx: FastifyPluginAsync = async (fastify) => {
  fastify.get('/', async () => {
    const s = await readStore();
    return Object.values(s);
  });

  fastify.post('/', async (request, reply) => {
    const body = request.body as any;
    if (typeof body?.amount !== 'number' || !body?.date) return reply.status(400).send({ error: 'amount_and_date_required' });
    const id = randomUUID();
    const obj = { id, amount: body.amount, date: body.date, name: body.name || '', category: body.category || 'uncategorized' };
    const s = await readStore();
    s[id] = obj;
    await writeStore(s);
    return obj;
  });

  fastify.post('/import_csv', async (request, reply) => {
    // accept raw CSV in body for simple import: date,amount,name,category
    const body = request.body as any;
    const csv = body?.csv;
    if (!csv) return reply.status(400).send({ error: 'csv_required' });
    const lines = (csv as string).split('\n').map(l => l.trim()).filter(Boolean);
    const added: any[] = [];
    const s = await readStore();
    for (const ln of lines) {
      const [date, amountStr, name, category] = ln.split(',').map(x => x?.trim());
      const amount = Number(amountStr);
      if (isNaN(amount)) continue;
      const id = randomUUID();
      const obj = { id, amount, date, name: name||'', category: category||'uncategorized' };
      s[id] = obj;
      added.push(obj);
    }
    await writeStore(s);
    return { added };
  });

  fastify.delete('/:id', async (request, reply) => {
    const id = (request.params as any).id;
    const s = await readStore();
    delete s[id];
    await writeStore(s);
    return { ok: true };
  });
};

export default tx;
