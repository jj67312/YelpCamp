const User = require('../models/user');
const Campground = require('../models/campground');
const Review = require('../models/review');

module.exports.register = async (req, res) => {
    try {
        const { email, password, username } = req.body.user;
        // Create new user instance by passing the email and the username
        const newUser = new User({ email, username });
        // Takes the the new user and the password
        const registeredUser = await User.register(newUser, password);
        req.login(registeredUser, (err) => {
            if (err) {
                return next(err);
            } else {
                req.flash('success', `Welcome ${registeredUser.username}!`);
                res.redirect('/campgrounds');
            }
        });
    } catch (e) {
        req.flash('error', e.message);
        res.redirect('/register');
    }
};

module.exports.userProfile = async (req, res) => {
    const { id } = req.params;
    const user = await User.findById(id);

    // find all campground owned by user:
    const allCampgrounds = await Campground.find({});
    let userCampgrounds = [];
    for (let campground of allCampgrounds) {
        if (campground.author.equals(user._id)) {
            userCampgrounds.push(campground);
        }
    }

    // find all the reviews owned by user:
    const allReviews = await Review.find({});
    let reviewedCampgrounds = [];
    let userReviews = [];
    for (let review of allReviews) {
        if (review.author.equals(user._id)) {
            const reviewCamp = await Campground.findById(review.campground);
            userReviews.push(review);
            reviewedCampgrounds.push(reviewCamp);
        }
    }

    res.render('users/profile', { user, userCampgrounds, userReviews, reviewedCampgrounds });
};

module.exports.login = async (req, res) => {
    req.flash('success', `Welcome back ${req.user.username}`);
    const redirectUrl = req.session.returnTo || '/campgrounds';
    delete req.session.returnTo;
    res.redirect(redirectUrl);
};

module.exports.logout = (req, res) => {
    const username = req.user.username;
    req.logout(function (err) {
        req.flash('success', `See you soon ${username}!`);
        res.redirect('/campgrounds');
    });
};

module.exports.renderRegister = (req, res) => {
    res.render('users/register');
};

module.exports.renderLogin = (req, res) => {
    res.render('users/login');
};
