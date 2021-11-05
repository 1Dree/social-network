const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const reqString = {
  type: String,
  required: true,
};

const myInvitationSchema = new Schema(
  {
    inviterId: Schema.Types.ObjectId,
    invitedId: Schema.Types.ObjectId,
    to: reqString,
  },
  { timestamps: true }
);
const invitationSchema = new Schema(
  {
    inviterId: Schema.Types.ObjectId,
    invitedId: Schema.Types.ObjectId,
    from: reqString,
  },
  { timestamps: true }
);

const preSaveInvit = collectionName =>
  async function (next) {
    try {
      const alreadyExists = await mongoose.models[
        collectionName
      ].countDocuments({
        inviterId: this.inviterId,
        invitedId: this.invitedId,
      });

      if (alreadyExists) {
        throw new Error("duplicate");
      } else {
        next();
      }
    } catch (err) {
      console.log(err);
    }
  };

invitationSchema.pre("save", preSaveInvit("users.invitation"));
myInvitationSchema.pre("save", preSaveInvit("users.myinvitation"));

const MyInvitationModel = mongoose.model(
  "users.myinvitation",
  myInvitationSchema
);
const InvitationModel = mongoose.model("users.invitation", invitationSchema);

module.exports = { MyInvitationModel, InvitationModel };
