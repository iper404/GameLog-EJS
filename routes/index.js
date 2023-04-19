// routes/index.js

const express = require('express');
const router = express.Router();
const Game = require('../models/game');
const User = require('../models/user');
const firebase = require('../firebaseConfig');
const { isAuthenticated } = require('./middleware');

// Middleware to populate res.locals.user with the authenticated user's information
router.use((req, res, next) => {
  const firebaseUser = req.user;
  if (firebaseUser) {
    // Use the email from the firebaseUser object
    res.locals.user = {
      email: firebaseUser.email
    };
  }
  next();
});

// Home Route
router.get('/', (req, res) => {
  const firebaseUser =firebase.auth().currentUser;
  if (firebaseUser) {
    // If the user is authenticated, redirect to the app homepage (dashboard)
    res.redirect('/dashboard');
  } else {
    // If the user is not authenticated, render the login/registration page (new index)
    res.render('home');
  }
});

// Dashboard Route
router.get('/dashboard', isAuthenticated, async (req, res) => {
  const firebaseUser = req.user;
  if (firebaseUser) {
    // If the user is authenticated, render the app homepage (dashboard)
    let games;
    try {
      games = await Game.find({ user: firebaseUser.uid }).sort({ createdAt: 'desc' }).limit(10).exec();
    } catch (error) {
      console.error('Error fetching games:', error);
      games = [];
    }
    // Use the  email from the firebaseUser object directly
    const user = {
      email: firebaseUser.email
    };
    res.render('dashboard', { games: games, user: user }); // Render the app homepage (previously index.ejs)
  } else {
    // If the user is not authenticated, redirect to the home page
    res.redirect('/');
  }
});


// Logout Route
router.get('/logout', isAuthenticated, (req, res) => {
  firebase.auth().signOut().then(() => {
    // Sign-out successful, redirect to home page
    res.redirect('/');
  }).catch((error) => {
    console.log('Error logging out:', error);
  });
});

// All other routes and middleware...

module.exports = router;
