import {
  createSignal,
  createResource,
  For,
  Show,
  type Component,
} from "solid-js";
import { useStore } from "@nanostores/solid";

import { searchQueryStore } from "../../search-bar";
import { searchResultsMock, formatDuration, formatDate } from "../model";

import classes from "./search-results.module.css";
import { updateUrlSearchParams } from "../../../shared/update-url-search-params";

import { SORT_BY_OPTIONS } from "../model";

interface Props {
  initialSortBy: string;
}

export const SearchResults: Component<Props> = (props) => {
  const [sortBy, setSortBy] = createSignal(props.initialSortBy);
  const searchQuery = useStore(searchQueryStore);
  const [searchResults] = createResource(searchQuery, searchResultsMock);

  const handleSortByChange = (e: Event) => {
    e.preventDefault();
    searchQueryStore.set(searchQuery());
    updateUrlSearchParams({ "sort-by": sortBy() });
  };

  const sortedResults = () => {
    return searchResults()?.sort((a, b) => {
      if (sortBy() === SORT_BY_OPTIONS.MOST_RECENT) {
        return (
          new Date(b.publish_date).getTime() -
          new Date(a.publish_date).getTime()
        );
      }
      if (sortBy() === SORT_BY_OPTIONS.OLDEST) {
        return (
          new Date(a.publish_date).getTime() -
          new Date(b.publish_date).getTime()
        );
      }
      return 0;
    });
  };

  return (
    <Show when={searchQuery() !== ""}>
      <div class={classes["top-bar"]}>
        <h2 class={classes.heading}>Search results for "{searchQuery()}":</h2>
        <form class={classes["sort-by-group"]}>
          <legend class={classes["sort-by-legend"]}>Sort by</legend>
          <select
            name="sort-by"
            class={classes["sort-by-select"]}
            onChange={(e) => {
              setSortBy(e.target.value);
              handleSortByChange(e);
            }}
          >
            <option
              value={SORT_BY_OPTIONS.MOST_RECENT}
              selected={sortBy() === SORT_BY_OPTIONS.MOST_RECENT}
            >
              Most recent
            </option>
            <option
              value={SORT_BY_OPTIONS.OLDEST}
              selected={sortBy() === SORT_BY_OPTIONS.OLDEST}
            >
              Oldest
            </option>
          </select>
        </form>
      </div>
      <div class={classes["results-container"]}>
        <For each={sortedResults()}>
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
