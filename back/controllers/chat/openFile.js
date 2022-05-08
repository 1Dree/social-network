module.exports = async function openFile({ params, gfs }, res) {
  try {
    const files = await gfs.find({ filename: params.filename }).toArray();
    if (!files || !files.length) return res.json({ msg: "No file to show" });

    gfs.openDownloadStreamByName(params.filename).pipe(res);
  } catch (err) {
    console.log(err);

    res.sendStatus(400);
  }
};
