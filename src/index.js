import { app } from "./app.js";
import mongoose from "mongoose"

mongoose.connect(process.env.MONGO_URL).then(() => {
    console.log("Connected to Mongo")

    const port = process.env.PORT || 3000

    app.listen(port, () => {
        console.log('Server is running on port ' + port)
    })
})