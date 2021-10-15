const express = require('express')
const router = express.Router()
const multer = require('multer')
const path = require('path')
const fs = require('fs')
const Game = require('../models/game')
const Console = require('../models/console')
const uploadPath = path.join('public', Game.coverImageBasePath)
const imageMimeTypes = ['image/jpeg', 'image/png', 'images/gif']
const upload = multer({
  dest: uploadPath,
  fileFilter: (req, file, callback) => {
    callback(null, imageMimeTypes.includes(file.mimetype))
  }
})

// All Games Route
router.get('/', async (req, res) => {
  let query = Game.find()
  if (req.query.title != null && req.query.title != '') {
    query = query.regex('title', new RegExp(req.query.title, 'i'))
  }
  if (req.query.releasedBefore != null && req.query.releasedBefore != '') {
    query = query.lte('releaseDate', req.query.releasedBefore)
  }
  if (req.query.releasedAfter != null && req.query.releaseedAfter != '') {
    query = query.gte('releaseDate', req.query.releasedAfter)
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
router.post('/', upload.single('cover'), async (req, res) => {
  const fileName = req.file != null ? req.file.filename : null
  const game = new Game({
    title: req.body.title,
    console: req.body.console,
    releaseDate: new Date(req.body.releaseDate),
    hrsLong: req.body.hrsLong,
    coverImageName: fileName,
    description: req.body.description
  })

  try {
    const newGame = await game.save()
    // res.redirect(`games/${newGame.id}`)
    res.redirect(`games`)
  } catch {
    if (game.coverImageName != null) {
      removeGameCover(game.coverImageName)
    }
    renderNewPage(res, game, true)
  }
})

function removeGameCover(fileName) {
  fs.unlink(path.join(uploadPath, fileName), err => {
    if (err) console.error(err)
  })
}

async function renderNewPage(res, game, hasError = false) {
  try {
    const games = await Game.find({})
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

module.exports = router