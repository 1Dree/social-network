const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const Schema = mongoose.Schema;

const reqString = {
  type: String,
  required: true,
};

const profile = {
  type: Schema.Types.Mixed,
  default: "default",
};

const emailValidator = async value => {
  const alreadyExist = await mongoose.models.user.countDocuments({
    "login.email": value,
  });
  const formatted = /^[a-zA-z0-9]{1,}@(gmail|hotmail).com$/;

  return !alreadyExist && formatted;
};

const invitation = complement =>
  new Schema({
    _id: Schema.Types.ObjectId,
    name: reqString,
    profile,
    mailbox: Schema.Types.ObjectId,
    ...complement,
  });

const sendedInvitationsSchema = invitation({
  status: { ...reqString, default: "waiting" },
});
const receivedInvitationsSchema = invitation();

const reqObjId = { type: Schema.Types.ObjectId, required: true };

const friendsSchema = new Schema({
  _id: Schema.Types.ObjectId,
  name: reqString,
  profile,
  ltMsg: new Schema(
    {
      msgId: Schema.Types.ObjectId,
      author: Schema.Types.ObjectId,
      content: String,
      moment: reqString,
      type: reqString,
    },
    { timestamps: { createdAt: false, updateAt: false } }
  ),
  chatRoom: reqObjId,
  mailbox: reqObjId,
});

const userSchema = new Schema(
  {
    mailbox: reqObjId,
    login: {
      name: reqString,
      email: {
        ...reqString,
        validate: {
          validator: emailValidator,
          msg: "This Email already exists",
        },
      },
      password: {
        ...reqString,
        validate: {
          validator: value => /^[a-zA-z0-9]{1,8}$/.test(value),
          msg: "Error in password",
        },
      },
      profile,
    },
    friends: [friendsSchema],
    invitations: {
      sended: [sendedInvitationsSchema],
      received: [receivedInvitationsSchema],
    },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  try {
    const salt = await bcrypt.genSalt(10);

    this.login.password = await bcrypt.hash(this.login.password, salt);

    next();
  } catch (err) {
    console.log(err);
  }
});

const UserModel = mongoose.model("user", userSchema);

module.exports = UserModel;
