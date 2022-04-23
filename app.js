const express = require("express");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const engine = require("ejs-mate");
const path = require("path");
const Joi = require("joi");

const Campground = require("./model/campground");
const ExpressError = require("./utils/expressError");
const catchAsync = require("./utils/catchAsync");
const { join } = require("path");

mongoose.connect("mongodb://localhost:27017/yelp-camp");

const db = mongoose.connection;
db.on("error", console.error.bind(console, "Connection Error"));
db.once("open", () => console.log(`Database Connected`));

app = express();
app.engine("ejs", engine);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

app.get("/", (req, res) => {
  res.render("home");
});

app.get(
  "/campgrounds",
  catchAsync(async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render("campgrounds/index", { campgrounds });
  })
);

app.get("/campgrounds/new", (req, res) => {
  res.render("campgrounds/new");
});

app.post(
  "/campgrounds",
  catchAsync(async (req, res, next) => {
    // if (!req.body.campground) next(new ExpressError("Invalid Form Data", 400));
    const campgroundSchema = Joi.object({
      campground: Joi.object({
        title: Joi.string().required(),
        price: Joi.number().min(0).required(),
        image: Joi.string().required(),
        location: Joi.string().required(),
        description: Joi.string().required(),
      }).required(),
    });
    const { error } = campgroundSchema.validate(req.body);
    if (error) {
      const msg = error.details.map((e) => e.message).join(",");
      throw new ExpressError(msg, 400);
    }
    const newCamp = new Campground(req.body.campground);
    await newCamp.save();
    res.redirect(`/campgrounds/${newCamp._id}`);
  })
);

app.get(
  "/campgrounds/:id/edit",
  catchAsync(async (req, res) => {
    const foundCamp = await Campground.findById(req.params.id);
    res.render("campgrounds/edit", { foundCamp });
  })
);

app.put(
  "/campgrounds/:id",
  catchAsync(async (req, res, next) => {
    const { id } = req.params;
    await Campground.findByIdAndUpdate(id, { ...req.body.campground });
    res.redirect(`/campgrounds/${id}`);
  })
);

app.delete(
  "/campgrounds/:id",
  catchAsync(async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    res.redirect("/campgrounds");
  })
);

app.get(
  "/campgrounds/:id",
  catchAsync(async (req, res) => {
    const foundCamp = await Campground.findById(req.params.id);
    res.render("campgrounds/show", { foundCamp });
  })
);

app.all("*", (req, res, next) => {
  throw new ExpressError("Page Not Found", 404);
});

app.use((err, req, res, next) => {
  const { message = "Something Went Wrong", status = 500 } = err;
  res.status(status).render("error", { err });
});

app.listen("8080", () => {
  console.log(`running on port 8080`);
});
