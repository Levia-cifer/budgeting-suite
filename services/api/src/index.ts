import Fastify from 'fastify';
import cors from 'fastify-cors';
import plaidRoutes from './routes/plaid';
import usersRoutes from './routes/users';

const server = Fastify({ logger: true });
server.register(cors, { origin: true });

server.get('/health', async (req, res) => ({ status: 'ok' }));
server.register(plaidRoutes, { prefix: '/plaid' });
server.register(usersRoutes, { prefix: '/users' });

const port = Number(process.env.PORT) || 4000;
server.listen({ port, host: '0.0.0.0' }).then(() => server.log.info(`Server listening on ${port}`));
