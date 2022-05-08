import "./form.css";
import { useUser } from "../../contexts/UserContext";
import { useForm } from "../../contexts/FormContext";
import { useSocket } from "../../contexts/SocketContext";
import { useErr } from "../../contexts/ErrContext";
import API from "../../API";
import Inputs from "./inputs";

import { Link } from "react-router-dom";

export default function Signout() {
  const { user, socketAuth } = useUser();
  const { formState, clearFormState, loadingStateSwitch } = useForm();
  const { socket } = useSocket();
  const { err, setErr } = useErr();

  const handleSubmit = async e => {
    e.preventDefault();
    setErr("");

    const { email, password } = formState;

    loadingStateSwitch();

    try {
      socket.emit("broadcast_data", {
        header: {
          senderRoom: user.mailbox,
          receiverRoomEvent: "delete_contact",
          auth: socketAuth,
        },
        payload: {
          receiverData: {
            contactId: user._id,
          },
        },
      });

      await API.account.onSignout(user, { email, password });
      document.location.reload();
      clearFormState();
    } catch (err) {
      console.log(err);

      setErr("Error sign out.");
    } finally {
      loadingStateSwitch();
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="form-wrapper">
        <h1>Sign out</h1>

        <form className="form" id="signout" onSubmit={handleSubmit}>
          {err && <p className="err-msg">{err}</p>}

          <Inputs idPrefix="signout" types={["email", "password"]} />

          <Link to="/new-password">Forgot your password? Click here.</Link>

          <button className="form-btn" id="signout-btn" type="submit">
            Sign out
          </button>
        </form>
      </div>
    </div>
  );
}
