import { useEffect } from "react";
import "./sidebar.css";
import { IconWrapper } from "../index";
import { useHome } from "../../contexts/HomeContext";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";

export default function Sidebar({ id, title, children }) {
  const { toggleClass: slide, removeClassOnExternalClick } = useHome();
  const idSelector = `#${id}`;

  useEffect(
    () => removeClassOnExternalClick(idSelector, "slide"),
    [idSelector, removeClassOnExternalClick]
  );

  return (
    <div id={id} className="sidebar">
      <header className="sidebar-header">
        <h1>{title}</h1>

        <IconWrapper
          Icon={ArrowBackIcon}
          onClick={() => slide(idSelector, "slide")}
        />
      </header>

      {children}
    </div>
  );
}
