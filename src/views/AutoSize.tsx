import React, { useEffect, useLayoutEffect, useState } from "react";

import { throttle } from "throttle-debounce";

interface AutoSizeProps {
  children: (size: { height: number }) => React.ReactNode;
}

export const AutoSize: React.FC<AutoSizeProps> = ({ children }) => {
  const [height, setHeight] = useState<number>(0);
  useLayoutEffect(() => {
    /**
     * Hard coding the element for productivity.
     */
    const pageRoot = document.querySelector(".pageRoot");
    let pageRootHeight = 0;
    if (pageRoot !== null) pageRootHeight = pageRoot.clientHeight;
    const onResize = throttle(100, (e) => {
      if (height !== pageRootHeight) setHeight(pageRootHeight);
    });
    onResize(window);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);
  return <>{children({ height })}</>;
};
