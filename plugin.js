const fp = require('fastify-plugin');
const knex = require('knex');
const objection = require('objection');

const { ERR_MISSING_REQUIRED, ERR_INVALID_PROPERTY } = require('./errors');

const plugin = (instance, options, next) => {
  if (!options.connection || !options.models) {
    return next(new Error(ERR_MISSING_REQUIRED));
  }

  if (!Array.isArray(options.models) || !options.models.length) {
    return next(new Error(ERR_INVALID_PROPERTY));
  }

  const connection = knex({
    client: 'pg',
    connection: options.connection,
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

  return next();
};

module.exports = fp(plugin, {
  fastify: '>=2.0.0',
  name: 'fastify-objection',
});
