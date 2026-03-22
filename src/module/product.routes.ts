import {
  addProduct,
  deleteProduct,
  getOneProduct,
  getProducts,
  updateProduct
} from './product.controller.js'
import type { FastifyInstance } from 'fastify'
import {
  createProductSchema,
  deleteProductSchema,
  getProductSchema,
  updateProductSchema
} from '../schemas/index.js'

const productRoutes = async (fastify: FastifyInstance) => {
  fastify.get('/products', getProducts)
  fastify.get('/products/:id', { schema: getProductSchema }, getOneProduct)
  fastify.post('/products', { schema: createProductSchema }, addProduct)
  fastify.put('/products/:id', { schema: updateProductSchema }, updateProduct)
  fastify.delete('/products/:id', { schema: deleteProductSchema }, deleteProduct)
}

export default productRoutes
