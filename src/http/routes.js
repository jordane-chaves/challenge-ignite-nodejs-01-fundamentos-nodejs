import { randomUUID } from 'node:crypto';

import { Database } from '../database/database.js';
import { buildRoutePath } from './utils/build-route-path.js';

const database = new Database();

export const routes = [
  {
    method: 'GET',
    path: buildRoutePath('/tasks'),
    handler: (request, response) => {
      const { search } = request.query;

      const searchData = search && {
        title: search,
        description: search,
      };

      const tasks = database.select('tasks', searchData);

      return response.end(JSON.stringify(tasks));
    }
  },
  {
    method: 'POST',
    path: buildRoutePath('/tasks'),
    handler: (request, response) => {
      if (!request.body) {
        throw new Error('The body cannot be empty.');
      }

      const { title, description } = request.body;

      if (!title) {
        throw new Error('Title is required!');
      }

      if (!description) {
        throw new Error('Description is required!');
      }

      const task = {
        id: randomUUID(),
        title,
        description,
        completed_at: null,
        created_at: new Date(),
        updated_at: new Date(),
      };

      database.insert('tasks', task);

      return response.writeHead(201).end();
    }
  },
  {
    method: 'PUT',
    path: buildRoutePath('/tasks/:id'),
    handler: (request, response) => {
      if (!request.body) {
        throw new Error('The body cannot be empty.');
      }

      const { id } = request.params;
      const { title, description } = request.body;

      if (!title && !description) {
        throw new Error('No data has been sent to be updated!');
      }

      const task = database.findOne('tasks', id);

      if (!task) {
        throw new Error('Task not found!');
      }

      task.title = title ?? task.title;
      task.description = description ?? task.description;
      task.updated_at = new Date();

      database.update('tasks', task.id, task);

      return response.writeHead(204).end();
    }
  },
  {
    method: 'PATCH',
    path: buildRoutePath('/tasks/:id'),
    handler: (request, response) => {
      const { id } = request.params;

      const task = database.find('tasks', id);

      if (!task) {
        throw new Error('Task not found!');
      }

      task.completed_at = task.completed_at ? null : new Date();
      task.updated_at = new Date();

      database.update('tasks', task.id, task);

      return response.writeHead(204).end();
    }
  },
  {
    method: 'DELETE',
    path: buildRoutePath('/tasks/:id'),
    handler: (request, response) => {
      const { id } = request.params;

      const task = database.find('tasks', id);

      if (!task) {
        throw new Error('Task not found!');
      }

      database.delete('tasks', task.id);

      return response.writeHead(204).end();
    }
  }
];
