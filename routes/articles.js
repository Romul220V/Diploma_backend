const { celebrate, Joi } = require('celebrate');
const router = require('express').Router();
const { getArticles, delArticleId, createArticle } = require('../controllers/articles');

router.get('/articles', getArticles);
router.delete('/articles/:articleId', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().hex(),
  }),
  headers: Joi.object().keys({
    authorization: Joi.string().required(),
  }).unknown(true),
  body: Joi.object().keys({
    cardId: Joi.string().hex(),
  }),
}), delArticleId);
router.post('/articles', celebrate({
  headers: Joi.object().keys({
    authorization: Joi.string().required(),
  }).unknown(true),
  body: Joi.object().keys({
    keyword: Joi.string().hex(),
    title: Joi.string().hex(),
    text: Joi.string().hex(),
    date: Joi.string().hex(),
    source: Joi.string().hex(),
    link: Joi.string().required().pattern(/^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/),
    image: Joi.string().required().pattern(/^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/),
    owner: Joi.string().hex(),
  }),
}), createArticle);
module.exports = router;
