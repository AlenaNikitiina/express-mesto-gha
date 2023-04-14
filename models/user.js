const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minLength: [2, 'Минимальная длина поля "name" - 2'],
    maxLength: 30,
  },
  about: {
    type: String,
    required: true,
    minLength: 2,
    maxLength: 30,
  },
  avatar: {
    type: String,
    required: true,
  },
}, { versionKey: false });

// module.exports = mongoose.model('User', userSchema);
const User = mongoose.model('User', userSchema);

module.exports = User;
