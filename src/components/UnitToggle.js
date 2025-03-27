import React from "react";
import { useUnit } from "../context/UnitContext";

const UnitToggle = React.memo(() => {
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
        {unit === "imperial" ? "Imperial" : "Metric"}
      </label>
    </div>
  );
});

export default UnitToggle;
