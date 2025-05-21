import { NodeCompiler } from '@myriaddreamin/typst-ts-node-compiler'
import { defineTransformersSetup, MarkdownTransformContext } from '@slidev/types'

const compiler = NodeCompiler.create()

interface TypstOptions {
  prelude?: string
  inputs?: Record<string, string>
}

const DEFAULT_PRELUDE = `
#show math.equation: it => context {
  // only wrap in frame on html export
  if target() == "html" {
    // wrap frames of inline equations in a box
    // so they don't interrupt the paragraph
    show: if it.block { it => it } else { box }
    html.frame(it)
  } else {
    it
  }
}`

const MAGIC_HUE = '-45.841deg'

export function renderTypst(code: string, info: string, options: TypstOptions) {
  const colorNames: string[] = []
  code = code.replace(/var\(([\w-]+)\)/g, ($0, name: string) => {
    colorNames.push(name)
    return `color.hsl(${MAGIC_HUE}, 0%, ${colorNames.length}%)`
  })
  code = DEFAULT_PRELUDE + '\n' + (options.prelude ?? '') + '\n' + code
  const result = compiler.tryHtml({
    mainFileContent: code,
    inputs: options.inputs,
  })
  if (!result.result) {
    result.printErrors()
    result.printDiagnostics()
    return ''
  }
  return result.result.body().replace(/"hsl\(-45\.841deg ([\d.]+)% ([\d.]+)%\)"/g, ($0, $1, num: string) => {
    return `"var(--${colorNames[+num - 1]})"`
  })
}

async function typstTransformer(ctx: MarkdownTransformContext) {
  const snippets: [info: string, code: string][] = []
  ctx.s.replace(
    /^```typst *(\{[^\n]*\})?\n([\s\S]+?)\n```/gm,
    (full, info: string = '', code: string = '') => {
      snippets.push([info, code])
      return full
    },
  )
  const typst = (ctx.options.data.headmatter.typst ??= {}) as TypstOptions
  const svgs = await Promise.all(snippets.map(async ([info, code]) => {
    return renderTypst(code, info, typst)
  }))
  let count = 0
  ctx.s.replace(
    /^```typst *(\{[^\n]*\})?\n([\s\S]+?)\n```/gm,
    () => svgs[count++],
  )
}

export default defineTransformersSetup(() => ({
  pre: [],
  preCodeblock: [typstTransformer],
  postCodeblock: [],
  post: [],
}))
