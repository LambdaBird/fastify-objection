const fastify = require('fastify')();

const plugin = require('../plugin');
const { ERR_MISSING_REQUIRED, ERR_INVALID_PROPERTY } = require('../errors');

describe('Plugin registration testing:', () => {
  test('should throw an error if no connection string provided', () => {
    fastify.register(plugin, {
      models: [],
    });

    fastify.after((err) => {
      expect(err).toEqual(new Error(ERR_MISSING_REQUIRED));
    });
  });

  test('should throw an error if no models provided', () => {
    fastify.register(plugin, {
      connection: 'DB_CONNECTION',
    });

    fastify.after((err) => {
      expect(err).toEqual(new Error(ERR_MISSING_REQUIRED));
    });
  });

  test('should throw an error if models is not an array', () => {
    fastify.register(plugin, {
      connection: 'DB_CONNECTION',
      models: 'model',
    });

    fastify.after((err) => {
      expect(err).toEqual(new Error(ERR_INVALID_PROPERTY));
    });
  });

  test('should throw an error if models array is empty', () => {
    fastify.register(plugin, {
      connection: 'DB_CONNECTION',
      models: [],
    });

    fastify.after((err) => {
      expect(err).toEqual(new Error(ERR_INVALID_PROPERTY));
    });
  });
});
