import "./form.css";
import { useUser } from "../../contexts/UserContext";
import { useSocket } from "../../contexts/SocketContext";
import { useErr } from "../../contexts/ErrContext";
import { useForm } from "../../contexts/FormContext";
import Inputs from "./inputs";
import API from "../../API";

import { Link, useNavigate, Navigate } from "react-router-dom";

export default function Signup() {
  const { user, setUser } = useUser();
  const { connSocket } = useSocket();
  const { formState, loadingStateSwitch } = useForm();
  const { setErr, err } = useErr();
  const navigate = useNavigate();

  const handleSubmit = async e => {
    setErr("");
    e.preventDefault();

    const socket = await connSocket();
    const { name, email, password, rePassword } = formState;

    if (password !== rePassword) {
      setErr("Passwords doesn't match");

      return;
    }

    loadingStateSwitch();

    try {
      await API.account.onSignup(setUser, { name, email, password }, socket);

      navigate("/home");
    } catch (err) {
      console.log(err);
      setErr("Erros signing up");
    } finally {
      loadingStateSwitch();
    }
  };

  return (
    <div className="auth-wrapper">
      {user._id && <Navigate to="/home" />}

      <div className="form-wrapper">
        <h1>Sign up</h1>

        <form className="form" id="signup" onSubmit={handleSubmit}>
          {err && <p className="err-msg">{err}</p>}

          <Inputs idPrefix="signup" types={["text", "email", "password"]} />
          <Inputs idPrefix="signup-retype" types={["password"]} />

          <div>
            <button
              className="form-btn"
              id="signup-btn"
              type="submit"
              style={{ marginBottom: "10px" }}
            >
              Sign up
            </button>
            <Link to="/login">Already have an account? Click here.</Link>
          </div>
        </form>
      </div>
    </div>
  );
}
