import { useEffect } from "react";

export const useTitle = (title) => {
  useEffect(() => {
    if (title) {
      document.title = `${title} | EVEN`;
    } else {
      document.title = "EVEN - Intelligent tech blog";
    }
  }, [title]);
};
