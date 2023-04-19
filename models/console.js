// use mongoose
const mongoose = require('mongoose')
const Game = require('./game')

// create schema (table in SQL)
const consoleSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  user: { // Add a reference to the User model
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  }
})

//.pre runs a method before doing anything to the database
consoleSchema.pre('remove', function(next) {
    Game.find({ console: this.id }, (err, games) => {
      if (err) {
        next(err)
      } else if (games.length > 0) {
        next(new Error('Error: This console still has games.'))
      } else {
        next()
      }
    })
  })

// export schema ('Name of table in database', schema )
module.exports = mongoose.model('Console', consoleSchema)