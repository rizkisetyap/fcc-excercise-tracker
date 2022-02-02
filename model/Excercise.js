const mongoose = require('mongoose');
const Schema = new mongoose.Schema({
  username: String,
  description: String,
  duration: Number,
  date: String,
});

module.exports = mongoose.model('Excercise', Schema);
