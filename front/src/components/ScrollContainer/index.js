import { useEffect } from "react";

import "./scrollcontainer.css";

export default function ScrollContainer({ firstName, style, children }) {
  const scrollDisplay = () => {
    const scrollContainerContent = document.querySelector(
      `.${firstName}.scroll-container-content`
    );
    const scrollContainerOverlay = document.querySelector(
      `.${firstName}.scroll-container-overlay.first`
    );

    scrollContainerOverlay.classList.remove("shadow");

    if (
      scrollContainerContent.clientHeight < scrollContainerContent.scrollHeight
    ) {
      scrollContainerOverlay.classList.add("shadow");
    }
  };

  const scrollShadows = ({ target }) => {
    const firstOverlay = document.querySelector(
      `.${firstName}.scroll-container-overlay.first`
    );
    const secondOverlay = document.querySelector(
      `.${firstName}.scroll-container-overlay.second`
    );
    const scrollEnd =
      target.clientHeight + target.scrollTop === target.scrollHeight;

    if (target.scrollTop) {
      secondOverlay.classList.add("shadow");
    } else {
      secondOverlay.classList.remove("shadow");
    }

    if (scrollEnd) {
      firstOverlay.classList.remove("shadow");
    } else {
      firstOverlay.classList.add("shadow");
    }
  };

  useEffect(scrollDisplay, [children, firstName]);

  return (
    <div className={`${firstName} scroll-container`} style={style}>
      <div className={`${firstName} scroll-container-overlay second`} />
      <div className={`${firstName} scroll-container-overlay first`} />

      <div
        className={`${firstName} scroll-container-content`}
        onScroll={scrollShadows}
      >
        {children}
      </div>
    </div>
  );
}
