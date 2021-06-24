const fp = require('fastify-plugin');
const knex = require('knex');
const objection = require('objection');

const { ERR_MISSING_REQUIRED, ERR_INVALID_PROPERTY } = require('./errors');

module.exports = fp(
  (instance, options, next) => {
    if (!options.connection || !options.models) {
      next(new Error(ERR_MISSING_REQUIRED));
    }

    if (!Array.isArray(options.models) || !options.models.length) {
      next(new Error(ERR_INVALID_PROPERTY));
    }

    const connection = knex({
      client: 'pg',
      connection: options.connection,
      ...objection.knexSnakeCaseMappers(),
    });

    const models = {};

    objection.Model.knex(connection);

    options.models.forEach((model) => {
      models[model.name] = model;
    });

    instance.decorate('models', models);
    instance.decorate('knex', connection);

    instance.addHook('onClose', (_, done) => {
      connection.destroy();
      done();
    });

    next();
  },
  {
    fastify: '>=2.0.0',
    name: 'fastify-objection',
  },
);
