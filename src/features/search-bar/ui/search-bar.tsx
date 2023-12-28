import { createSignal, createResource, type Component } from "solid-js";

import { getAutocompleteOptions, searchQueryStore } from "../model";
import { InputWithAutocomplete } from "../../../shared/input-with-autocomplete";
import { updateUrlSearchParams } from "../../../shared/update-url-search-params";

import classes from "./search-bar.module.css";

interface Props {
  initialSearch: string;
}

export const SearchBar: Component<Props> = (props) => {
  let searchButtonRef: HTMLButtonElement | undefined;
  const [searchQuery, setSearchQuery] = createSignal(props.initialSearch);

  const handleInputChange = (e: Event) => {
    setSearchQuery((e.target as HTMLInputElement).value);
  };

  const handleSearchSubmit = (e: Event) => {
    e.preventDefault();
    searchQueryStore.set(searchQuery());
    updateUrlSearchParams({ search: searchQuery() });
  };

  const [autocompleteOptions] = createResource(
    searchQuery,
    getAutocompleteOptions
  );

  // I have no clue how this works
  // But it's required to prevent hydration mismatch
  setTimeout(() => {
    searchQueryStore.set(searchQuery());
  });

  return (
    <form onSubmit={handleSearchSubmit} class={classes.form}>
      <label for="video-search" class="visually-hidden">
        Search
      </label>
      <a href="/" class={classes["logo-link"]}>
        <span class="visually-hidden">To main page</span>
        <img src="/deo-vr-logo.png" width="90" alt="" />
      </a>
      <div class={classes["input-wrapper"]}>
        <InputWithAutocomplete
          class={classes["search-input"]}
          id="video-search"
          placeholder="Search..."
          value={searchQuery()}
          setValue={setSearchQuery}
          onInput={handleInputChange}
          onSuggestionClick={() => {
            searchButtonRef?.focus();
          }}
          autocompleteOptions={autocompleteOptions()}
        />
        <button
          type="submit"
          class={classes["search-button"]}
          ref={searchButtonRef}
        >
          <span class="visually-hidden">Search</span>
          <img src="/search-icon.svg" width="20" alt="" />
        </button>
      </div>
    </form>
  );
};
