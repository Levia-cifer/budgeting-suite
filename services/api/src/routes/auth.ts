import { FastifyPluginAsync } from 'fastify';
import bcrypt from 'bcrypt';
import prisma from '../lib/prisma';

const auth: FastifyPluginAsync = async (fastify) => {
  fastify.post('/register', async (request, reply) => {
    const body = request.body as any;
    if (!body?.email || !body?.password) return reply.status(400).send({ error: 'email_and_password_required' });
    const existing = await prisma.user.findUnique({ where: { email: body.email } });
    if (existing) return reply.status(400).send({ error: 'email_taken' });
    const hash = await bcrypt.hash(body.password, 10);
    const user = await prisma.user.create({ data: { email: body.email, name: body.name || null, passwordHash: hash } });
    const token = fastify.jwt.sign({ userId: user.id });
    return { token, user: { id: user.id, email: user.email, name: user.name } };
  });

  fastify.post('/login', async (request, reply) => {
    const body = request.body as any;
    if (!body?.email || !body?.password) return reply.status(400).send({ error: 'email_and_password_required' });
    const user = await prisma.user.findUnique({ where: { email: body.email } });
    if (!user || !user.passwordHash) return reply.status(400).send({ error: 'invalid_credentials' });
    const ok = await bcrypt.compare(body.password, user.passwordHash);
    if (!ok) return reply.status(400).send({ error: 'invalid_credentials' });
    const token = fastify.jwt.sign({ userId: user.id });
    return { token, user: { id: user.id, email: user.email, name: user.name } };
  });

  fastify.get('/me', async (request, reply) => {
    try {
      await request.jwtVerify();
      const payload = request.user as any;
      const user = await prisma.user.findUnique({ where: { id: payload.userId } });
      if (!user) return reply.status(404).send({ error: 'not_found' });
      return { id: user.id, email: user.email, name: user.name };
    } catch (err) {
      return reply.status(401).send({ error: 'not_authorized' });
    }
  });
};

export default auth;
