const express = require("express");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const path = require("path");
const Campground = require("./model/campground");

mongoose.connect("mongodb://localhost:27017/yelp-camp");

const db = mongoose.connection;
db.on("error", console.error.bind(console, "Connection Error"));
db.once("open", () => console.log(`Database Connected`));

app = express();
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

app.get("/", (req, res) => {
  res.render("home");
});

app.get("/campgrounds", async (req, res) => {
  const campgrounds = await Campground.find({});
  res.render("campgrounds/index", { campgrounds });
});

app.get("/campgrounds/new", (req, res) => {
  res.render("campgrounds/new");
});

app.post("/campgrounds", async (req, res) => {
  const newCamp = new Campground(req.body.campground);
  await newCamp.save();
  res.redirect(`/campgrounds/${newCamp._id}`);
});

app.get("/campgrounds/:id/edit", async (req, res) => {
  const foundCamp = await Campground.findById(req.params.id);
  res.render("campgrounds/edit", { foundCamp });
});

app.put("/campgrounds/:id", async (req, res) => {
  const { id } = req.params;
  await Campground.findByIdAndUpdate(id, { ...req.body.campground });
  res.redirect(`/campgrounds/${id}`);
});

app.get("/campgrounds/:id", async (req, res) => {
  const foundCamp = await Campground.findById(req.params.id);
  res.render("campgrounds/show", { foundCamp });
});

app.listen("8080", () => {
  console.log(`running on port 8080`);
});
