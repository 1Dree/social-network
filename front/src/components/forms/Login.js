import "./form.css";
import { useUser } from "../../contexts/UserContext";
import { useErr } from "../../contexts/ErrContext";
import { useSocket } from "../../contexts/SocketContext";
import { useForm } from "../../contexts/FormContext";
import Inputs from "./inputs";
import API from "../../API";

import { Link, useNavigate } from "react-router-dom";

export default function Login() {
  const { connSocket } = useSocket();
  const { setUser } = useUser();
  const { formState, loadingStateSwitch } = useForm();
  const { err, setErr } = useErr();
  const navigate = useNavigate();

  const handleSubmit = async e => {
    setErr("");
    e.preventDefault();

    const { email, password } = formState;

    loadingStateSwitch();

    try {
      const socket = await connSocket();
      await API.account.onLogin(setUser, { email, password }, socket);
      navigate("/home");
    } catch (err) {
      setErr("Error login in");
    } finally {
      loadingStateSwitch();
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="form-wrapper">
        <h1>Login</h1>

        <form className="form" id="login" onSubmit={handleSubmit}>
          {err && <p className="err-msg">{err}</p>}

          <Inputs idPrefix="login" types={["email", "password"]} />

          <Link to="/new-password">Forgot your password?</Link>

          <button className="form-btn" id="login-btn" type="submit">
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
