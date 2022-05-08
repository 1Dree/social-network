module.exports = async function downloadFile({ query, gfs }, res) {
  const { filename } = query;
  if (!filename) return res.sendStatus(400);

  try {
    const files = await gfs.find({ filename }).toArray();
    if (!files || !files.length) return res.json({ msg: "No file to show" });

    gfs.openDownloadStreamByName(filename).pipe(res);
  } catch (err) {
    console.log(err);
    res.json(err.message);
  }
};
