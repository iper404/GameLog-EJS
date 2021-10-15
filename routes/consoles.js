const express = require('express')
const router = express.Router()
const Console = require('../models/console')

// All Consoles Route
router.get('/', async (req, res) => {
  let searchOptions = {}
  if (req.query.name != null && req.query.name !== '') {
    searchOptions.name = new RegExp(req.query.name, 'i')
  }
  // 'i' allows for case insensitive searches
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
    // explicitly describe what will be added to our object
  })
  try {
    const newConsole = await console.save() 
    // use await for mongoose to populate newAuthor
    // res.redirect(`consoles/${newConsole.id}`)
    res.redirect(`consoles`)
  } catch {
    res.render('consoles/new', {
      console: console,
      errorMessage: 'Error creating Console'
    })
  }
})

module.exports = router