import React, { createContext, useState, useContext, useEffect } from "react";
import { User } from "../models/models";

interface GlobalState {
  user: any;
  loading: boolean; // Add a loading state
  setUser: (user: any) => void;
}

const GlobalStateContext = createContext<GlobalState>({
  user: null,
  loading: true, // Initialize loading as true
  setUser: () => {},
});

export const useGlobalState = () => useContext(GlobalStateContext);

export const GlobalStateProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true); // Initialize loading as true

  // On component mount, check localStorage for user data
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false); // Set loading to false once the user data is fetched
  }, []);

  // Update localStorage whenever the user state changes
  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      localStorage.removeItem("user");
    }
  }, [user]);

  return (
    <GlobalStateContext.Provider value={{ user, loading, setUser }}>
      {children}
    </GlobalStateContext.Provider>
  );
};
