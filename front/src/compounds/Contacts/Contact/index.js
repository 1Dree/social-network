import "./contact.css";
import "../../../styles/discardanimation.css";
import { Profile } from "../../../components";
import { useUser } from "../../../contexts/UserContext";
import { useSocket } from "../../../contexts/SocketContext";
import { useAside } from "../../../contexts/AsideContext";
import { onDiscardAnimation } from "../../../lib";

export default function Contact(contact) {
  const { socket } = useSocket();
  const { user, socketAuth } = useUser();
  const { removeContact } = useAside();

  const handleInvit = onDiscardAnimation(() => {
    const inviter = {
      _id: user._id,
      name: user.login.name,
      profile: user.login.profile.path,
      mailbox: user.mailbox,
    };

    removeContact(contact._id);

    socket.emit("send_data", {
      header: {
        senderRoom: user.mailbox,
        receiverRoom: contact.mailbox,
        receiverRoomEvent: "receive_invit",
        auth: socketAuth,
      },
      payload: {
        toDB: {
          action: "sendInvit",
          data: {
            inviter,
            invitee: {
              _id: contact._id,
              name: contact.name,
              profile: contact.profile.path,
              mailbox: contact.mailbox,
            },
          },
        },
        receiverRoomData: {
          inviter,
        },
      },
    });
  });

  return (
    <div className="contact" key={contact._id}>
      <div className="contact-profile">
        <Profile src={contact.profile.objectURL} />
      </div>

      <p className="contact-name">{contact.name}</p>

      <button
        className="contact-invit"
        onClick={e => handleInvit(e, e.target.parentElement)}
      >
        invite
      </button>
    </div>
  );
}
