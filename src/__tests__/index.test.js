import supertest from "supertest"
import { app } from "../app.js"
import dotenv from "dotenv"
import mongoose from "mongoose"
import res from "express/lib/response"
dotenv.config()

console.log(process.env.MONGO_URL)

const client = supertest(app)

describe("Testing the testing environment", () => {
  test("should check that true is true", () => {
    expect(true).toBe(true)
  }) // it is an alias for test.
  test("should check that 1 + 1 is 2", () => {
    expect(1 + 1).toBe(2)
  }) // it is an alias for test.
})

describe("Testing the endpoints", () => {
  beforeAll(async () => {
    console.log("Before all tests...")
    await mongoose.connect(process.env.MONGO_URL)

    console.log("Connected to Mongo")
  })

  it("should test that the test endpoint returns a success message", async () => {
    const response = await client.get("/test")
    expect(response.body.message).toBe("Test success")
  })

  const validProduct = {
    name: "Test product",
    price: 900,
  }

  it("should test that the POST /products endpoint returns the newly created product", async () => {
    const response = await client.post("/products").send(validProduct)
    expect(response.status).toBe(201)
    expect(response.body._id).toBeDefined()

    console.log(response.body)
  })

  const invalidData = {
    whatever: "something",
  }

  it("should test that POST /products with INVALID data returns 400", async () => {
    const response = await client.post("/products").send(invalidData)
    expect(response.status).toBe(400)
  })

  let createdProductId
  it("should test that the GET /products endpoint returns the product we just created", async () => {
    const response = await client.get("/products")
    expect(response.status).toBe(200)
    expect(response.body.length).toBe(1)

    createdProductId = response.body[0]._id
  })

  const invalidProductId = "623456a60e8cc09d2eed5185"

  it("should test that the GET /products/:id enpoint returns 404 with a non-existing id", async () => {
    const response = await client.get(`/products/${invalidProductId}`)
    expect(response.status).toBe(404)
  })

  it("should test that the GET /products/:id enpoint returns the correct product with a valid id", async () => {
    const response = await client.get(`/products/${createdProductId}`)
    expect(response.status).toBe(200)
    expect(response.body._id).toBe(createdProductId)
  })

  const updatedProduct = {
    name: "Test product two",
    price: 1900,
  }
  it("should test that the PUT /products/:id enpoint updates the product", async () => {
    const response = await client
      .put(`/products/${createdProductId}`)
      .send(updatedProduct)
    expect(response.status).toBe(200)
    expect(response.body.name).toBe(updatedProduct.name)
    expect(response.body.price).toBe(updatedProduct.price)
    expect(typeof response.body.name).toBe("string")
  })

  it("should test that the PUT /products/:id enpoint returns 404 with a non valid id", async () => {
    const response = await client
      .put(`/products/${invalidProductId}`)
      .send(updatedProduct)
    expect(response.status).toBe(404)
  })

  it("should test that the DELETE /products/:id enpoint returns 204 with a valid id", async () => {
    const response = await client.delete(`/products/${createdProductId}`)
    expect(response.status).toBe(204)
  })

  it("should test that the DELETE /products/:id enpoint returns 404 with a non valid id", async () => {
    const response = await client.delete(`/products/${invalidProductId}`)
    expect(response.status).toBe(404)
  })

  afterAll(async () => {
    await mongoose.connection.dropDatabase()
    await mongoose.connection.close()

    console.log("Closed Mongo connection.")
  })
})
