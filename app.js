import van from "vanjs-core";
import * as htmlparser2 from "htmlparser2";
import { svg as example } from "./example";

const { h1, code, button, div, pre, input, textarea, p, label } = van.tags;

const html2tree = (str) => {
  let res = ``;
  const parser = new htmlparser2.Parser({
    onopentagname: (name) => (res += `\\<html:${name}>`),
    onattribute: (name, value) => (res += `[${name}]{${value}}`),
    onopentag: (_name, _attrs) => (res += `{`),
    ontext: (text) => (res += text),
    onclosetag: (_) => (res += `}`),
  });

  parser.write(str);
  parser.end();
  return res;
};

const App = () => {
  const html_input = van.state(example);
  const add_xmlns = van.state(true);
  const output_tree = van.derive(
    () =>
      (add_xmlns.val ? `\\xmlns:html{http://www.w3.org/1999/xhtml}\n\n` : ``) +
      html2tree(html_input.val)
  );

  return div(
    h1("html2tree"),
    p(
      `Put HTML into the textarea, then copy the forester tree right hand side.`
    ),
    input({
      type: `checkbox`,
      id: `add-namespace`,
      onclick: () => {
        add_xmlns.val = !add_xmlns.val;
      },
    }),
    label({ for: `add-namespace` }, `disable inserted namespace`),
    div(
      textarea({
        value: html_input,
        oninput: (e) => (html_input.val = e.target.value),
      }),
      pre(
        code(output_tree),
        button(
          {
            onclick: () => {
              navigator.clipboard.writeText(output_tree.val);
              alert(`copied!`);
            },
          },
          `copy`
        )
      )
    )
  );
};

van.add(document.body, App());
