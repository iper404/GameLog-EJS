// routes/middleware.js
const firebase = require('../firebaseConfig');

const isAuthenticated = (req, res, next) => {
    firebase.auth().onAuthStateChanged((user) => {
        if (user) {
            req.user = {
                uid: user.uid, // Only populate the user's ID
                email: user.email // Add the user's email
            };
            next();
        } else {
            res.redirect('/users/login');
        }
    });
};

module.exports = {
    isAuthenticated
};
