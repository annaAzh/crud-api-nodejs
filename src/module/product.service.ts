import { randomUUID } from 'node:crypto'
import type { Message, Product, ProductBody } from '../schemas/index.js'
import process from 'node:process'

let products: Product[] = []

if (process.send) {
  process.on('message', (message: Message) => {
    if (message.type === 'sync_products') {
      products = message.data
    }
  })
}

const notifyMaster = () => {
  if (process.send) {
    process.send({ type: 'sync_master', data: products })
  }
}

export const productService = () => {
  const findAll = (): Product[] => {
    return products
  }

  const findOne = (id: string): Product | null => {
    const product = products.find(product => product.id === id)
    return product ? product : null
  }

  const createProduct = (data: ProductBody): Product => {
    const id = randomUUID()
    const newProduct = { ...data, id }
    products.push(newProduct)

    notifyMaster()
    return newProduct
  }

  const updateProduct = (id: string, data: ProductBody): Product | null => {
    const existingProduct = products.find(product => product.id === id)
    if (!existingProduct) {
      return null
    }

    const index = products.indexOf(existingProduct)
    const updatedProduct = { ...data, id: existingProduct.id }
    products[index] = updatedProduct

    notifyMaster()
    return updatedProduct
  }

  const deleteProduct = (id: string): boolean => {
    const existingProduct = products.find(product => product.id === id)
    if (!existingProduct) {
      return false
    }
    products = products.filter(product => product.id !== id)

    notifyMaster()
    return true
  }

  return { findAll, findOne, createProduct, updateProduct, deleteProduct }
}
