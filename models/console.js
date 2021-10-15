// use mongoose
const mongoose = require('mongoose')
// create schema (table in SQL)
const consoleSchema = new mongoose.Schema({
    // JSON Objects
    name: {
        type: String,
        required: true
    }
})

// export schema ('Name of table in database', schema )
module.exports = mongoose.model('Console', consoleSchema)