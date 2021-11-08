const signup = require("./signup");
const login = require("./login");
const updateProfile = require("./updateProfile");
const forgetPassword = require("./forgetPassword");
const retrieve = require("./retrieve");
const retrieveAll = require("./retrieveAll");
const sendInvitation = require("./sendInvitation");
const getInvitations = require("./getInvitations");
const rejectInvitation = require("./rejectInvitation");
const removeInvitation = require("./removeInvitation");
const acceptInvitation = require("./acceptInvitation");

module.exports = {
  signup,
  login,
  updateProfile,
  forgetPassword,
  retrieve,
  retrieveAll,
  sendInvitation,
  getInvitations,
  rejectInvitation,
  removeInvitation,
  acceptInvitation,
};
