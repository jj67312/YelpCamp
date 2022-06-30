const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Review = require('./review');

// Structure of campground collection in db:
const CampgroundSchema = new Schema({
    title: String,
    images: [
        {
            url: String,
            filename: String,
        },
    ],
    price: Number,
    description: String,
    location: String,
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review',
        },
    ],
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User',
    },
});

// Deleting all reviews assosiated with a campground that is to be deleted
CampgroundSchema.post('findOneAndDelete', async function (doc) {
    if (doc) {
        await Review.deleteMany({
            _id: {
                $in: doc.reviews,
            },
        });
    }
});

// mongoose.model('Campground', CampgroundSchema);
// This creates a collection
module.exports = mongoose.model('Campground', CampgroundSchema);