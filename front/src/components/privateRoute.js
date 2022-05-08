import { useUser } from "../contexts/UserContext";

import { Navigate } from "react-router-dom";

export default function privateRoute(Element) {
  return () => {
    const { user } = useUser();

    return user._id ? <Element /> : <Navigate to="/" />;
  };
}
