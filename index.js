const { celebrate, Joi } = require('celebrate');
const router = require('express').Router();
const articles = require('./routes/articles');
const users = require('./routes/users');
const errorpage = require('./routes/404');
const { signUp, signIn } = require('./controllers/user');
const auth = require('./middlewares/auth');
const cors = require('./middlewares/CORS');

router.use(cors);
router.options('*', function (req, res) { res.sendStatus(200); });
router.post('/api/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email({ tlds: { allow: false } }),
    password: Joi.string().required(),
  }),
}), signIn);
router.post('/api/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email({ tlds: { allow: false } }),
    password: Joi.string().required(),
    name: Joi.string().required().min(2).max(30),
  }),
}), signUp);
router.use(auth);
router.use('/api/', users);
router.use('/api/', articles);
router.use('/api/', errorpage);
module.exports = router;
