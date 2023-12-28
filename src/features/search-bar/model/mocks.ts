import { LATENCY, VOWELS, CONSONANTS } from "./constants";

const generateSuggestion = (query: string) => {
  let newSuggestion = query;

  while (0.07 < Math.random()) {
    const lastLetter = newSuggestion[newSuggestion.length - 1];

    if (lastLetter !== " " && Math.random() < 0.2) {
      newSuggestion += " ";
      continue;
    }

    if (VOWELS.includes(lastLetter)) {
      newSuggestion +=
        CONSONANTS[Math.floor(Math.random() * CONSONANTS.length)];
    } else {
      newSuggestion += VOWELS[Math.floor(Math.random() * VOWELS.length)];
    }
  }

  return newSuggestion;
};

export const getAutocompleteOptions = (searchQuery: string) => {
  if (searchQuery.length === 0) return Promise.resolve([]);

  const optionsLength =
    searchQuery.length > 11 ? 1 : searchQuery.length > 6 ? 3 : 5;

  return new Promise<string[]>((resolve) => {
    setTimeout(() => {
      resolve(
        Array.from({ length: optionsLength })
          .map(() => generateSuggestion(searchQuery))
          .sort((a, b) => {
            return b.length - a.length;
          })
      );
    }, LATENCY);
  });
};
