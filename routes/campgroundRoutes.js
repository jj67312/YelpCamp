const express = require('express');
const router = express.Router();

// Error handling utilities:
const catchAsync = require('../utils/catchAsync');

// Models:
const Campground = require('../models/campground');

// Middleware for checking user logged in or not and authprization
const { validateCampground, isLoggedIn, isAuthor } = require('../middleware');

// Controllers:
const campgrounds = require('../controllers/campgrounds');

// multer for accepting files by using enctype in our form
const multer = require('multer');
const { storage } = require('../cloudinary');
const upload = multer({ storage });

router
  .route('/')
  .get(catchAsync(campgrounds.index))
  .post(
    isLoggedIn,
    upload.array('image'),
    validateCampground,
    catchAsync(campgrounds.createCampground)
  );

// Form for new Campground
router.get('/new', isLoggedIn, campgrounds.renderNewForm);

router
  .route('/:id')
  .get(catchAsync(campgrounds.showCampground))
  .put(
    isLoggedIn,
    isAuthor,
    upload.array('image'),
    validateCampground,
    catchAsync(campgrounds.updateCampground)
  )
  .delete(isLoggedIn, isAuthor, catchAsync(campgrounds.deleteCampground));

// Form for updating existing Campground
router.get(
  '/:id/edit',
  isLoggedIn,
  isAuthor,
  catchAsync(campgrounds.renderEditForm)
);

module.exports = router;
