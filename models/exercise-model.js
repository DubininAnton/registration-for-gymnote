const { Schema, model } = require('mongoose')

const Exercise = new Schema({
    email: { type: String }
  });

module.exports = model('Exercise', Exercise)