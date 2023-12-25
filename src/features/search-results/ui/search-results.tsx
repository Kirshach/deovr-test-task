import { useStore } from "@nanostores/solid";

import { searchQueryStore } from "../../search";

export const SearchResults = () => {
  const searchQuery = useStore(searchQueryStore);

  return (
    <div>
      <h2>Search results</h2>
      {searchQuery()}
    </div>
  );
};
