"use client"; // Important: This ensures the component is client-side

import ErroToaster from "@/utils/errorToaster";
import Cookies from "js-cookie";
import { SessionProvider } from "next-auth/react";
import { createContext, useContext, useMemo, useState } from "react";

export const UserContext = createContext(null);

export default function Providers({ children }) {
  const [redirect, setRedirect] = useState("null"); 
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useMemo(() => {
    const token = Cookies.get("jwt_token");
    if (!token) {
      setIsLoggedIn(false);
    } else {
      setIsLoggedIn(true);
    }
  }, [isLoggedIn]);
  

  return (
    <SessionProvider>
      <UserContext.Provider value={{ redirect, setRedirect, error, setError, success, setSuccess, setIsLoggedIn, isLoggedIn }}>
        {children}
        {error && <ErroToaster message={error} success={false} />}
        {success && <ErroToaster message={success} success={true} />}
      </UserContext.Provider>
    </SessionProvider>
  );
}

export const useUserContext = () => useContext(UserContext);