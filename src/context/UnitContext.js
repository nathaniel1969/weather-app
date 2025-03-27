import React, { createContext, useState, useContext, useCallback } from "react";

const UnitContext = createContext();

export const useUnit = () => useContext(UnitContext);

export const UnitProvider = ({ children }) => {
  const [unit, setUnit] = useState("imperial"); // Default to imperial

  const toggleUnit = useCallback(() => {
    setUnit((prevUnit) => (prevUnit === "imperial" ? "metric" : "imperial"));
  }, []);

  const value = { unit, toggleUnit };

  return <UnitContext.Provider value={value}>{children}</UnitContext.Provider>;
};
