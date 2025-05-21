# slidev-addon-typst

[Typst](http://typst.app/) addon for [Slidev](https://sli.dev/).

## Installation

```bash
npm i slidev-addon-typst
```

Then add the `addons` option in your [headmatter](https://sli.dev/custom/#headmatter):

```yaml
---
addons:
  - slidev-addon-typst
---
```

## Usage

Use `typst` code block to write typst code:

````md
```typst
#import "@preview/fletcher:0.5.7" as fletcher: diagram, edge

#html.frame(diagram($
  G edge(f, ->) edge("d", pi, ->>) & im(f) \
  G slash ker(f) edge("ur", tilde(f), "hook-->")
$))
```
````
