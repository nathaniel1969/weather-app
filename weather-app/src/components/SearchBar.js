import React, { useState } from "react";

const SearchBar = ({ onSearch }) => {
  const [location, setLocation] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    onSearch(location);
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4">
      <div className="input-group">
        <input
          type="text"
          className="form-control"
          placeholder="City, State, Country"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />
        <button type="submit" className="btn btn-primary">
          Search
        </button>
      </div>
    </form>
  );
};

export default SearchBar;
