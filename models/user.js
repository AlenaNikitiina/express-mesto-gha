const bcrypt = require('bcryptjs'); // импортируем модуль bcrypt
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

// добавим метод findUserByCredentials схеме пользователя, будет два параметра
userSchema.statics.findUserByCredentials = function (email, password) {
  // попытаемся найти пользователя по почте. // this — это модель User
  return this.findOne({ email })
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
