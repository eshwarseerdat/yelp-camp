const express = require("express");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const path = require("path");
const campground = require("./model/campground");

mongoose.connect("mongodb://localhost:27017/yelp-camp");

const db = mongoose.connection;
db.on("error", console.error.bind(console, "Connection Error"));
db.once("open", () => console.log(`Database Connected`));

app = express();
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.get("/", (req, res) => {
  res.render("home");
});

app.get("/campground", async (req, res) => {
  const camp = new campground({
    title: "Backyard",
    price: "0.01",
    description: "Camping on a budget",
  });
  await camp.save();
  res.send(camp);
});

app.listen("8080", () => {
  console.log(`running on port 8080`);
});
