const express = require('express');
const router = express.Router();

// Utitlities:
const catchAsync = require('../utils/catchAsync');

// Models
const User = require('../models/user');

// Passport
const passport = require('passport');

// User controller
const users = require('../controllers/users');

router
    .route('/register')
    .get(users.renderRegister)
    .post(catchAsync(users.register));

// user profile:
router.get('/users/:id', catchAsync(users.userProfile));

router
    .route('/login')
    .get(users.renderLogin)
    .post(
        passport.authenticate('local', {
            failureFlash: true,
            failureRedirect: '/login',
            keepSessionInfo: true,
        }),
        catchAsync(users.login)
    );

router.get('/logout', users.logout);

module.exports = router;
