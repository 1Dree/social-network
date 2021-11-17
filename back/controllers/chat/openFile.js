module.exports = async function retrieveMsgs({ query, gfs }, res) {
  const { filename } = query;
  if (!filename) return res.sendStatus(400);

  try {
    gfs.openDownloadStreamByName(filename).pipe(res);
  } catch (err) {
    console.log(err);
    res.json(err.message);
  }
};
