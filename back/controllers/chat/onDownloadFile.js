module.exports = function onDownloadfile(req, res, next) {
  req.headers.authorization = `Bearer ${req.query.auth}`;

  next();
};
