// models/user.js
const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  }
  // Other user-related fields, if needed
})

module.exports = mongoose.model('User', userSchema)
