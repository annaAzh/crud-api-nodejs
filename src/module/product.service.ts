import { randomUUID } from 'node:crypto'
import type { Product, ProductBody } from '../schemas/index.ts'

let products: Product[] = []

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
    return updatedProduct
  }

  const deleteProduct = (id: string): boolean => {
    const existingProduct = products.find(product => product.id === id)
    if (!existingProduct) {
      return false
    }
    products = products.filter(product => product.id !== id)
    return true
  }

  return { findAll, findOne, createProduct, updateProduct, deleteProduct }
}
