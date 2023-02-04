const express = require('express');
const router = express.Router();
const User = require('../models/user');
const bcrypt = require('bcrypt');


// sign up users
// provide sign up form
router.get('/signup', (req, res) => {
    res.render('signup.ejs', {
        title: 'Sign up for Classfolio'
    })
});

// handle form submission
router.post('/signup', (req, res) => {
    const hashedPassword = bcrypt.hashSync(req.body.password, 10);
    req.body.password = hashedPassword;
    User.create(req.body, (err, newUser) => {
        req.session.userId = newUser._id;
        res.redirect('/class');
    })
});

// log in users
// serve log in form
router.get('/login', (req, res) => {
    res.render('login.ejs', {
        title: 'Login'
    });
});

// handle form submission
router.post('/login', (req, res) => {
    // look up user by email
    User.findOne({email: req.body.email}, (error, foundUser) => {
        if (!foundUser) {
            // if the user does not exist, redirect to login page
            return res.redirect('/login');
        } 
        // if the user exists, compare password to determine a match
        const isMatched = bcrypt.compareSync(req.body.password, foundUser.password);
        if (!isMatched) {
            // if pwd does not match, redirect to login
            return res.redirect('/login');
        }
        // create a new session for the authenticated user
        req.session.userId = foundUser._id;
        // if pwd matches, redirect to class index
        res.redirect('/class');
    });
});


// log out users
router.get('/logout', (req,res) => {
    req.session.destroy((err) => {
        res.redirect('/')
    });
})

module.exports = router;