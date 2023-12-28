import { createSignal, createResource, type Component } from "solid-js";

import { getAutocompleteOptions, searchQueryStore } from "../model";
import { InputWithAutocomplete } from "../../../shared/input-with-autocomplete";

import classes from "./search-bar.module.css";

interface Props {
  initialSearch: string;
}

export const SearchBar: Component<Props> = (props) => {
  const [searchQuery, setSearchQuery] = createSignal(props.initialSearch);

  let searchButtonRef: HTMLButtonElement | undefined;

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
    window.history.pushState(
      {},
      "",
      `?search=${encodeURIComponent(searchQuery())}${
        window.location.search.includes("sort-by")
          ? window.location.search
              .slice(1)
              .split("&")
              .filter((param) => param.startsWith("sort-by="))
              .join("&")
          : ""
      }`
    );
  };

  const [autocompleteOptions] = createResource(
    searchQuery,
    getAutocompleteOptions
  );

  // I have no clue how this works. Tried it just for funsies.
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
