import express from "express"
import productsRouter from "./products/index.js"

const app = express()
app.use(express.json())

app.get('/test', function (req, res) {
    res.send({ message: 'Test success' })
})

app.use('/products', productsRouter)

export { app }