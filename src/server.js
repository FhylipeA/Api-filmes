require("express-async-errors")
const express = require("express")

const AppError = require("./utils/AppError")
const sqliteConnection = require("./database/sqlite")
const routes = require("./routes");

sqliteConnection()

const app = express()
app.use(express.json())

app.use(routes)

app.use((error, request, response, next) => {
   if (error instanceof AppError) {
      return response.status(error.statusCode).json({
         status: "error",
         message: error.message
      })
   }

   console.log(error);

   return response.status(500).json({
      status: "error",
      message: "Internal server error"
   });

})

const PORT = 3000
app.listen(PORT, console.log(`Server is running on Port ${PORT}`))