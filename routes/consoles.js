const express = require('express')
const router = express.Router()
const Console = require('../models/console')
const Game = require('../models/game')
const User = require('../models/user'); // Import the User model

// All Consoles Route
router.get('/', async (req, res) => {
  let searchOptions = {}
  if (req.query.name != null && req.query.name !== '') {
    searchOptions.name = new RegExp(req.query.name, 'i')
  }
  try {
    const consoles = await Console.find(searchOptions)
    res.render('consoles/index', {
      consoles: consoles,
      searchOptions: req.query
    })
  } catch {
    res.redirect('/')
  }
})

// New Console Route
router.get('/new', (req, res) => {
  res.render('consoles/new', { console: new Console() })
})

// Create Console Route
router.post('/', async (req, res) => {
  const console = new Console({
    name: req.body.name
  })
  try {
    const newConsole = await console.save()
    res.redirect(`consoles/${newConsole.id}`)
  } catch {
    res.render('consoles/new', {
      console: console,
      errorMessage: 'Error creating Console'
    })
  }
})

router.get('/:id', async (req, res) => {
  try {
    const console = await Console.findById(req.params.id)
    const games = await Game.find({ console: console.id }).limit(6).exec()
    res.render('consoles/show', {
      console: console,
      gamesByConsole: games
    })
  } catch {
    res.redirect('/')
  }
})

router.get('/:id/edit', async (req, res) => {
  try {
    const console = await Console.findById(req.params.id)
    res.render('consoles/edit', { console: console })
  } catch {
    res.redirect('/consoles')
  }
})

router.put('/:id', async (req, res) => {
  let console
  try {
    console = await Console.findById(req.params.id)
    console.name = req.body.name
    await console.save()
    res.redirect(`/consoles/${console.id}`)
  } catch {
    if (console == null) {
      res.redirect('/')
    } else {
      res.render('consoles/edit', {
        console: console,
        errorMessage: 'Error updating Console'
      })
    }
  }
})

router.delete('/:id', async (req, res) => {
  let console
  try {
    console = await Console.findById(req.params.id)
    await console.remove()
    res.redirect('/consoles')
  } catch {
    if (console == null) {
      res.redirect('/')
    } else {
      res.redirect(`/consoles/${console.id}`)
    }
  }
})

module.exports = router