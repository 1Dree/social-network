import { createContext, useContext, useState } from "react";

const ErrContext = createContext();

export const useErr = () => useContext(ErrContext);

export default function ErrProvider({ children }) {
  const [err, setErr] = useState("");

  const value = { err, setErr };

  return <ErrContext.Provider value={value}>{children}</ErrContext.Provider>;
}
