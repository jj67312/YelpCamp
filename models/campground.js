const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Review = require('./review');

// Structure of campground collection in db:

const ImageSchema = new Schema({
  url: String,
  filename: String,
});

ImageSchema.virtual('thumbnail').get(function () {
  return this.url.replace('/upload', '/upload/w_200');
});

const opts = { toJSON: { virtuals: true } };

const CampgroundSchema = new Schema(
  {
    title: String,
    images: [ImageSchema],
    geometry: {
      type: {
        type: String,
        enum: ['Point'],
        required: true,
      },
      coordinates: {
        type: [Number],
        required: true,
      },
    },
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
  },
  opts
);

CampgroundSchema.virtual('properties.popUpMarkup').get(function () {
  return `<a href="/campgrounds/${this._id}"><h5>${this.title}</h5></a>`;
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

// JayJ1927127
