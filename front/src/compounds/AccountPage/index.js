import "./accountpage.css";
import AccountPageProfile from "./AccountPageProfile";
import { useUser } from "../../contexts/UserContext";
import { Link, useNavigate } from "react-router-dom";

export default function AccountPage() {
  const { user, clearUserState } = useUser();
  const navigate = useNavigate();

  const onLogout = () => {
    clearUserState();
    navigate("/");
  };

  return (
    <div id="account-page-container">
      <header id="account-page-header">
        <h1>Your Account</h1>
      </header>

      <div id="account-page-content">
        <AccountPageProfile />

        <h2>{user.login.name}</h2>

        <div id="account-page-actions">
          <ul>
            <li>
              <Link to="/update-profile">Update Profile</Link>
            </li>
            <li onClick={onLogout}>Log out</li>
            <li>
              <Link to="/home">back to home</Link>
            </li>
            <li id="delete">
              <Link to="/signout">Delete Account</Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
