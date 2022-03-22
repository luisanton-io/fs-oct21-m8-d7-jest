import express from "express"
import Product from "./model.js"
const productsRouter = express.Router()

productsRouter
  .get("/", async (req, res) => {
    const products = await Product.find({})
    res.status(200).send(products)
  })

  .get("/:productId", async (req, res, next) => {
    try {
      const productId = req.params.productId
      const product = await Product.findById(productId)

      if (product) {
        res.status(200).send(product)
      } else {
        res.status(404).send({ message: "invalid productId" })
      }
    } catch (error) {
      next(error)
    }
  })
  .post("/", async (req, res) => {
    try {
      const product = new Product(req.body)
      await product.save()
      res.status(201).send(product)
    } catch (error) {
      res.status(400).send(error)
    }
  })
  .put("/:productId", async (req, res, next) => {
    try {
      const productId = req.params.productId
      const updatedProduct = await Product.findByIdAndUpdate(
        productId,
        req.body,
        {
          new: true,
        }
      )
      if (updatedProduct) {
        res.send(updatedProduct)
      } else {
        res
          .status(404)
          .send({ message: `Product with id ${productId} not found` })
      }
    } catch (error) {
      next(error)
    }
  })

  .delete("/:productId", async (req, res, next) => {
    try {
      const productId = req.params.productId
      const deletedProduct = await Product.findByIdAndDelete(productId)
      if (deletedProduct) {
        res.status(204).send()
      } else {
        res
          .status(404)
          .send({ message: `Product with id ${productId} not found!` })
      }
    } catch (error) {
      next(error)
    }
  })

export default productsRouter
