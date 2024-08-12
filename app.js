import van from "vanjs-core";

const { p, div, pre, input } = van.tags;

const domParser = new DOMParser();

const App = () => {
  const html_input = van.state("");

  van.derive(() => {
    let res = domParser.parseFromString(html_input.val, "text/html");
    console.log(res);
  });

  return div(
    input({
      type: "text",
      value: html_input,
      oninput: (e) => (html_input.val = e.target.value),
    }),
    pre("output part:"),
    p(html_input)
  );
};

van.add(document.body, App());
