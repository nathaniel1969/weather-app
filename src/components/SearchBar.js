import React, { useState, useEffect, useRef } from "react";
import { searchLocations } from "../api";

const SearchBar = ({ onSearch }) => {
  const [location, setLocation] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchBarRef = useRef(null);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (location.length > 2) {
        const results = await searchLocations(location);
        setSuggestions(results);
        setShowSuggestions(true);
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    };

    const debounce = setTimeout(() => {
      fetchSuggestions();
    }, 300); // Debounce for 300ms

    return () => {
      clearTimeout(debounce);
    };
  }, [location]);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (suggestions.length > 0) {
      onSearch(suggestions[0].url); // Use the url for the search
    } else {
      onSearch(location); // Fallback to the location name if no suggestions
    }
    setShowSuggestions(false);
  };

  const handleSuggestionClick = (suggestion) => {
    setLocation(
      suggestion.name + ", " + suggestion.region + ", " + suggestion.country
    ); // Update the input with the full location name
    onSearch(suggestion.url); // Use the url for the search
    setSuggestions([]);
    setShowSuggestions(false);
  };

  const handleInputChange = (e) => {
    setLocation(e.target.value);
  };

  const handleBlur = () => {
    setTimeout(() => {
      if (
        searchBarRef.current &&
        !searchBarRef.current.contains(document.activeElement)
      ) {
        setShowSuggestions(false);
      }
    }, 100);
  };

  return (
    <div
      className="search-bar"
      ref={searchBarRef}
      onBlur={handleBlur}
      tabIndex={0}
    >
      <form onSubmit={handleSubmit} className="mb-4">
        <div className="input-group">
          <input
            type="text"
            className="form-control"
            placeholder="City, State, Country"
            value={location}
            onChange={handleInputChange}
            onFocus={() => setShowSuggestions(true)}
          />
          <button type="submit" className="btn btn-primary">
            Search
          </button>
        </div>
      </form>
      {showSuggestions && suggestions.length > 0 && (
        <ul className="list-group">
          {suggestions.map((suggestion) => (
            <li
              key={suggestion.id}
              className="list-group-item list-group-item-action"
              onMouseDown={() => handleSuggestionClick(suggestion)}
            >
              {suggestion.name}, {suggestion.region}, {suggestion.country}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchBar;
