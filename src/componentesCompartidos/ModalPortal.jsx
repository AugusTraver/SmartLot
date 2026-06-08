import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";

function ModalPortal({ children, onClose, overlayClassName = "" }) {
  const portalRef = useRef(document.createElement("div"));

  useEffect(() => {
    const el = portalRef.current;
    document.body.appendChild(el);
    document.body.style.overflow = "hidden";
    return () => {
      document.body.removeChild(el);
      document.body.style.overflow = "";
    };
  }, []);

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "Escape") onClose?.();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose]);

  return createPortal(
    <div
      className={`modal-portal-overlay ${overlayClassName}`}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 2000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "rgba(15, 23, 42, 0.5)",
        backdropFilter: "blur(6px)",
        WebkitBackdropFilter: "blur(6px)",
        padding: "20px",
      }}
      onClick={onClose}
    >
      {children}
    </div>,
    portalRef.current
  );
}

export default ModalPortal;
