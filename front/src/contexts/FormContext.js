import { createContext, useContext, useState, useEffect, useMemo } from "react";
import { clearState, stateSwitch } from "../lib";
import { useErr } from "./ErrContext";
import { WrappedLoading } from "../components";
import useLoading from "../lib/useLoading";

import { useLocation, Outlet } from "react-router-dom";

const FormContext = createContext();

export const useForm = () => useContext(FormContext);

const initialFormState = {
  name: "",
  email: "",
  password: "",
  rePassword: "",
  authemail: "",
  authpassword: "",
};

export default function FormProvider({ children }) {
  const [formState, setFormState] = useState(initialFormState);
  const { loading, loadingStateSwitch, LoadingComponent } = useLoading();

  const { setErr } = useErr();

  const location = useLocation();

  const clearFormState = clearState(initialFormState, setFormState);

  const value = {
    formState,
    setFormState,
    clearFormState,
    loadingStateSwitch,
  };

  useEffect(() => {
    setErr("");
    clearFormState();
  }, [location]);

  return (
    <FormContext.Provider value={value}>
      {loading ? <LoadingComponent /> : children}

      <Outlet />
    </FormContext.Provider>
  );
}
