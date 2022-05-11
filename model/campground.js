const { types } = require("joi");
const mongoose = require("mongoose");
const Review = require("./review");

const Schema = mongoose.Schema;

const campgroundSchema = new Schema({
  title: String,
  price: Number,
  description: String,
  location: String,
  image: String,
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
});

campgroundSchema.post("findOneAndDelete", async function (camp) {
  if (camp) {
    await Review.deleteMany({
      _id: { $in: camp.reviews },
    });
  }
});

module.exports = mongoose.model("Campground", campgroundSchema);
