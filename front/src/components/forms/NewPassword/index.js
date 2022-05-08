import "../form.css";
import "./newPass.css";
import Inputs from "../inputs";
import { useUser } from "../../../contexts/UserContext";
import { useErr } from "../../../contexts/ErrContext";

import { useNavigate } from "react-router-dom";
import { useForm } from "../../../contexts/FormContext";
import API from "../../../API";

export default function NewPassword() {
  const { user } = useUser();
  const { err, setErr } = useErr();
  const { formState, loadingStateSwitch } = useForm();

  const navigate = useNavigate();

  const handleSubmit = async e => {
    setErr("");
    e.preventDefault();

    const { email, password, rePassword } = formState;

    if (password !== rePassword) {
      setErr("The passwords doesn't match.");
      return;
    }

    loadingStateSwitch();

    try {
      await API.account.newPassword(user, { email, newPassword: password });
      navigate("/login");
    } catch (err) {
      console.log(err);

      setErr("Error defining new password.");
    } finally {
      loadingStateSwitch();
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="form-wrapper new-pass">
        <h1>New Password</h1>

        <form className="form" id="new-pass" onSubmit={handleSubmit}>
          <section>
            <p className="instruction">
              Inform your email so you can define your new password.
            </p>

            <Inputs idPrefix="new-pass" types={["email"]} />
          </section>

          <section>
            <p className="instruction">Define your new password.</p>

            {err && <p className="err-msg">{err}</p>}

            <Inputs idPrefix="new-pass" types={["password"]} />
            <Inputs idPrefix="new-pass-retype" types={["password"]} />

            <button className="form-btn" id="update-profile-btn" type="submit">
              Confirm
            </button>
          </section>
        </form>
      </div>
    </div>
  );
}
