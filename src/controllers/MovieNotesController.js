const knex = require("../database/knex")

class MovieNotesController {

   async create(request, response) {
      const { title, description, rating, tags } = request.body
      const { user_id } = request.params

      const [note_id] = await knex("movie_notes").insert({
         title,
         description,
         rating,
         user_id
      });

      const tagsInsert = tags.map(name => {
         return {
            note_id,
            name,
            user_id
         }
      });

      await knex("movie_tags").insert(tagsInsert)

      response.json()
   }

   async show(request, response) {
      const { id } = request.params

      const movieNotes = await knex("movie_notes").where({ id }).first()
      const movieTags = await knex("movie_tags").where({ note_id: id }).orderBy("name")

      return response.json({
         ...movieNotes,
         movieTags
      })
   }

   async delete(request, response) {
      const { id } = request.params

      await knex("movie_notes").where({ id }).delete()
      return response.json()
   }

   async index(request, response) {
      const { user_id, title, tags } = request.query

      let movieNotes;

      if (tags) {
         const filterTags = tags.split(',').map(tag => tag.trim())

         movieNotes = await knex("movie_tags")
            .select([
               "movie_notes.id",
               "movie_notes.title",
               "movie_notes.user_id"
            ])
            .where("movie_notes.user_id", user_id)
            .whereLike("movie_notes.title", `%${title}%`)
            .whereIn("name", filterTags)
            .innerJoin("movie_notes", "movie_notes.id", "movie_tags.note_id")
            .orderBy("movie_notes.title")
      } else {
         movieNotes = await knex("movie_notes")
            .where({ user_id })
            .whereLike("title", `%${title}%`)
            .orderBy("title")
      }

      const userTags = await knex("movie_tags").where({ user_id })

      const notesWithTags = movieNotes.map(movieNote => {
         const noteTags = userTags.filter(tag => tag.note_id === movieNote.id)

         return {
            ...movieNote,
            tags: noteTags
         }
      })

      return response.json(notesWithTags)
   }
}

module.exports = MovieNotesController