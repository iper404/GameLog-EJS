// routes/addGameToPlaylist.js
const express = require('express')
const router = express.Router()
const Game = require('../models/game')

router.post('/:gameId', async (req, res) => {
  try {
    const userId = req.user.id // Replace this with the actual method you use to get the user's ID
    const originalGame = await Game.findById(req.params.gameId)

    // Create a new instance of the game with the current user's ID
    const newGame = new Game({
      ...originalGame.toObject(),
      _id: mongoose.Types.ObjectId(),
      user: userId
    })

    await newGame.save()
    res.redirect('/dashboard') // Redirect to the user's dashboard
  } catch {
    res.status(500).send('Error adding game to playlist')
  }
})
