import { FastifyPluginCallback, FastifyPluginAsync } from 'fastify'
import { Model } from 'objection'

declare namespace fastifyObjection {
  interface FastifyObjectionObject {
    connection: string
    models: Model[]
  }

  interface FastifyObjectionOptions {
    connection?: string
    models?: Model[]
  }
}

declare module 'fastify' {
  interface FastifyInstance {
    objection: fastifyObjection.FastifyObjectionObject
  }
}

declare const fastifyObjection: FastifyPluginCallback<fastifyObjection.FastifyObjectionOptions> | FastifyPluginAsync<fastifyObjection.FastifyObjectionOptions>

export default fastifyObjection