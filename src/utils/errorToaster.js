import React, { useEffect, useRef } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Bounce } from "react-toastify";

const ErroToaster = ({ message, success }) => {
  const toastIdRef = useRef(null);
  const timeoutRef = useRef(null); // Store timeout reference

  const toastOptions = {
    position: "bottom-center",
    autoClose: 2000,
    hideProgressBar: true,
    closeOnClick: false,
    pauseOnHover: false,
    draggable: false,
    theme: "colored",
    transition: Bounce,
  };
  useEffect(() => {
    if (message) {
      // Prevent multiple toasts
      if (!toastIdRef.current || !toast.isActive(toastIdRef.current)) {
        timeoutRef.current = setTimeout(() => {
          toastIdRef.current = success ? toast.success(message, toastOptions) : toast.error(message, toastOptions);
        }, 50); // 2-second delay before showing toast
      }
    }

    // Cleanup timeout on unmount
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [message]); // Runs only when `message` changes

  return <ToastContainer />;
};

export default ErroToaster;
