import { createSignal, createResource } from "solid-js";

import { getAutocompleteOptions, searchQueryStore } from "../model";
import { InputWithAutocomplete } from "../../../shared/input-with-autocomplete";

export const SearchBar = () => {
  const [searchQuery, setSearchQuery] = createSignal("");

  const handleInputChange = (e: Event) => {
    if (!(e.target instanceof HTMLInputElement)) {
      console.error("Event target is not an HTMLInputElement", e.target);
      return;
    }
    setSearchQuery(e.target.value);
  };

  const handleSearchSubmit = (e: Event) => {
    e.preventDefault();
    searchQueryStore.set(searchQuery());
  };

  const [autocompleteOptions] = createResource(
    searchQuery,
    getAutocompleteOptions
  );

  return (
    <form onSubmit={handleSearchSubmit}>
      <label for="TODO">Search</label>
      <InputWithAutocomplete
        placeholder="Search..."
        value={searchQuery()}
        onInput={handleInputChange}
        autocompleteOptions={autocompleteOptions()}
      />
      <button type="submit">Search</button>
    </form>
  );
};
