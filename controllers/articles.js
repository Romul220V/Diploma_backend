const Article = require('../Schemes/article');
const SmthnWrong = require('../errors/SmthnWrong');
const NotFoundError = require('../errors/NotFoundError');
const AuthDenied = require('../errors/AuthDenied');

module.exports.getArticles = (req, res, next) => {
  Article.find({ owner: req.user._id })
    .then((articles) => res.send({ data: articles }))
    .catch(() => next(new Error()));
};

module.exports.delArticleId = (req, res, next) => {
  const owner = req.user._id;
  Article.findOne({ _id: req.params.articleId, owner })
    .orFail(() => new Error('Not Found'))
    .then((article) => {
      if (owner !== article.owner.toString()) {
        return Promise.reject(new Error('Denied'));
      }
      return Article.findOneAndRemove({ _id: req.params.articleId });
    })
    .then((article) => res.send({ data: article }))
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new SmthnWrong('Нет пользователя с таким id'));
      } else if (err.message === 'Not Found') {
        next(new NotFoundError('Объект не найден'));
      } else if (err.message === 'Denied') {
        next(new AuthDenied('у вас нет прав'));
      } else next(new Error());
    });
};

module.exports.createArticle = (req, res, next) => {
  const {
    keyword, title, text, date, source, link, image,
    owner = req.user._id,
  } = req.body;
  Article.create({
    keyword, title, text, date, source, link, image, owner,
  })
    .then((article) => res.send({ data: article }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new SmthnWrong('Переданы некорректные данные'));
      } else {
        next(new NotFoundError('Ошибка сервера'));
      }
    });
};
