import React, { useState, useEffect, useRef, useCallback } from "react";
import { searchLocations } from "../api";

const SearchBar = ({ onSearch }) => {
  const [location, setLocation] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchBarRef = useRef(null);
  const inputRef = useRef(null);
  const suggestionsListRef = useRef(null);

  const fetchSuggestions = useCallback(async () => {
    if (location.length > 2) {
      const results = await searchLocations(location);
      setSuggestions(results);
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [location]);

  useEffect(() => {
    const debounce = setTimeout(() => {
      fetchSuggestions();
    }, 300); // Debounce for 300ms

    return () => {
      clearTimeout(debounce);
    };
  }, [fetchSuggestions]);

  const handleSubmit = useCallback(
    (event) => {
      event.preventDefault();
      if (suggestions.length > 0) {
        onSearch(suggestions[0].url); // Use the url for the search
      } else {
        onSearch(location); // Fallback to the location name if no suggestions
      }
      setLocation("");
      setSuggestions([]);
      setShowSuggestions(false);
    },
    [suggestions, location, onSearch]
  );

  const handleSuggestionClick = useCallback(
    (suggestion) => {
      setLocation("");
      onSearch(suggestion.url); // Use the url for the search
      setSuggestions([]);
      setShowSuggestions(false);
      if (inputRef.current) {
        inputRef.current.focus();
      }
    },
    [onSearch]
  );

  const handleInputChange = useCallback((e) => {
    setLocation(e.target.value);
  }, []);

  const handleBlur = useCallback(() => {
    setTimeout(() => {
      if (
        searchBarRef.current &&
        !searchBarRef.current.contains(document.activeElement)
      ) {
        setShowSuggestions(false);
      }
    }, 100);
  }, []);

  useEffect(() => {
    if (suggestionsListRef.current) {
      suggestionsListRef.current.setAttribute("aria-expanded", showSuggestions);
    }
  }, [showSuggestions]);

  return (
    <div
      className="search-bar"
      ref={searchBarRef}
      onBlur={handleBlur}
      tabIndex={0}
    >
      <form onSubmit={handleSubmit} className="mb-4">
        <div className="input-group">
          <label htmlFor="locationSearch" className="visually-hidden">
            Search for a location
          </label>
          <input
            type="text"
            id="locationSearch"
            className="form-control"
            placeholder="City, State, Country"
            value={location}
            onChange={handleInputChange}
            onFocus={() => setShowSuggestions(true)}
            aria-autocomplete="list"
            aria-owns="suggestionsList"
            ref={inputRef}
          />
          <button type="submit" className="btn btn-primary">
            Search
          </button>
        </div>
      </form>
      {showSuggestions && suggestions.length > 0 && (
        <ul
          className="list-group"
          id="suggestionsList"
          role="listbox"
          ref={suggestionsListRef}
        >
          {suggestions.map((suggestion) => (
            <li
              key={suggestion.id}
              className="list-group-item list-group-item-action"
              onMouseDown={() => handleSuggestionClick(suggestion)}
              role="option"
              aria-selected="false"
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
