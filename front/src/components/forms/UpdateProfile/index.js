import "../form.css";
import "./updateProfile.css";
import Inputs from "../inputs";

import { useUser } from "../../../contexts/UserContext";
import { useForm } from "../../../contexts/FormContext";
import { useErr } from "../../../contexts/ErrContext";
import { useSocket } from "../../../contexts/SocketContext";
import API from "../../../API";

import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { useNavigate } from "react-router-dom";

export default function UpdateProfile() {
  const { err, setErr } = useErr();
  const { socket } = useSocket();
  const { user, setUser, socketAuth } = useUser();
  const { formState, loadingStateSwitch } = useForm();
  const navigate = useNavigate();

  const translate = e => {
    e.stopPropagation();
    const forms = document.querySelectorAll("#form-slide form");

    forms.forEach(form => form.classList.toggle("translate"));
  };

  const handleIdentification = async e => {
    e.preventDefault();

    try {
      await API.account.identification(user, setUser, {
        email: user.login.email,
        password: formState.authpassword,
      });

      translate(e);
    } catch (err) {
      console.log(err);
    }
  };

  const handleSubmit = async e => {
    setErr("");
    e.preventDefault();

    const { authpassword, name, email, password } = formState;

    const values = { name, email, password };
    const valuesEntries = Object.keys(values);

    const update = valuesEntries.reduce((acc, key) => {
      if (values[key] !== "") acc[key] = values[key];

      return acc;
    }, {});

    const isEmpty = !Object.keys(update).length;

    if (isEmpty) {
      setErr("There is nothing to update");
      return;
    }

    if (update.email && user.login.email === email) {
      setErr("The entered email is identical to the current one");

      return;
    } else if (update.password && authpassword === password) {
      setErr("The entered password is identical to the current one");

      return;
    }

    loadingStateSwitch();

    try {
      if (update.name) {
        socket.emit("broadcast_data", {
          header: {
            senderRoom: user.mailbox,
            receiverRoomEvent: "contact_name_update",
            auth: socketAuth,
          },
          payload: {
            receiverData: {
              contact: {
                _id: user._id,
                name: update.name,
              },
            },
          },
        });
      }

      await API.account.updateProfile(user, setUser, update);
      navigate("/account");
    } catch (err) {
      console.log(err);

      setErr("Error updating profile");
    } finally {
      loadingStateSwitch();
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="form-wrapper update">
        <h1>Update Proflie</h1>

        <div id="form-slide">
          <form className="form" onSubmit={handleIdentification}>
            <p className="instruction">Inform your password.</p>

            <Inputs idPrefix="update-auth" types={["password"]} />

            <button id="update-profile-btn" type="submit">
              <ArrowForwardIcon color="primary" />
            </button>
          </form>

          <form className="form" onSubmit={handleSubmit}>
            <p className="instruction">
              Update your profile. If you don't want to update one of these
              fields, just leave it blank.
            </p>
            {err && <p className="err-msg">{err}</p>}

            <Inputs
              idPrefix="update"
              types={["name", "email", "password"]}
              required={[false, false, false]}
            />

            <div id="final-options">
              <button className="form-btn" type="submit">
                Save
              </button>
              <p onClick={translate}>back</p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
