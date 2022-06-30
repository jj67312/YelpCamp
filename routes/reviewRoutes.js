const express = require('express');
const router = express.Router({ mergeParams: true });

// Schemas:
const { reviewSchema } = require('../schemas');

// Models
const Campground = require('../models/campground');
const Review = require('../models/review');

// Error handling utilities:
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');

const { validateReview, isLoggedIn, isReviewAuthor } = require('../middleware');

// Review controller:
const reviews = require('../controllers/reviews');

// Adding reviews:
router.post('/', validateReview, isLoggedIn, catchAsync(reviews.createReview));

//Deleting reviews:
router.delete(
    '/:reviewId',
    isLoggedIn,
    isReviewAuthor,
    catchAsync(reviews.deleteReview)
);

module.exports = router;
