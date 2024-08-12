import van from "vanjs-core";
import * as htmlparser2 from "htmlparser2";

const { button, div, pre, textarea } = van.tags;

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
  const html_input =
    van.state(`<blockquote lang="zh" cite="https://g0v.social/@dannypsnl/112946647273534525">
  <p>schema 在軟體端的型別都讓人有點失望，直接做成</p><p>table Book<br />  name : string<br />  isbn : string       add(1)<br />  url: string           remove(2)</p><p>標記對欄位的修正就好了</p>
  <footer>
     — Lîm Tsú-thuàn (@dannypsnl) <a href="https://g0v.social/@dannypsnl/112946647273534525"><time datetime="2024-08-12T02:17:46.064Z">8/12/2024, 10:17:46 AM</time></a>
  </footer>
</blockquote>`);
  const output_tree = van.derive(() => html2tree(html_input.val));

  return div(
    textarea({
      value: html_input,
      oninput: (e) => (html_input.val = e.target.value),
    }),
    pre(output_tree),
    button(
      {
        onclick: () => {
          navigator.clipboard.writeText(output_tree.val);
          alert("copied!");
        },
      },
      "copy"
    )
  );
};

van.add(document.body, App());
