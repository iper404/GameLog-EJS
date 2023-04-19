// routes\games.js

const express = require('express')
const router = express.Router()
const Game = require('../models/game')
const Console = require('../models/console')
const User = require('../models/user'); // Import the User model
const imageMimeTypes = ['image/jpeg', 'image/png', 'images/gif']
const { isAuthenticated } = require('./middleware');

// All Games Route
router.get('/', isAuthenticated, async (req, res) => {
  let query = Game.find({ user: req.user.uid }); // Fetch data only for the currently logged-in user
  if (req.query.title != null && req.query.title != '') {
    query = query.regex('title', new RegExp(req.query.title, 'i'))
  }
  if (req.query.currHrsGte != null && req.query.currHrsGte != '') {
    query = query.gte('currHrs', req.query.currHrsGte)
  }
  if (req.query.currHrsLte != null && req.query.currHrsLte != '') {
    query = query.lte('currHrs', req.query.currHrsLte)
  }
  if (req.query.totalHrsLte != null && req.query.totalHrsLte != '') {
    query = query.lte('hrsLong', req.query.totalHrsLte)
  }
  if (req.query.totalHrsGte != null && req.query.totalHrsGte != '') {
    query = query.gte('hrsLong', req.query.totalHrsGte)
  }
  if (req.query.nowPlaying != null && req.query.nowPlaying != '') {
    query = query.where('nowPlaying', req.query.nowPlaying)
  }
  if (req.query.completed != null && req.query.completed != '') {
    query = query.where('completed', req.query.completed)
  }
  console.log(req.query)
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
router.get('/new', isAuthenticated, async (req, res) => { // Protect route using isAuthenticated middleware
  renderNewPage(res, new Game())
});

// Create Game Route
router.post('/', isAuthenticated, async (req, res) => { // Protect route using isAuthenticated middleware
  const game = new Game({
    title: req.body.title,
    console: req.body.console,
    startDate: new Date(req.body.startDate),
    hrsLong: req.body.hrsLong,
    currHrs: req.body.currHrs,
    completed: req.body.completed,
    nowPlaying: req.body.nowPlaying,
    description: req.body.description,
    user: req.user.uid // Add userId when creating a new game
  });

  saveCover(game, req.body.cover)

  try {
    const newGame = await game.save();
    res.redirect(`games/${newGame.id}`);
  } catch (error) {
    console.log('Error:', error); // Log the error
    if (game) {
      renderNewPage(res, game, true);
    } else {
      res.redirect('/games');
    }
  }
});

// Show Game Route
router.get('/:id', isAuthenticated, async (req, res) => { // Protect route using isAuthenticated middleware
  try {
    const game = await Game.findById(req.params.id)
                           .populate('console')
                           .exec()
    res.render('games/show', { game: game })
  } catch {
    res.redirect('/')
  }
})

// Edit Game Route
router.get('/:id/edit', isAuthenticated, async (req, res) => { // Protect route using isAuthenticated middleware
  try {
    const game = await Game.findById(req.params.id)
    renderEditPage(res, game)
  } catch {
    res.redirect('/')
  }
})

// Update Game Route
router.put('/:id', isAuthenticated, async (req, res) => { // Protect route using isAuthenticated middleware
  let game
  try {
    game = await Game.findById(req.params.id)
    game.title = req.body.title
    game.console = req.body.console
    game.startDate = new Date(req.body.startDate)
    game.hrsLong = req.body.hrsLong
    game.currHrs = req.body.currHrs
    game.completed = Boolean(req.body.completed)
    game.nowPlaying = Boolean(req.body.nowPlaying)
    game.description = req.body.description

    if (req.body.cover != null && req.body.cover !== '') {
      saveCover(game, req.body.cover)
    }
    await game.save();
    res.redirect(`/games/${game.id}`);
  } catch {
    if (game) {
      renderEditPage(res, game, true);
    } else {
      res.redirect('/games');
    }
  }
});

// Delete Game Page
router.delete('/:id', isAuthenticated, async (req, res) => { // Protect route using isAuthenticated middleware
  let game
  try {
    game = await Game.findById(req.params.id)
    await game.remove()
    res.redirect('/games')
  } catch {
    if (game != null) {
      res.render('games/show', {
        game: game,
        errorMessage: 'Could not remove game'
      })
    } else {
      res.redirect('/')
    }
  }
})

async function renderNewPage(res, game, hasError = false) {
  renderFormPage(res, game, 'new', hasError)
}

async function renderEditPage(res, game, hasError = false) {
  renderFormPage(res, game, 'edit', hasError)
}

async function renderFormPage(res, game, form, hasError = false) {
  try {
    const consoles = await Console.find({})
    const params = {
      consoles: consoles,
      game: game
    }
    if (hasError) {
      if (form === 'edit') {
        params.errorMessage = 'Error Updating Game'
      } else {
        params.errorMessage = 'Error Creating Game'
      }
    }
    res.render(`games/${form}`, params)
  } catch {
    res.redirect('/games')
  }
}

function saveCover(game, coverEncoded) {
  if (coverEncoded == null || coverEncoded === '') return
  const cover = JSON.parse(coverEncoded)
  if (cover != null && imageMimeTypes.includes(cover.type)) {
    game.coverImage = new Buffer.from(cover.data, 'base64')
    game.coverImageType = cover.type
  }
}

module.exports = router