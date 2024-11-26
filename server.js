import jsonServer from 'json-server';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
console.log(__dirname)
const server = jsonServer.create();
const router = jsonServer.router('server/db.json');
const middlewares = jsonServer.defaults();

server.use(middlewares);

server.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    next();
});

server.use(jsonServer.rewriter({
    '/api/*': '/$1'
}));

server.use(router);

const port = 3000;
server.listen(port, () => {
    console.log(`JSON Server is running on port ${port}`);
    console.log(`Access the API at http://localhost:${port}/api/timeline`);
});