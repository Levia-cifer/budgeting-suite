import Fastify from 'fastify';
import cors from 'fastify-cors';
import plaidRoutes from './routes/plaid';
import usersRoutes from './routes/users';
import authRoutes from './routes/auth';
import FastifyJwt from 'fastify-jwt';

const server = Fastify({ logger: true });
server.register(cors, { origin: true });

server.register(FastifyJwt, { secret: process.env.JWT_SECRET || 'dev-secret' });

server.get('/health', async (req, res) => ({ status: 'ok' }));
server.register(plaidRoutes, { prefix: '/plaid' });
server.register(usersRoutes, { prefix: '/users' });
server.register(authRoutes, { prefix: '/auth' });
import budgetsRoutes from './routes/budgets';
import transactionsRoutes from './routes/transactions';
import { simpleForecast } from './lib/forecast';

server.register(budgetsRoutes, { prefix: '/budgets' });
server.register(transactionsRoutes, { prefix: '/transactions' });

server.get('/forecast', async (req, res) => {
  const txRes = await server.inject({ method: 'GET', url: '/transactions' });
  const transactions = JSON.parse(txRes.payload || '[]');
  return simpleForecast(transactions, 6);
});

// Private routes (require auth)
import privateRoutes from './routes/private';
server.register(privateRoutes, { prefix: '/private' });

// Basic health endpoint for all services
server.get('/status', async () => ({ ok: true, time: new Date().toISOString() }));

const port = Number(process.env.PORT) || 4000;
server.listen({ port, host: '0.0.0.0' }).then(() => server.log.info(`Server listening on ${port}`));
