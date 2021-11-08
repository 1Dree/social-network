const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const Schema = mongoose.Schema;

const reqString = {
  type: String,
  required: true,
};

const emailValidator = async value => {
  const alreadyExist = await mongoose.models.user.countDocuments({
    email: value,
  });
  const formatted = /^[a-zA-z0-9]{1,}@(gmail|hotmail).com$/;

  return !alreadyExist && formatted;
};

const invitation = (nameKey, complement) =>
  new Schema({
    _id: Schema.Types.ObjectId,
    [nameKey]: reqString,
    ...complement,
  });

const myInvitationsSchema = invitation("to", { status: reqString });
const invitationsSchema = invitation("from");

const friendsSchema = new Schema({
  _id: Schema.Types.ObjectId,
  name: reqString,
  roomId: Schema.Types.ObjectId,
});

const userSchema = new Schema(
  {
    name: reqString,
    email: {
      ...reqString,
      validate: {
        validator: emailValidator,
        msg: "Error in email field",
      },
    },
    password: {
      ...reqString,
      validate: {
        validator: value => /^[a-zA-z0-9]{1,8}$/.test(value),
        msg: "Error in password",
      },
    },
    friends: [friendsSchema],
    myInvitations: [myInvitationsSchema],
    invitations: [invitationsSchema],
  },

  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  try {
    const salt = await bcrypt.genSalt(10);

    this.password = await bcrypt.hash(this.password, salt);

    next();
  } catch (err) {
    console.log(err);
  }
});

const UserModel = mongoose.model("user", userSchema);

module.exports = UserModel;
