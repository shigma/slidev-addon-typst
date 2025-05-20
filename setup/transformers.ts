import { NodeCompiler } from '@myriaddreamin/typst-ts-node-compiler'
import { defineTransformersSetup, MarkdownTransformContext } from '@slidev/types'

const compiler = NodeCompiler.create()

interface TypstOptions {
  prelude?: string
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

export function renderTypst(code: string, options: TypstOptions) {
  code = DEFAULT_PRELUDE + '\n' + (options.prelude ?? '') + '\n' + code
  const result = compiler.tryHtml({
    mainFileContent: code,
  })
  if (!result.result) {
    result.printErrors()
    result.printDiagnostics()
    return ''
  }
  return result.result.body()
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
    return renderTypst(code, typst)
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
