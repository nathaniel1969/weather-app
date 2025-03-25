import React, { createContext, useState, useContext } from "react";

const UnitContext = createContext();

export const useUnit = () => useContext(UnitContext);

export const UnitProvider = ({ children }) => {
  const [unit, setUnit] = useState("imperial"); // Default to imperial

  const toggleUnit = () => {
    setUnit(unit === "imperial" ? "metric" : "imperial");
  };

  return (
    <UnitContext.Provider value={{ unit, toggleUnit }}>
      {children}
    </UnitContext.Provider>
  );
};
