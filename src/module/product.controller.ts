import type { FastifyReply, FastifyRequest } from 'fastify'
import { productService } from './product.service.ts'
import type { ProductBody, ProductParams } from '../schemas/index.ts'

const productServiceInstance = productService()

export const getProducts = (_request: FastifyRequest, reply: FastifyReply) => {
  const products = productServiceInstance.findAll()

  return reply.code(200).send(products)
}

export const getOneProduct = (
  request: FastifyRequest<{ Params: ProductParams }>,
  reply: FastifyReply
) => {
  const { id } = request.params
  const product = productServiceInstance.findOne(id)
  if (!product) {
    return reply.code(404).send({ message: 'Product not found' })
  }
  return reply.code(200).send(product)
}

export const addProduct = (request: FastifyRequest<{ Body: ProductBody }>, reply: FastifyReply) => {
  const product = productServiceInstance.createProduct(request.body)
  return reply.code(201).send(product)
}

export const updateProduct = (
  request: FastifyRequest<{
    Params: ProductParams
    Body: ProductBody
  }>,
  reply: FastifyReply
) => {
  const { id } = request.params
  const data = request.body
  const updatedProduct = productServiceInstance.updateProduct(id, data)

  if (!updatedProduct) {
    return reply.code(404).send({ message: 'Product not found' })
  }

  return reply.code(200).send(updatedProduct)
}

export const deleteProduct = (
  request: FastifyRequest<{ Params: ProductParams }>,
  reply: FastifyReply
) => {
  const { id } = request.params
  const product = productServiceInstance.deleteProduct(id)
  if (!product) {
    return reply.code(404).send({ message: 'Product not found' })
  }
  return reply.code(204).send()
}
