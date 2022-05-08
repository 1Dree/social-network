import "./expiredaccess.css";
import { useUser } from "../../contexts/UserContext";

import { Link, Navigate } from "react-router-dom";

export default function ExpiredAccess() {
  const { expiredAccess, setExpiredAccess } = useUser();

  return expiredAccess ? (
    <div id="exp-access-screen">
      <div id="exp-access-screen-content">
        <h1>Access expired</h1>
        <p onClick={() => setExpiredAccess(false)}>
          Your access has ben expired.
          <Link to="/login">Log in again to renew it.</Link>
        </p>
      </div>
    </div>
  ) : (
    <Navigate replace to="/" />
  );
}
