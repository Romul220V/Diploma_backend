require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { celebrate, Joi } = require('celebrate');
const { errors } = require('celebrate');
const articles = require('./routes/articles');
const users = require('./routes/users');
const errorpage = require('./routes/404');
const { signUp, signIn } = require('./controllers/user');
const auth = require('./middlewares/auth');
const ErrM = require('./middlewares/ErrMiddleware');
const limiter = require('./middlewares/ratelimiter');
const { requestLogger, errorLogger } = require('./middlewares/ReqLog');

const { PORT = 3000, BASE_PATH } = process.env;
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect('mongodb://localhost:27017/diploma_database', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
});
app.use(limiter);
app.use(requestLogger);
app.post('/api/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email({ tlds: { allow: false } }),
    password: Joi.string().required(),
  }),
}), signIn);
app.post('/api/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email({ tlds: { allow: false } }),
    password: Joi.string().required(),
    name: Joi.string().required().min(2).max(30),
  }),
}), signUp);
app.use(auth);
app.use('/api/', users);
app.use('/api/', articles);
app.use('/api/', errorpage);
app.use(errorLogger);
app.use(errors());
app.use(ErrM);
app.listen(PORT, () => {
  console.log('Ссылка на сервер:');
  console.log(BASE_PATH);
});