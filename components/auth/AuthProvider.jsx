"use client";

import { useMemo, useState } from "react";
import AuthContext from "../../context/AuthContext";
import LoginModal from "./LoginModal";

/** وضعیت احراز هویت + کنترل مودال لاگین — بعدا به سشن/وب‌سرویس وصل می‌شود */
export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loginOpen, setLoginOpen] = useState(false);

  const value = useMemo(
    () => ({
      user,
      isLoggedIn: !!user,
      loginOpen,
      openLogin: () => setLoginOpen(true),
      closeLogin: () => setLoginOpen(false),
      login: (phone) => setUser({ phone }),
      logout: () => setUser(null),
    }),
    [user, loginOpen]
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
      <LoginModal />
    </AuthContext.Provider>
  );
}
