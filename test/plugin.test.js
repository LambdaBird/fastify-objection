const test = require('tap').test;
const Fastify = require('fastify');
const objection = require('objection');

const plugin = require('../plugin');
const { ERR_MISSING_REQUIRED, ERR_INVALID_PROPERTY } = require('../errors');

test('Plugin registration', (t) => {
  t.plan(4);

  t.test('with missing "connection" and "models"', (t) => {
    t.plan(1);

    const fastify = Fastify();

    fastify.register(plugin, {}).ready((error) => {
      t.equal(error.message, ERR_MISSING_REQUIRED);
    });
  });

  t.test('with missing "models"', (t) => {
    t.plan(1);

    const fastify = Fastify();

    fastify
      .register(plugin, {
        connection: 'connection_string',
      })
      .ready((error) => {
        t.equal(error.message, ERR_MISSING_REQUIRED);
      });
  });

  t.test('with "models" invalid type', (t) => {
    t.plan(1);

    const fastify = Fastify();

    fastify
      .register(plugin, {
        connection: 'connection_string',
        models: 'model',
      })
      .ready((error) => {
        t.equal(error.message, ERR_INVALID_PROPERTY);
      });
  });

  t.test('with right properties', (t) => {
    t.plan(2);

    const fastify = Fastify();

    class User extends objection.Model {}

    fastify
      .register(plugin, {
        connection: 'connection_string',
        models: [User],
      })
      .ready(() => {
        t.ok(fastify.knex);
        t.ok(fastify.models);
      });
  });
});
