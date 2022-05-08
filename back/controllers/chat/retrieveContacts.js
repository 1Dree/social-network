const UserModel = require("../../models/UserModel");

module.exports = async function retrieveContacts(req, res) {
  const { userId } = req.query;

  try {
    const notUser = { $ne: userId };

    let contacts = await UserModel.find(
      {
        _id: notUser,
        "invitations.sended._id": notUser,
        "invitations.received._id": notUser,
        "friends._id": notUser,
      },
      "mailbox login.name login.profile"
    );

    contacts = contacts.map(contact => ({
      _id: contact._id,
      mailbox: contact.mailbox,
      name: contact.login.name,
      profile: contact.login.profile,
    }));

    res.json({ contacts, accessToken: req.accessToken });
  } catch (err) {
    console.log(err);
    res.json(err.msg);
  }
};
