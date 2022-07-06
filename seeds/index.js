const Campground = require('../models/campground');
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers');

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

// utility function for finding random element from a given array
const sample = (array) => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
  await Campground.deleteMany({});

  for (let i = 0; i < 50; i++) {
    // picking up a random number from 0 to 999,
    // since there are 1000 such elements in the cities file
    const random1000 = Math.floor(Math.random() * 1000);

    const price = Math.floor(Math.random() * 20) + 10;

    // Creating a new campground by picking up the random city and state
    // using the random number generated in the previous step

    // Getting a random title by using the seedHelpers file,
    // in which we got to have a descriptor and a place
    const camp = new Campground({
      author: '629ff1a0dc143565e789b4ff',
      location: `${cities[random1000].city}, ${cities[random1000].state}`,
      title: `${sample(descriptors)} ${sample(places)}`,
      images: [
        {
          url: 'https://res.cloudinary.com/drldelbgv/image/upload/v1656534296/YelpCamp/chfkdfyx3arvghyenlvb.jpg',
          filename: 'YelpCamp/chfkdfyx3arvghyenlvb',
        },
        {
          url: 'https://res.cloudinary.com/drldelbgv/image/upload/v1656534296/YelpCamp/mjvphgwopynj9xd8fgy0.jpg',
          filename: 'YelpCamp/mjvphgwopynj9xd8fgy0',
        },
        {
          url: 'https://res.cloudinary.com/drldelbgv/image/upload/v1656534296/YelpCamp/qj1qzlm5e1tlyhwzzeri.jpg',
          filename: 'YelpCamp/qj1qzlm5e1tlyhwzzeri',
        },
      ],
      geometry:{
        type: 'Point',
        coordinates: [72.877393, 19.07599]
      },
      price,
      description:
        'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quos perspiciatis aliquam cumque ut ratione totam quis enim vitae nesciunt, voluptatem iste blanditiis incidunt earum labore nemo ipsam consectetur quibusdam? Aliquid? Quas tempora unde explicabo nihil possimus corrupti? Reprehenderit expedita aliquam totam. Iste, quam reiciendis! Molestiae distinctio non sequi, architecto quo ipsa vero, quos corrupti sed, delectus necessitatibus ducimus eum id.',
    });

    await camp.save();
  }
};

seedDB().then(() => {
  mongoose.connection.close();
});
