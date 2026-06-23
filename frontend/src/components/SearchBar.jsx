import { useState } from 'react';

/**
 * SearchBar — barre de recherche du header.
 * Appelle onSearch(term) lors de la soumission.
 */
function SearchBar({ onSearch }) {
  const [term, setTerm] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(term);
  };

  return (
    <form
      role="search"
      aria-label="Rechercher un artisan"
      className="d-flex search-form"
      onSubmit={handleSubmit}
    >
      <label htmlFor="search-input" className="visually-hidden">
        Rechercher un artisan
      </label>
      <input
        id="search-input"
        type="search"
        className="form-control search-input"
        placeholder="Rechercher un artisan…"
        value={term}
        onChange={(e) => setTerm(e.target.value)}
        aria-label="Rechercher un artisan"
        maxLength={100}
      />
      <button
        type="submit"
        className="btn btn-search ms-2"
        aria-label="Lancer la recherche"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16" aria-hidden="true">
          <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.099zm-5.242 1.156a5.5 5.5 0 1 1 0-11 5.5 5.5 0 0 1 0 11z"/>
        </svg>
      </button>
    </form>
  );
}

export default SearchBar;
