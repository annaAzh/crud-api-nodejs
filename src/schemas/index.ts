import z from 'zod'
import { type Worker } from 'node:cluster'

export const ProductBodySchema = z
  .object({
    name: z.string('Name is required').min(1),
    description: z.string('Description is required').min(1),
    price: z.number('Price is required').positive('Price must be positive'),
    category: z.string('Category is required').min(1),
    inStock: z.boolean('In stock is required')
  })
  .strict()

export const ProductParamsSchema = z.object({ id: z.uuid('Invalid UUID format') })

export const createProductSchema = { body: ProductBodySchema }
export const updateProductSchema = { params: ProductParamsSchema, body: ProductBodySchema }
export const getProductSchema = { params: ProductParamsSchema }
export const deleteProductSchema = { params: ProductParamsSchema }

export type ProductParams = z.infer<typeof ProductParamsSchema>
export type ProductBody = z.infer<typeof ProductBodySchema>

export type Product = ProductBody & ProductParams

export type Message = {
  type: 'sync_products' | 'sync_master'
  data: Product[]
}

export type WorkerType = {
  worker: Worker
  port: number
}
