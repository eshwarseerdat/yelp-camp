const mongoose = require("mongoose");
const campground = require("../model/campground");
const cities = require("./cities");
const { descriptors, places } = require("./seedHelpers");

mongoose.connect("mongodb://localhost:27017/yelp-camp");

const db = mongoose.connection;
db.on("error", console.error.bind(console, "Connection Error"));
db.once("open", () => console.log(`Database Connected`));

const randCity = () => cities[Math.trunc(Math.random() * cities.length)];
const campName = () => {
  const campDescriptor =
    descriptors[Math.trunc(Math.random() * descriptors.length)];
  const campPlaces = places[Math.trunc(Math.random() * places.length)];
  return `${campDescriptor} ${campPlaces}`;
};

const seedDB = async () => {
  await campground.deleteMany({});
  for (let i = 0; i < 50; i++) {
    const { city, state } = randCity();
    const camp = new campground({
      location: `${city}, ${state}`,
      title: campName(),
    });
    await camp.save();
  }
};

seedDB().then(() => {
  mongoose.connection.close();
});
