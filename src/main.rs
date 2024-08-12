use std::fs::read_to_string;

use html_parser::*;

fn main() {
    let args: Vec<_> = std::env::args().collect();
    let s = read_to_string(args[1].clone()).expect("failed");
    let dom = Dom::parse(s.as_str()).unwrap();

    let mut ts = vec![];
    for n in dom.children {
        match n {
            Node::Element(e) => ts.push(convert(e)),
            _ => (),
        }
    }

    for t in ts {
        println!("{}", t);
    }
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
            Node::Element(_) | Node::Text(_) => true,
            _ => false,
        })
        .map(|c| match c {
            Node::Element(e) => Children::Elem(convert(e)),
            Node::Text(s) => Children::Text(s),
            _ => unreachable!(),
        })
        .collect::<Vec<Children>>();

    t
}

enum Children {
    Text(String),
    Elem(TreeNode),
}

struct TreeNode {
    name: String,
    attrs: Vec<(String, String)>,
    children: Vec<Children>,
}

impl std::fmt::Display for Children {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        match self {
            Children::Text(s) => write!(f, "{}", s),
            Children::Elem(e) => write!(f, "{}", e),
        }
    }
}

impl std::fmt::Display for TreeNode {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        write!(f, "\\<html:{}>", self.name)?;

        for (k, v) in &self.attrs {
            write!(f, "[{}]{{{}}}", k, v)?;
        }

        write!(f, "{{")?;

        for c in &self.children {
            write!(f, "{}", c)?;
        }

        write!(f, "}}")?;
        Ok(())
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
