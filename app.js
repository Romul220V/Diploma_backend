require('dotenv').config();
const helmet = require('helmet');
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { errors } = require('celebrate');
const ErrMiddleware = require('./middlewares/ErrMiddleware');
const limiter = require('./middlewares/ratelimiter');
const { requestLogger, errorLogger } = require('./middlewares/ReqLog');
const allRoutes = require('./index');

const {
  PORT = 3000, BASE_PATH, NODE_ENV, DATABASE,
} = process.env;
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
const baseAdress = NODE_ENV === 'production' ? DATABASE : 'mongodb://localhost:27017/diploma_database';
mongoose.connect(baseAdress, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
});
app.use(limiter);
app.use(requestLogger);
app.use(helmet(allRoutes));
app.use(errorLogger);
app.use(errors());
app.use(ErrMiddleware);
app.listen(PORT, BASE_PATH);
