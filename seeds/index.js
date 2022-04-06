const mongoose = require("mongoose");
const axios = require("axios");
const Campground = require("../model/campground");
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

const getImage = async function () {
  try {
    const resp = await axios.get("https://api.unsplash.com/photos/random", {
      params: {
        client_id: "GJJ3UT0BHMAb__3bTkB4ie5mVXHPj1SR06Uye1o2r9E",
        collections: 1114848,
      },
    });
    return resp.data.urls.small;
  } catch (e) {
    console.log(e);
  }
};

const seedDB = async () => {
  await Campground.deleteMany({});
  for (let i = 0; i < 40; i++) {
    const { city, state } = randCity();
    const price = Math.trunc(Math.random() * 20) + 10;
    const camp = new Campground({
      location: `${city}, ${state}`,
      title: campName(),
      image: await getImage(),
      description:
        "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Veniam minima est ducimus, assumenda facere unde.",
      price,
    });
    await camp.save();
  }
};

seedDB().then(() => {
  mongoose.connection.close();
});
