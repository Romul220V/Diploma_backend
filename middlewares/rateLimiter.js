const rateLimit = require('express-rate-limit');

module.exports = (() => {
  const limiter = rateLimit({
    windowMs: 10 * 60 * 1000,
    max: 100,
  });
  return limiter;
});
