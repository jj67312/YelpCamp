if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const express = require('express');
const app = express();
const path = require('path');

// express-session:
const session = require('express-session');

// flash
const flash = require('connect-flash');

// passport for authentication
const passport = require('passport');
const LocalStrategy = require('passport-local');

// campground validation schema (Joi)
const { campgroundSchema, reviewSchema } = require('./schemas');

//method-override package so that we can make use of put and delete
const methodOverride = require('method-override');

//ejs-mate package to make use of additional ejs functionalities like layout, partials etc
const ejsMate = require('ejs-mate');

// error handling utlilities
const catchAsync = require('./utils/catchAsync');
const ExpressError = require('./utils/ExpressError');

// routes:
const campgroundRoutes = require('./routes/campgroundRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const userRoutes = require('./routes/userRoutes');

// Models:
const Campground = require('./models/campground');
const Review = require('./models/review');
const User = require('./models/user');

/*
  MONGOOSE:
  Using an Object Data Model ("ODM") or an Object Relational Model ("ORM"). 
  An ODM/ORM represents the website's data as JavaScript objects, which are then mapped to the underlying database. 
  Some ORMs are tied to a specific database, while others provide a database-agnostic backend.

  Mongoose is a MongoDB object modeling tool designed to work in an asynchronous environment.
*/
const mongoose = require('mongoose');
main()
  .then((res) => {
    console.log('Successfully connected to mongoDB!');
  })
  .catch((err) => {
    console.log('Connection to mongoDB failed!');
  });
async function main() {
  await mongoose.connect('mongodb://localhost:27017/yelpcamp');
}

// telling express that we will be using ejsMate instead of the default one
app.engine('ejs', ejsMate);

// Set EJS as templating engine
app.set('view engine', 'ejs');
/*
  __dirname represents the directory we are currently working in
  and views is the folder where all of our ejs templates will be kept
*/
app.set('views', path.join(__dirname, 'views'));

// to parse the data for post requests, or in other words:
// to access the data submited by a form to a post request
app.use(express.urlencoded({ extended: true }));

// query string value to override a method
app.use(methodOverride('_method'));

//for making use of custom css and js files in the public directory:
app.use(express.static(path.join(__dirname, 'public')));

// express-session settings
const sessionConfig = {
  secret: 'thisshouldbeabettersecret',
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    expires: Date.now() * 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7,
  },
};
app.use(session(sessionConfig));

// setting up flash:
app.use(flash());

// setting up passport:
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Middleware for flash:
app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  next();
});

// ROUTES:
app.use('/campgrounds', campgroundRoutes);
app.use('/campgrounds/:id/reviews', reviewRoutes);
app.use('/', userRoutes);

app.all('*', (req, res, next) => {
  next(new ExpressError('Page not found!', 404));
});

// Error handling
app.use((err, req, res, next) => {
  const { statusCode = 500 } = err;
  if (!err.message) {
    err.message = 'Oh No, something went wrong!';
  }
  res.status(statusCode).render('error', { err });
});

app.listen(3000, (req, res) => {
  console.log('YelpCamp running on port 3000');
});
