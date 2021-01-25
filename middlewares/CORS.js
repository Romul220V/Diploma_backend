module.exports = (req, res, next) => {
  // res.set('Access-Control-Allow-Origin', 'http://localhost:8080');
  res.set('Access-Control-Allow-Origin', 'https://romul220v.github.io/Diploma_frontend/');
  res.set('Access-Control-Allow-Methods', 'POST, GET, OPTIONS, DELETE');
  res.set('Access-Control-Allow-Headers', 'Content-Type, credentials, Authorization');
  res.set('Access-Control-Allow-Credentials', 'true');
  return next();
};
