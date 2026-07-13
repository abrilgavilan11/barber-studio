import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // Cuando el pathname cambia, scrolleamos al inicio de la página sin animación (instantáneo)
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}
