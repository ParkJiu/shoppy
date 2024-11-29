import React, { createContext, useContext, useEffect, useState } from "react";
import {
  login as firebaseLogin,
  logout as firebaseLogout,
  onUserStateChange,
} from "../api/firebase.js";
export const LoginApiContext = createContext();

export function LoginApiProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    onUserStateChange(setUser);
  }, []);

  return (
    <LoginApiContext.Provider
      value={{ user, login: firebaseLogin, logout: firebaseLogout }}
    >
      {children}
    </LoginApiContext.Provider>
  );
}

export function useLoginApi() {
  return useContext(LoginApiContext); // LoginApiContext의 데이터를 가져와 반환
}
