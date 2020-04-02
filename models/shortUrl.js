var mongoose = require("mongoose");

var shortUrlSchema = new mongoose.Schema({
  originalUrl: String,
  shortCode: String,
    
});

module.exports = mongoose.model("ShortUrl", shortUrlSchema);
