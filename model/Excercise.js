const mongoose = require('mongoose');
const Schema = new mongoose.Schema({
  username: String,
  description: String,
  duration: Number,
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Excercise', Schema);
