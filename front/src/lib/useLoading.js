import { useState } from "react";
import { WrappedLoading } from "../components";
import { stateSwitch } from "./";

const useLoading = () => {
  const [loading, setLoading] = useState(false);

  const loadingStateSwitch = stateSwitch(setLoading);

  return {
    loading,
    loadingStateSwitch,
    LoadingComponent: WrappedLoading,
  };
};

export default useLoading;
