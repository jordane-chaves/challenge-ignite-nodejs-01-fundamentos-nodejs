import http from 'node:http';

import { json } from './middlewares/json.js';
import { routes } from './routes.js';
import { extractQueryParams } from './utils/extract-query-params.js';

const server = http.createServer(async (request, response) => {
  const { method, url } = request;

  await json(request, response);

  const route = routes.find(route => {
    return route.method === method && route.path.test(url);
  });

  if (route) {
    const routeParams = url.match(route.path);
    const { query, ...params } = routeParams.groups;

    request.params = params;
    request.query = query ? extractQueryParams(query) : {};

    try {
      return route.handler(request, response);
    } catch (error) {
      return response.writeHead(400).end(JSON.stringify({
        message: error.message,
      }));
    }
  }

  return response.writeHead(404).end();
});

server.listen(3333);
