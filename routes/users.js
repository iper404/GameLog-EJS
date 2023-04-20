// routes\users.js

const express = require('express');
const router = express.Router();
const firebase = require('../firebaseConfig');
const User = require('../models/user'); // Import the User model

// Render the registration page
router.get('/register', (req, res) => {
    res.render('users/register');
});

// Handle the registration form submission
// routes/users.js
router.post('/register', async (req, res) => {
    const { username, email, password } = req.body;
    try {
      // Create a new user in Firebase Authentication
      const userCredential = await firebase.auth().createUserWithEmailAndPassword(email, password);
      const firebaseUid = userCredential.user.uid;
  
      // Create a new user in the User model
      const newUser = new User({ username, email, firebaseUid });
      await newUser.save();
  
      res.redirect('/dashboard');
    } catch (error) {
      res.status(500).send('Error registering user: ' + error.message);
    }
  });

// Login route
router.get('/login', (req, res) => {
  res.render('users/login'); // Render the login page
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const userCredential = await firebase.auth().signInWithEmailAndPassword(email, password);
    res.redirect('/dashboard');
  } catch (error) {
    res.render('login', { errorMessage: 'Error logging in: ' + error.message });
  }
});

router.post('/login/guest', async (req, res) => {
  try {
    // Sign in the user anonymously
    const userCredential = await firebase.auth().signInAnonymously();
    res.redirect('/dashboard');
  } catch (error) {
    res.render('login', { errorMessage: 'Error logging in as a guest: ' + error.message });
  }
});

// Other routes (e.g., register, logout)...

module.exports = router;