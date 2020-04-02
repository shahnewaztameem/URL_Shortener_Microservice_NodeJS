"use strict";

var express = require("express");
var mongo = require("mongodb");
var mongoose = require("mongoose");
var bodyParser = require("body-parser");
var validUrl = require("valid-url");
var ShortUrl = require("./models/shortUrl");
var shortId = require("shortid");
var dorEnv = require("dotenv").config();

var cors = require("cors");

var app = express();

// Basic Configuration
var port = process.env.PORT || 3000;

/** this project needs a db !! **/
console.log(process.env.DB_URI);
mongoose.connect(process.env.DB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

app.use(cors());

/** this project needs to parse POST bodies **/
// you should mount the body-parser here
app.use(
  bodyParser.urlencoded({
    extended: true
  })
);

app.use("/public", express.static(process.cwd() + "/public"));

app.get("/", function(req, res) {
  res.sendFile(process.cwd() + "/views/index.html");
});

// your first API endpoint...
app.get("/api/hello", function(req, res) {
  res.json({
    greeting: "hello API"
  });
});

app.get("/api/shorturl/:id", function(req, res) {
  var searchKey = req.params.id;

  //console.log(searchKey);
  ShortUrl.findOne({ shortCode: searchKey }, function(error, foundKey) {
    if (error) {
      //return console.log(error);
    } else {
      if (foundKey != null) {
        res.redirect(foundKey.originalUrl);
      } else {
        res.json({ error: "Shortlink is not found" });
      }
    }
    console.log(foundKey.originalUrl);
  });
});

app.post("/api/shorturl/new", function(req, res) {
  var url = req.body.url;
  if (validUrl.isUri(url)) {
    var shortid = shortId.generate();
    ShortUrl.create({ originalUrl: url, shortCode: shortid }, function(
      error,
      data
    ) {
      if (error) {
        return console.log(error);
      } else {
        console.log(shortid);
        res.json({ original_url: url, short_url: shortid });
      }
    });
  } else {
    res.json({ error: "invalid URL" });
  }
});

app.listen(port, function() {
  console.log("Node.js listening ...");
});
