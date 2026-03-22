import { expect, describe, it, beforeAll, afterAll } from 'vitest'
import { server } from '../index.js'
import type { Product, ProductBody } from 'schemas/index.js'

beforeAll(async () => await server.ready())
afterAll(async () => await server.close())

describe('Test API full round', () => {
  const data: ProductBody = {
    name: 'banana',
    description: 'sweet yellow fruit',
    price: 100,
    category: 'food',
    inStock: true
  }
  let createdProduct: Product | null = null

  it('should return empty products array with GET api/products', async () => {
    const response = await server.inject({
      method: 'GET',
      url: 'api/products'
    })

    expect(response.statusCode).toBe(200)
    expect(response.json()).toEqual([])
  })

  it('should create a product and return it with POST api/products', async () => {
    const response = await server.inject({
      method: 'POST',
      url: 'api/products',
      body: data
    })

    createdProduct = response.json()

    expect(response.statusCode).toBe(201)
    expect(response.json()).toEqual(expect.objectContaining(data))
    expect(response.json()).toHaveProperty('id')
    expect(response.json().id).toBeTypeOf('string')
  })

  it('should retrieve the created product with GET api/products/{id}', async () => {
    const productId = createdProduct?.id

    const response = await server.inject({
      method: 'GET',
      url: `api/products/${productId}`
    })

    expect(response.statusCode).toBe(200)
    expect(response.json()).toEqual(expect.objectContaining(data))
  })

  it('should successfully update the product with PUT api/products/{id}', async () => {
    const productId = createdProduct?.id

    const response = await server.inject({
      method: 'PUT',
      url: `api/products/${productId}`,
      body: {
        name: 'banana',
        description: 'sweet yellow fruit',
        price: 200,
        category: 'food',
        inStock: true
      }
    })

    expect(response.statusCode).toBe(200)
    expect(response.json().id).toBe(productId)
    expect(response.json().price).toBe(200)
  })

  it('should delete the product with DELETE api/products/{id}', async () => {
    const productId = createdProduct?.id

    const response = await server.inject({
      method: 'DELETE',
      url: `api/products/${productId}`
    })

    expect(response.statusCode).toBe(204)
    expect(response.statusMessage).toBe('No Content')
  })

  it('should return 404 when trying to fetch the deleted product', async () => {
    const productId = createdProduct?.id

    const response = await server.inject({
      method: 'GET',
      url: `api/products/${productId}`
    })

    expect(response.statusCode).toBe(404)
    expect(response.body).contain('Product not found')
  })
})

describe('test validation', () => {
  it('should return 400 for negative price', async () => {
    const data: ProductBody = {
      name: 'banana',
      description: 'sweet yellow fruit',
      price: -100,
      category: 'food',
      inStock: true
    }
    const response = await server.inject({
      method: 'POST',
      url: 'api/products',
      body: data
    })

    expect(response.statusCode).toBe(400)
    expect(response.body).contain('Price must be positive')
  })

  it('should return 400 when the "name" field is missing', async () => {
    const data = {
      description: 'sweet yellow fruit',
      price: -100,
      category: 'food',
      inStock: true
    }
    const response = await server.inject({
      method: 'POST',
      url: 'api/products',
      body: data
    })

    expect(response.statusCode).toBe(400)
    expect(response.body).contain('Name is required')
  })
})

describe('test not found resources', () => {
  it('should return 404 when fetching a non-existing product ID', async () => {
    const notExistId = '30b534d5-48c2-4941-8f12-12c64ca581e0'
    const response = await server.inject({
      method: 'GET',
      url: `api/products/${notExistId}`
    })

    expect(response.statusCode).toBe(404)
    expect(response.body).contain('Product not found')
  })
  it('should return 404 when updating a non-existing product ID', async () => {
    const notExistId = '30b534d5-48c2-4941-8f12-12c64ca581e0'
    const response = await server.inject({
      method: 'PUT',
      url: `api/products/${notExistId}`,
      body: {
        name: 'banana',
        description: 'sweet yellow fruit',
        price: 100,
        category: 'food',
        inStock: true
      }
    })

    expect(response.statusCode).toBe(404)
    expect(response.body).contain('Product not found')
  })
  it('should return 404 when deleting a non-existing product ID', async () => {
    const notExistId = '30b534d5-48c2-4941-8f12-12c64ca581e0'
    const response = await server.inject({
      method: 'DELETE',
      url: `api/products/${notExistId}`
    })

    expect(response.statusCode).toBe(404)
    expect(response.body).contain('Product not found')
  })
})
