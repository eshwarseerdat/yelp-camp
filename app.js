const express = require("express");
const mongoose = require("mongoose");
const methodOverride = require("method-override");

app = express();

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen("8080", () => {
  console.log(`running on port 8080`);
});
