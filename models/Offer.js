const mongoose = require("mongoose");

// const User = require("../models/User");
// app.use(User);

const Offer = mongoose.model("Offer", {
  title: {
    type: String,
    minlength: 1,
    maxlength: 50,
    required: true
  },
  description: {
    type: String,
    minlength: 1,
    maxlength: 50,
    required: true
  },
  price: {
    type: Number,
    min: 0,
    max: 100000
  },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  created: {
    type: Date,
    default: Date.now
  }
});

module.exports = Offer;
