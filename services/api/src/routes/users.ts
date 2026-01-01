import { FastifyPluginAsync } from 'fastify';
import { promises as fs } from 'fs';
import { join } from 'path';
import { randomUUID } from 'crypto';

const DATA_FILE = join(__dirname, '..', 'data', 'users.json');

async function readData() {
  try {
    const raw = await fs.readFile(DATA_FILE, 'utf-8');
    return JSON.parse(raw || '{}');
  } catch (err) {
    await fs.writeFile(DATA_FILE, JSON.stringify({}), 'utf-8');
    return {};
  }
}

async function writeData(data: any) {
  await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
}

const usersRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.get('/', async (request, reply) => {
    const data = await readData();
    return Object.values(data);
  });

  fastify.get('/:id', async (request, reply) => {
    const data = await readData();
    const id = (request.params as any).id;
    const user = data[id];
    if (!user) return reply.status(404).send({ error: 'not_found' });
    return user;
  });

  fastify.post('/', async (request, reply) => {
    const body = request.body as any;
    if (!body?.name) return reply.status(400).send({ error: 'name_required' });
    const id = randomUUID();
    const user = { id, name: body.name, email: body.email || '', settings: body.settings || {} };
    const data = await readData();
    data[id] = user;
    await writeData(data);
    return user;
  });

  fastify.put('/:id', async (request, reply) => {
    const id = (request.params as any).id;
    const body = request.body as any;
    const data = await readData();
    const existing = data[id];
    if (!existing) return reply.status(404).send({ error: 'not_found' });
    const updated = { ...existing, ...body };
    data[id] = updated;
    await writeData(data);
    return updated;
  });
};

export default usersRoutes;
