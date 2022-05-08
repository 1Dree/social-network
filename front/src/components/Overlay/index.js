import "./overlay.css";
// import { useState } from "react";
// import { stateSwitch } from "../../lib";

export default function Overlay({
  display,
  displaySwitch,
  id,
  contentId,
  children,
}) {
  return (
    <div
      className={`overlay ${display ? "fade" : ""}`}
      onClick={displaySwitch}
      id={id}
    >
      <div
        className="overlay-content"
        onClick={e => {
          e.stopPropagation();
        }}
        id={contentId}
      >
        {children}
      </div>
    </div>
  );
}
