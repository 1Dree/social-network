const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const reqString = {
  type: String,
  required: true,
};

const refreshTokenSchema = new Schema(
  {
    userId: Schema.Types.ObjectId,
    token: reqString,
  },
  { timestamps: true }
);

const RefreshTokenModel = mongoose.model("refreshToken", refreshTokenSchema);

module.exports = RefreshTokenModel;
