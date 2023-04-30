const mongoose = require('mongoose');
const validator = require('validator');

const cardSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minLength: [2, 'Минимальная длина поля "name" - 2'],
    maxLength: 30,
  },
  link: {
    type: String,
    required: true,
    validate: {
      validator(v) {
        return validator.isURL(v);
      },
      message: 'Неправильный формат ссылки',
    },
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    default: Array,
  }],
  createdAt: {
    type: Date,
    default: Date.now,
  },

}, { versionKey: false });

const Card = mongoose.model('Card', cardSchema);

module.exports = Card;
