const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../Schemes/user');
const SmthnWrong = require('../errors/SmthnWrong');
const AuthWrong = require('../errors/AuthWrong');
const Conflict = require('../errors/Conflict');

module.exports.signIn = (req, res, next) => {
  const { email, password } = req.body;
  const { NODE_ENV, JWT_SECRET } = process.env;
  User.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        return Promise.reject(new Error('Неправильные почта или пароль'));
      }

      return bcrypt.compare(password, user.password);
    })
    .then((matched) => {
      if (!matched) {
        return Promise.reject(new Error('Неправильные почта или пароль'));
      }
      return User.findOne({ email });
    })
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret', { expiresIn: '7d' });
      res
        .cookie('jwt', token, { httpOnly: true, sameSite: true })
        .status(200).send({ message: 'logged in' });
    })
    .catch((err) => {
      next(new AuthWrong({ message: err.message }));
    });
};

module.exports.getUserMe = (req, res, next) => {
  const id = req.user._id;
  User.findOne({ _id: id })
    .then(({ email, name }) => {
      res.send({ email, name });
    })
    .catch(() => next(new Error()));
};

module.exports.signUp = (req, res, next) => {
  const {
    email, password, name,
  } = req.body;
  const newpass = password.replace(/\s/g, '');
  if (newpass.length === 0) {
    return next(new SmthnWrong('Переданы некорректные данные'));
  }
  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      email, password: hash, name,
    }))
    .then(() => res.send({
      data: {
        email, name,
      },
    }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new SmthnWrong('Переданы некорректные данные'));
      } else if (err.name === 'MongoError' && err.code === 11000) {
        next(new Conflict('Данный почтовый ящик уже зарегистрирован'));
      } else {
        next(new Error());
      }
    });
};
