const express = require("express");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const path = require("path");

app = express();
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.get("/", (req, res) => {
  res.render("home");
});

app.listen("8080", () => {
  console.log(`running on port 8080`);
});
