# fastify-objection

Objection.js plugin for Fastify with PostgreSQL support

## Requirements 

Node.js v10 or later

## Installation

```
npm i fastify-objection
```

## Usage

Define a model:
```js
// User.js
import objection from 'objection';

export default class extends objection.model {
  static get tableName() {
    return 'users';
  }
}
```

Register the fastify-objection plugin:
```js
// app.js
import fastify from 'fastify';
import dbPlugin from 'fastify-objection';

import User from 'User';
import userService from 'userService';

export default (options = {}) => {
  const app = fastify(options);
  
  app.register(dbPlugin, {
    connection: process.env.DATABASE_URL,
    models: [User],
  });
  
   app.register(userService);
  
  return app;
};
```

Make a query:
```js
// userService.js
export default async (instance) => {
  const { User } = instance.models;

  instance.route({
    method: 'GET',
    url: '/:userId',
    handler: async ({ params: { userId } }) => {
      const user = await User.query().findById(userId);
      
      return { user };
    },
  });
};
```
