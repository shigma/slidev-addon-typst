---
theme: seriph
background: null
highlighter: shiki
css: unocss
mdc: true
transition: fade
colorSchema: light
---

# slidev-addon-typst

Typst addon for Slidev {.mt-4!}

---

# Usage

<div/>

Install the addon via npm:

```bash
npm i slidev-addon-typst
```

Add the `addons` option in your [headmatter](https://sli.dev/custom/#headmatter):

```yaml
---
addons:
  - slidev-addon-typst
---
```

<div class="flex justify-between items-center">
<div class="grow-1">

Then you can use `typst` code blocks in your markdown files.

````typst
#import "@preview/fletcher:0.5.7" as fletcher: diagram, edge

#html.frame(diagram($
  G edge(f, ->) edge("d", pi, ->>) & im(f) \
  G slash ker(f) edge("ur", tilde(f), "hook-->")
$))
````

</div>
<div class="grow-1">

```typst
#import "@preview/fletcher:0.5.7" as fletcher: diagram, edge

#html.frame(diagram($
  G edge(f, ->) edge("d", pi, ->>) & im(f) \
  G slash ker(f) edge("ur", tilde(f), "hook-->")
$))
```

</div>
</div>

---

# Pacioli's construction of the icosahedron

```typst
#import "@preview/cetz:0.3.4": canvas, draw, tree

#html.frame(canvas(length: 2cm, {
  import draw: *
  let phi = (1 + calc.sqrt(5)) / 2

  ortho({
    hide({
      line((-phi, -1, 0), (-phi, 1, 0), (phi, 1, 0), (phi, -1, 0), close: true, name: "xy")
      line((-1, 0, -phi), (1, 0, -phi), (1, 0, phi), (-1, 0, phi), close: true, name: "xz")
      line((0, -phi, -1), (0, -phi, 1), (0, phi, 1), (0, phi, -1), close: true, name: "yz")
    })

    intersections("a", "yz", "xy")
    intersections("b", "xz", "yz")
    intersections("c", "xy", "xz")

    set-style(stroke: (thickness: 0.5pt, cap: "round", join: "round"))
    line((0, 0, 0), "c.1", (phi, 1, 0), (phi, -1, 0), "c.3")
    line("c.0", (-phi, 1, 0), "a.2")
    line((0, 0, 0), "b.1", (1, 0, phi), (-1, 0, phi), "b.3")
    line("b.0", (1, 0, -phi), "c.2")
    line((0, 0, 0), "a.1", (0, phi, 1), (0, phi, -1), "a.3")
    line("a.0", (0, -phi, 1), "b.2")

    anchor("A", (0, phi, 1))
    content("A", [$A$], anchor: "north", padding: .1)
    anchor("B", (-1, 0, phi))
    content("B", [$B$], anchor: "south", padding: .1)
    anchor("C", (1, 0, phi))
    content("C", [$C$], anchor: "south", padding: .1)
    line("A", "B", stroke: (dash: "dashed"))
    line("A", "C", stroke: (dash: "dashed"))
  })
}))
```

---

# Waves

```typst
#import "@preview/cetz:0.3.4": canvas, draw, vector, matrix

#html.frame(canvas({
  import draw: *

  ortho(y: -30deg, x: 30deg, {
    on-xz({
      grid((0,-2), (8,2), stroke: gray + .5pt)
    })

    // Draw a sine wave on the xy plane
    let wave(amplitude: 1, fill: none, phases: 2, scale: 8, samples: 100) = {
      line(..(for x in range(0, samples + 1) {
        let x = x / samples
        let p = (2 * phases * calc.pi) * x
        ((x * scale, calc.sin(p) * amplitude),)
      }), fill: fill)

      let subdivs = 8
      for phase in range(0, phases) {
        let x = phase / phases
        for div in range(1, subdivs + 1) {
          let p = 2 * calc.pi * (div / subdivs)
          let y = calc.sin(p) * amplitude
          let x = x * scale + div / subdivs * scale / phases
          line((x, 0), (x, y), stroke: rgb(0, 0, 0, 150) + .5pt)
        }
      }
    }

    on-xy({
      wave(amplitude: 1.6, fill: rgb(0, 0, 255, 50))
    })
    on-xz({
      wave(amplitude: 1, fill: rgb(255, 0, 0, 50))
    })
  })
}))
```

