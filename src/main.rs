use std::fs::read_to_string;

use html_parser::*;

fn main() {
    let s = read_to_string("test.html").expect("failed");
    let dom = Dom::parse(s.as_str()).unwrap();

    let mut ts = vec![];
    for n in dom.children {
        match n {
            Node::Element(e) => ts.push(convert(e)),
            _ => todo!(),
        }
    }

    println!("{:?}", ts);
}

fn convert(c: Element) -> TreeNode {
    let mut t: TreeNode = Default::default();

    t.name = c.name;

    for (key, value) in c.attributes {
        t.attrs.push((key, value.unwrap_or("".to_string())));
    }

    t.children = c
        .children
        .into_iter()
        .filter(|c| match c {
            Node::Element(_) => true,
            _ => false,
        })
        .map(|c| match c {
            Node::Element(e) => convert(e),
            _ => unreachable!(),
        })
        .collect::<Vec<TreeNode>>();

    t
}

struct TreeNode {
    name: String,
    attrs: Vec<(String, String)>,
    children: Vec<TreeNode>,
}

impl std::fmt::Debug for TreeNode {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        f.debug_struct("TreeNode")
            .field("name", &self.name)
            .field("attrs", &self.attrs)
            .field("children", &self.children)
            .finish()
    }
}

impl Default for TreeNode {
    fn default() -> Self {
        Self {
            name: String::new(),
            attrs: vec![],
            children: vec![],
        }
    }
}
