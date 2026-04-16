import { useEffect, useState } from "react";

export default function useAuth() {
  const [token, setToken] = useState(localStorage.getItem("token"));

  useEffect(() => {
    const syncAuth = () => {
      setToken(localStorage.getItem("token"));
    };

    window.addEventListener("storage", syncAuth);
    return () => window.removeEventListener("storage", syncAuth);
  }, []);

  return token;
}