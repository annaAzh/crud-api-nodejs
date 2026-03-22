import fastify, { type FastifyError, type FastifyReply, type FastifyRequest } from 'fastify'
import { loadEnvFile } from 'node:process'
import {
  serializerCompiler,
  validatorCompiler,
  type ZodTypeProvider
} from 'fastify-type-provider-zod'
import productRoutes from './module/product.routes.ts'

loadEnvFile()

const server = fastify().withTypeProvider<ZodTypeProvider>()

server.setValidatorCompiler(validatorCompiler)
server.setSerializerCompiler(serializerCompiler)

server.setErrorHandler((error: FastifyError, request: FastifyRequest, reply: FastifyReply) => {
  request.log.error(error)

  if (error.statusCode && error.statusCode >= 500) {
    return reply.code(500).send({
      error: 'Internal_server_error',
      message: 'Something went wrong'
    })
  } else if (error.validation) {
    return reply.code(400).send({ error: 'Validation_error', message: error.message })
  } else {
    return reply
      .code(error.statusCode ?? 400)
      .send({ error: error.code || 'Bad_request', message: error.message })
  }
})

server.register(productRoutes, { prefix: '/api' })

server.listen({ port: Number(process.env['PORT']) || 8080 }, (err, address) => {
  if (err) {
    console.error(err)
    process.exit(1)
  }
  console.log(`Server listening at ${address}`)
})