---

# Algebra Cube

```typst
#import "@preview/fletcher:0.5.7" as fletcher: diagram, node, edge

#html.frame(diagram(
  node-defocus: 0,
  node-corner-radius: 0.5em,
  spacing: (1cm, 2cm),
  edge-stroke: 1pt,
  crossing-thickness: 5,
  mark-scale: 70%,
  node-fill: luma(97%),
  node-outset: 3pt,
  node((0,0), "magma"),

  node((-1,1), "semigroup"),
  node(( 0,1), "unital magma"),
  node((+1,1), "quasigroup"),

  node((-1,2), "monoid"),
  node(( 0,2), "inverse semigroup"),
  node((+1,2), "loop"),

  node(( 0,3), "group"),

  {
    let quad(a, b, label, paint, ..args) = {
      paint = paint.darken(25%)
      edge(a, b, text(paint, label), "-|>", stroke: paint, label-side: center, ..args)
    }

    quad((0,0), (-1,1), "Assoc", blue)
    quad((0,1), (-1,2), "Assoc", blue, label-pos: 0.3)
    quad((1,2), (0,3), "Assoc", blue)

    quad((0,0), (0,1), "Id", red)
    quad((-1,1), (-1,2), "Id", red, label-pos: 0.3)
    quad((+1,1), (+1,2), "Id", red, label-pos: 0.3)
    quad((0,2), (0,3), "Id", red)

    quad((0,0), (1,1), "Div", yellow)
    quad((-1,1), (0,2), "Div", yellow, label-pos: 0.3, "crossing")

    quad((-1,2), (0,3), "Inv", green)
    quad((0,1), (+1,2), "Inv", green, label-pos: 0.3)

    quad((1,1), (0,2), "Assoc", blue, label-pos: 0.3, "crossing")
  },
))
```

---

# DFT Choices

