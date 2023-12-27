import { createResource, For, Show } from "solid-js";
import { useStore } from "@nanostores/solid";

import { searchQueryStore } from "../../search";
import { searchResultsMock, formatDuration, formatDate } from "../model";

import classes from "./search-results.module.css";

export const SearchResults = () => {
  const searchQuery = useStore(searchQueryStore);

  const [searchResults] = createResource(searchQuery, searchResultsMock);

  return (
    <Show when={searchQuery() !== ""}>
      <div class={classes["top-bar"]}>
        <h2 class={classes.heading}>Search results for "{searchQuery()}":</h2>
        <form class={classes["sort-by-group"]}>
          <legend>Sort by</legend>
          <select>
            <option value="most-recent">Most recent</option>
            <option value="oldest">Oldest</option>
          </select>
        </form>
      </div>
      <div class={classes["results-container"]}>
        <For each={searchResults()}>
          {(result) => (
            <div class={classes["results-item"]}>
              <img
                class={classes["item-img"]}
                src={result.thumbnail}
                width="300"
                height="200"
                alt=""
              />
              <div class={classes["item-bottom"]}>
                <div>
                  {result.title} ({formatDuration(result.duration)})
                </div>
                <div>{formatDate(result.publish_date)}</div>
              </div>
            </div>
          )}
        </For>
      </div>
      <div class={classes["results-count"]}>
        {searchResults()?.length} items found
      </div>
    </Show>
  );
};
