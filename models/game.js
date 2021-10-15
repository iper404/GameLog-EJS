const mongoose = require('mongoose')
const path = require('path')

const coverImageBasePath = 'uploads/gameCovers'

const gameSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  releaseDate: {
    type: Date,
    required: true
  },
  hrsLong: {
    type: Number,
    required: true
  },
  createdAt: { 
    // why? to display most recent
    type: Date,
    required: true,
    default: Date.now
  },
  coverImageName: {
    type: String,
    required: true
  },
  console: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Console'
  }
})

gameSchema.virtual('coverImagePath').get(function() {
  if (this.coverImageName != null) {
    return path.join('/', coverImageBasePath, this.coverImageName)
  }
})

module.exports = mongoose.model('Game', gameSchema)
module.exports.coverImageBasePath = coverImageBasePath