module.exports = async function onVerifiedAccess(req, res) {
  res.status(200).json("access verified");
};
