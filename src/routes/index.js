const { Router } = require('express')

const usersRoutes = require("./user.routes")
const movieNotesRoutes = require("./movie_notes.routes")
const moviesTagsRoutes = require('./movie_tags.routes')


const routes = Router()

routes.use("/users", usersRoutes)
routes.use("/movie-notes", movieNotesRoutes)
routes.use("/movie-tags", moviesTagsRoutes)

module.exports = routes