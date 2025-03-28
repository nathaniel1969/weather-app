import React from "react";

const Favorites = ({ favorites, onSelectFavorite, onRemoveFavorite }) => {
  return (
    <div className="favorites mt-4">
      <h4>Favorites</h4>
      {favorites.length === 0 ? (
        <p>No favorites added yet.</p>
      ) : (
        <ul className="list-group">
          {favorites.map((favorite) => (
            <li
              key={favorite}
              className="list-group-item d-flex justify-content-between align-items-center"
            >
              <button
                className="btn btn-link"
                onClick={() => onSelectFavorite(favorite)}
              >
                {favorite}
              </button>
              <button
                className="btn btn-danger btn-sm"
                onClick={() => onRemoveFavorite(favorite)}
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Favorites;
