import { For, type Component } from "solid-js";

type Props = {
  value: string;
  onInput: (e: Event) => void;
  placeholder?: string;
  autocompleteOptions?: string[];
};

export const InputWithAutocomplete: Component<Props> = (props) => {
  return (
    <div>
      <input
        type="text"
        placeholder={props.placeholder}
        value={props.value}
        onInput={props.onInput}
      />
      <For each={props.autocompleteOptions || []}>
        {(option) => <div>{option}</div>}
      </For>
    </div>
  );
};
