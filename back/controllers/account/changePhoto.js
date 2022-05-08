const UserModel = require("../../models/UserModel");
const mongoose = require("mongoose");

module.exports = async function changePhoto(
  { headers, file, accessToken, db, gfs, query },
  res
) {
  const session = await mongoose.startSession();

  try {
    await session.withTransaction(async () => {
      const { userid } = headers;
      const { prevPhotoFilename } = query;

      if (prevPhotoFilename) {
        const [prevPhoto] = await gfs
          .find({ filename: prevPhotoFilename }, { session })
          .toArray();

        await gfs.delete(new mongoose.Types.ObjectId(prevPhoto._id));
      }

      await db.collection("uploads.files").updateOne(
        { filename: file.filename },
        {
          $set: {
            originalname: file.originalname,
            ownerId: userid,
          },
        },
        { session }
      );

      const {
        login: { profile },
      } = await UserModel.findByIdAndUpdate(
        userid,
        {
          $set: { "login.profile": file.filename },
        },
        { session, new: true, select: "-_id login.profile" }
      );

      const updateProfile = targetField =>
        UserModel.updateMany(
          { [`${targetField}._id`]: userid },
          {
            $set: {
              [`${targetField}.$.profile`]: profile,
            },
          },
          { session }
        );

      await updateProfile("friends");
      await updateProfile("invitatinos.sended");
      await updateProfile("invitatinos.received");

      res.json({
        profile,
        accessToken,
      });
    });
  } catch (err) {
    console.log(err);
    res.status(500).json(err.message);
  } finally {
    await session.endSession();
  }
};
