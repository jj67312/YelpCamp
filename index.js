if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

/*
mongodb+srv://our-first-user:<password>@cluster0.tdx74.mongodb.net/?retryWrites=true&w=majority
*/
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

// for mongo-sanitize:
const mongoSanitize = require('express-mongo-sanitize');

// helmet:
const helmet = require('helmet');

// connecting with mongo atlas:
const { MongoStore } = require('connect-mongo');
const MongoDBStore = require('connect-mongo');

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

// link for connecting to mongo Atlas:
const dbUrl = process.env.DB_URL || 'mongodb://localhost:27017/yelpcamp';
const mongoose = require('mongoose');
main()
  .then((res) => {
    console.log('Successfully connected to mongoDB!');
  })
  .catch((err) => {
    console.log('Connection to mongoDB failed!');
  });
async function main() {
  await mongoose.connect(dbUrl);
}

// 'mongodb://localhost:27017/yelpcamp'

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

// use mongo-sanitize
app.use(
  mongoSanitize({
    replaceWith: '_',
  })
);

const secret = process.env.secret || 'thisshouldbeabettersecret';
const store = MongoDBStore.create({
  mongoUrl: dbUrl,
  crypto: {
    secret,
  },
  // should be in seconds:
  touchAfter: 24 * 60 * 60,
});
store.on('error', function (e) {
  console.log('Session store error: ', e);
});

// express-session settings
const sessionConfig = {
  store,
  name: 'session',
  secret,
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    // secure: true,
    expires: Date.now() * 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7,
  },
};
app.use(session(sessionConfig));

// setting up flash:
app.use(flash());

// setting up helmet:
// app.use(helmet({ contentSecurityPolicy: false }));

const scriptSrcUrls = [
  'https://stackpath.bootstrapcdn.com/',
  'https://api.tiles.mapbox.com/',
  'https://api.mapbox.com/',
  'https://kit.fontawesome.com/',
  'https://cdnjs.cloudflare.com/',
  'https://cdn.jsdelivr.net',
];
//This is the array that needs added to
const styleSrcUrls = [
  'https://kit-free.fontawesome.com/',
  'https://api.mapbox.com/',
  'https://api.tiles.mapbox.com/',
  'https://fonts.googleapis.com/',
  'https://use.fontawesome.com/',
  'https://stackpath.bootstrapcdn.com/',
  'https://cdn.jsdelivr.net',
];
const connectSrcUrls = [
  'https://api.mapbox.com/',
  'https://a.tiles.mapbox.com/',
  'https://b.tiles.mapbox.com/',
  'https://events.mapbox.com/',
];
const fontSrcUrls = [];
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: [],
      connectSrc: ["'self'", ...connectSrcUrls],
      scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
      styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
      workerSrc: ["'self'", 'blob:'],
      objectSrc: [],
      imgSrc: [
        "'self'",
        'blob:',
        'data:',
        'https://res.cloudinary.com/drldelbgv/', //SHOULD MATCH YOUR CLOUDINARY ACCOUNT!
        'https://images.unsplash.com/',
      ],
      fontSrc: ["'self'", ...fontSrcUrls],
    },
  })
);

// setting up passport:
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Middleware for flash:
app.use((req, res, next) => {
  // console.log(req.query);
  res.locals.currentUser = req.user;
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  next();
});

// ROUTES:
app.use('/campgrounds', campgroundRoutes);
app.use('/campgrounds/:id/reviews', reviewRoutes);
app.use('/', userRoutes);

app.get('/', (req, res) => {
  res.render('campgrounds/home');
});

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

const port = process.env.PORT || 3000;
app.listen(port, (req, res) => {
  console.log(`YelpCamp running on port ${port}`);
});