```typst
#import "@preview/cetz:0.3.4": canvas, draw
#import draw: line, content, rect

#set text(size: 15pt)

#html.frame(canvas({
  // Define styles and constants
  let node-sep = 1.7 // Reduced horizontal separation
  let arrow-style = (mark: (end: "stealth", fill: black, offset: 4pt), stroke: 0.8pt)
  let node-height = 1.6 // Shorter boxes
  let node-width = 1.2 // Increased for larger text

  // Helper function to create rounded rectangle nodes
  let node(pos, text, fill: none, name: none, width: node-width, height: node-height) = {
    rect(
      (rel: (-width, -height / 2), to: pos),
      (rel: (2 * width, height)),
      fill: fill,
      stroke: 0.4pt,
      radius: 0.2,
      name: name,
    )
    content(name, scale(140%, text))
  }

  // Create main equation nodes

  node(
    (0, 0),
    $-frac(planck.reduce^2, 2m) arrow(nabla)_arrow(r)^2$,
    fill: rgb("#ffd699"),
    name: "kinetic",
    width: 1.3 * node-width,
  ) // Kinetic term

  content((rel: (-1.6 * node-width, 0.1), to: "kinetic"), scale(350%, $($), name: "lparen") // Opening parenthesis

  content((rel: (1.6 * node-width, 0), to: "kinetic"), $+$, name: "plus-1")

  node(
    (rel: (1.4 * node-width, 0), to: "plus-1"),
    $v_"ext" (arrow(r))$,
    fill: rgb("#ffb3b3"),
    name: "ext",
  ) // External potential

  content((rel: (1.4 * node-width, 0), to: "ext"), $+$, name: "plus-2")

  node(
    (rel: (1.4 * node-width, 0), to: "plus-2"),
    $v_H (arrow(r))$,
    fill: rgb("#ffb3b3"),
    name: "hartree",
  ) // Hartree potential

  content((rel: (1.4 * node-width, 0), to: "hartree"), $+$, name: "plus-3")

  node(
    (rel: (1 * node-width, 0), to: "plus-3"),
    $v_"xc"$,
    fill: rgb("#ffb3b3"),
    name: "xc",
    width: .6 * node-width,
  ) // Exchange-correlation

  content(
    (rel: (1 * node-width, 0.1), to: "xc"),
    scale(350%, $)$),
    name: "rparen",
    padding: 5pt,
  ) // Large closing parenthesis

  node(
    (rel: (2.4 * node-width, 0), to: "xc"),
    $phi_i (arrow(r))$,
    fill: rgb("#e6e6e6"),
    name: "phi1",
  ) // Wavefunction 1

  content((rel: (1.4 * node-width, 0), to: "phi1"), $=$, name: "eq-1")

  node(
    (rel: (1 * node-width, 0), to: "eq-1"),
    $E_i$,
    fill: rgb("#b3d9ff"),
    name: "energy",
    width: 0.6 * node-width,
  ) // Energy

  node(
    (rel: (1.9 * node-width, 0), to: "energy"),
    $phi_i (arrow(r))$,
    fill: rgb("#e6e6e6"),
    name: "phi2",
  ) // Wavefunction 2

  // Add comment boxes and arrows
  let comment(pos, text, target-name, name: none) = {
    content(pos, align(center, text), name: name)
    line(name, target-name, ..arrow-style)
  }

  // Add comments with arrows
  comment(
    (node-sep, 3),
    [non-rel. Schrödinger equation\
      or relativistic Dirac equation],
    "kinetic",
    name: "kinetic-comment",
  )

  comment(
    (rel: (-2, -3), to: "ext"),
    [pseudopotential\
      (ultrasoft/PAW/norm-conserving)\ or all-electron],
    "ext",
    name: "ext-comment",
  )

  comment(
    (4.9 * node-sep, -3),
    [Hartree potential\ from solving Poisson eq.\
      or integrating charge density],
    "hartree",
    name: "hartree-comment",
  )

  comment(
    (5 * node-sep, 3),
    [LDA or GGA\ or hybrids],
    "xc",
    name: "xc-comment",
  )

  comment(
    (rel: (2, 3), to: "phi1"),
    [physical orbitals or not\ mesh density and basis set],
    "phi1",
    name: "phi-comment",
  )
  line("phi-comment", "phi2", ..arrow-style)

  comment(
    (rel: (0, -3), to: "energy"),
    [view EVs as mere Lagrange\ multipliers or band structure approx],
    "energy",
    name: "energy-comment",
  )
}))
```

---

# Line Chart

```typst
#import "@preview/cetz:0.3.4": canvas, draw
#import "@preview/cetz-plot:0.1.1": plot

#let style = (stroke: black, fill: rgb(0, 0, 200, 75))

#let f1(x) = calc.sin(x)
#let fn = (
  ($x - x^3"/"3!$, x => x - calc.pow(x, 3)/6),
  ($x - x^3"/"3! - x^5"/"5!$, x => x - calc.pow(x, 3)/6 + calc.pow(x, 5)/120),
  ($x - x^3"/"3! - x^5"/"5! - x^7"/"7!$, x => x - calc.pow(x, 3)/6 + calc.pow(x, 5)/120 - calc.pow(x, 7)/5040),
)

#set text(size: 10pt)

#html.frame(canvas({
  import draw: *

  set-style(axes: (stroke: .5pt, tick: (stroke: .5pt)),
            legend: (stroke: none, orientation: ttb, item: (spacing: .3), scale: 80%))

  plot.plot(
    size: (12, 8),
    x-tick-step: calc.pi/2,
    x-format: plot.formats.multiple-of,
    y-tick-step: 2, y-min: -2.5, y-max: 2.5,
    legend: "inner-north",
    {
      let domain = (-1.1 * calc.pi, +1.1 * calc.pi)

      for ((title, f)) in fn {
        plot.add-fill-between(f, f1, domain: domain, style: (stroke: none), label: title)
      }
      plot.add(f1, domain: domain, label: $sin x$, style: (stroke: black))
    },
  )
}))
```
