const express = require('express')
const router = express.Router()
const Game = require('../models/game')
const Console = require('../models/console')
const imageMimeTypes = ['image/jpeg', 'image/png', 'images/gif']

// All Games Route
router.get('/', async (req, res) => {
  let query = Game.find()
  if (req.query.title != null && req.query.title != '') {
    query = query.regex('title', new RegExp(req.query.title, 'i'))
  }
  if (req.query.releaseedBefore != null && req.query.releaseedBefore != '') {
    query = query.lte('releaseDate', req.query.releaseedBefore)
  }
  if (req.query.releaseedAfter != null && req.query.releaseedAfter != '') {
    query = query.gte('releaseDate', req.query.releaseedAfter)
  }
  try {
    const games = await query.exec()
    res.render('games/index', {
      games: games,
      searchOptions: req.query
    })
  } catch {
    res.redirect('/')
  }
})

// New Game Route
router.get('/new', async (req, res) => {
  renderNewPage(res, new Game())
})

// Create Game Route
router.post('/', async (req, res) => {
  const game = new Game({
    title: req.body.title,
    console: req.body.console,
    releaseDate: new Date(req.body.releaseDate),
    hrsLong: req.body.hrsLong,
    description: req.body.description
  })
  saveCover(game, req.body.cover)

  try {
    const newGame = await game.save()
    // res.redirect(`games/${newGame.id}`)
    res.redirect(`games`)
  } catch {
    renderNewPage(res, game, true)
  }
})

async function renderNewPage(res, game, hasError = false) {
  try {
    const consoles = await Console.find({})
    const params = {
      consoles: consoles,
      game: game
    }
    if (hasError) params.errorMessage = 'Error Creating Game'
    res.render('games/new', params)
  } catch {
    res.redirect('/games')
  }
}

function saveCover(game, coverEncoded) {
  if (coverEncoded == null) return
  const cover = JSON.parse(coverEncoded)
  if (cover != null && imageMimeTypes.includes(cover.type)) {
    game.coverImage = new Buffer.from(cover.data, 'base64')
    game.coverImageType = cover.type
  }
}

module.exports = router