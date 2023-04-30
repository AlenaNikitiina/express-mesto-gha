const bcrypt = require('bcryptjs'); // импортируем модуль bcrypt
const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    default: 'Жак-Ив Кусто',
    minLength: [2, 'Минимальная длина поля "name" - 2'],
    maxLength: 30,
  },
  about: {
    type: String,
    default: 'Исследователь',
    minLength: 2,
    maxLength: 30,
  },
  avatar: {
    type: String,
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
    validate: {
      validator(v) {
        return validator.isURL(v);
      },
      message: 'Неправильный формат ссылки',
    },
  },
  email: {
    type: String,
    unique: true,
    require: true,
    minLength: 2,
    validate: {
      validator(v) {
        return validator.isEmail(v);
      },
      message: 'Неправильный формат почты',
    },
  },
  password: {
    type: String,
    require: true,
    select: false, // чтобы API не возвращал хеш пароля
  },
}, { versionKey: false });

// добавим метод findUserByCredentials схеме пользователя, будет два параметра

userSchema.statics.findUserByCredentials = function (email, password) {
  // попытаемся найти пользователя по почте. // this — это модель User
  return this.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        return Promise.reject(new Error('Неправильные почта или пароль')); // не нашёлся email— отклоняем промис
      }

      return bcrypt.compare(password, user.password) // нашёлся — сравниваем хеши
        .then((matched) => {
          if (!matched) {
            return Promise.reject(new Error('Неправильные почта или пароль'));
          }

          return user; // теперь user доступен
        });
    });
};

// Чтобы найти пользователя по почте, нам потребуется метод findOne
// которому передадим на вход email. Метод findOne принадлежит модели User
// поэтому обратимся к нему через ключевое слово this: (не должна быть стрелочной

// module.exports = mongoose.model('User', userSchema);
const User = mongoose.model('User', userSchema);

module.exports = User;
