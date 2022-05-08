import "./wrappedloading.css";
import { CircularProgress } from "@mui/material";

export default function WrappedLoading() {
  return (
    <div id="loading-wrapper">
      <CircularProgress />
    </div>
  );
}
