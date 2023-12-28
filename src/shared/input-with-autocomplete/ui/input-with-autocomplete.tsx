import {
  For,
  Show,
  createSignal,
  onMount,
  onCleanup,
  type Component,
} from "solid-js";

import classes from "./input-with-autocomplete.module.css";

type Props = {
  class?: string;
  id: string;
  value: string;
  setValue: (value: string) => void;
  onInput: (e: Event) => void;
  placeholder?: string;
  autocompleteOptions?: string[];
  onSuggestionClick?: () => void;
};

export const InputWithAutocomplete: Component<Props> = (props) => {
  const [showSuggestions, setShowSuggestions] = createSignal(false);

  let suggestionsRef: HTMLOListElement | undefined;
  let inputRef: HTMLInputElement | undefined;
  let wrapperRef: HTMLDivElement | undefined;

  const clickListener = (e: MouseEvent) => {
    if (!showSuggestions()) return;
    let currentParent = e.target as HTMLElement;
    while (currentParent && currentParent !== document.body) {
      if (currentParent === wrapperRef) {
        return;
      }
      currentParent = currentParent?.parentNode as HTMLElement;
    }
    setShowSuggestions(false);
  };

  const keyDownHandler = (e: KeyboardEvent) => {
    if (!showSuggestions()) {
      return;
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (!suggestionsRef) {
        return;
      }
      let nextSuggestion: HTMLElement | null = suggestionsRef.querySelector(
        `.${classes.suggestion}:focus`
      )?.nextElementSibling as HTMLElement | null;

      if (!nextSuggestion) {
        nextSuggestion = suggestionsRef.querySelector(
          `.${classes.suggestion}:first-child`
        );
      }

      nextSuggestion?.focus();
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (!suggestionsRef) {
        return;
      }
      let previousSuggestion: HTMLElement | null = suggestionsRef.querySelector(
        `.${classes.suggestion}:focus`
      )?.previousElementSibling as HTMLElement | null;
      if (!previousSuggestion) {
        previousSuggestion = suggestionsRef.querySelector(
          `.${classes.suggestion}:last-child`
        );
      }
      previousSuggestion?.focus();
    } else if (e.key === "Enter") {
      if (!suggestionsRef) {
        return;
      }
      const focusedSuggestion: HTMLElement | null =
        suggestionsRef.querySelector(`.${classes.suggestion}:focus`);
      if (focusedSuggestion) {
        e.preventDefault();
        focusedSuggestion.click();
      }
    }
  };

  onMount(() => {
    document.addEventListener("click", clickListener);
    document.addEventListener("keydown", keyDownHandler);
  });

  onCleanup(() => {
    // I'm not at all sure if this is the proper way of doing this
    // Assuming this has to do with Astro's SSR, but not sure why onCleanup fires
    if (typeof document !== "undefined") {
      document.removeEventListener("click", clickListener);
      document.removeEventListener("keydown", keyDownHandler);
    }
  });

  return (
    <div class={`${classes.wrapper} ${props.class}`} ref={wrapperRef}>
      <input
        ref={inputRef}
        id={props.id}
        type="text"
        placeholder={props.placeholder}
        value={props.value}
        class={classes.input}
        onFocus={() => setShowSuggestions(true)}
        onInput={props.onInput}
      />
      <Show when={showSuggestions()}>
        <ol
          class={classes["suggestions-list"]}
          ref={suggestionsRef}
          aria-live="polite"
          role="listbox"
        >
          <For each={props.autocompleteOptions}>
            {(option) => (
              <li
                role="option"
                class={classes.suggestion}
                onClick={() => {
                  setShowSuggestions(false);
                  props.setValue(option);
                  props.onSuggestionClick?.();
                }}
                tabIndex={0}
              >
                {option}
              </li>
            )}
          </For>
        </ol>
      </Show>
    </div>
  );
};
