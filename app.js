import van from "vanjs-core";

const { button, div, pre, input } = van.tags;

const App = () => {
  return div(
    input({ type: "text", value: "", onInput: function () {} }),
    pre("output part")
  );
};

van.add(document.body, App());
