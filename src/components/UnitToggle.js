import React from "react";
import { useUnit } from "../context/UnitContext";

const UnitToggle = () => {
  const { unit, toggleUnit } = useUnit();

  return (
    <div className="form-check form-switch">
      <input
        className="form-check-input"
        type="checkbox"
        id="unitToggle"
        checked={unit === "metric"}
        onChange={toggleUnit}
      />
      <label className="form-check-label" htmlFor="unitToggle">
        {unit === "imperial" ? "°F" : "°C"}
      </label>
    </div>
  );
};

export default UnitToggle;
