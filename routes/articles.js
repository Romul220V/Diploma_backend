const { celebrate, Joi } = require('celebrate');
const { default: validator } = require('validator');
const router = require('express').Router();
const { getArticles, delArticleId, createArticle } = require('../controllers/articles');

router.get('/articles', getArticles);
router.delete('/articles/:articleId', celebrate({
  params: Joi.object().keys({
    articleId: Joi.string().hex(),
  }),
  headers: Joi.object().keys({
    authorization: Joi.string().required(),
  }).unknown(true),
  body: Joi.object().keys({
    articleId: Joi.string().hex(),
  }),
}), delArticleId);
router.post('/articles', celebrate({
  headers: Joi.object().keys({
    authorization: Joi.string().required(),
  }).unknown(true),
  body: Joi.object().keys({
    keyword: Joi.string(),
    title: Joi.string(),
    text: Joi.string(),
    date: Joi.string(),
    source: Joi.string(),
    link: Joi.string().required().custom((value, helpers) => {
      if (validator.isURL(value)) {
        return value;
      }
      return helpers.message('Поле link заполненно некорректно');
    }),
    image: Joi.string().required().custom((value, helpers) => {
      if (validator.isURL(value)) {
        return value;
      }
      return helpers.message('Поле image заполненно некорректно');
    }),
  }),
}), createArticle);
module.exports = router;
