import * as esbuild from 'esbuild'
import { getTsconfig as getTSconfig } from 'get-tsconfig'
import * as ts from 'typescript'
import util from 'util'

const tsConfig = getTSconfig()

export const adminPlugin: esbuild.Plugin = {
  name: 'payload-admin',
  setup(build) {
    build.onLoad({ filter: /\.(t|j)sx?$/ }, (args) => {
      // This function should be called ONCE for every single file that gets loaded
      // For each file, we need to traverse through and look for config modifications
      const program = ts.createProgram(
        [args.path],
        tsConfig.config.compilerOptions as unknown as ts.CompilerOptions
      )

      const payloadConfig = program.getSourceFile(args.path)
      const checker = program.getTypeChecker() // Removing this line causes an esbuild error?

      ts.forEachChild(payloadConfig, (node) => {
        if (ts.isExportAssignment(node)) {
          // TODO: Use ts.visitNode in order to actually modify the AST?
          ts.forEachChild(node, visitNodeHandler())
        }
      })

      // TODO: Use printer to print new AST/source to file afte properly modifying it.

      // const printer = ts.createPrinter({ newLine: ts.NewLineKind.LineFeed })
      // const result = printer.printFile(payloadConfig)
      // Writing original source for now
      return {
        contents: payloadConfig.text,
        loader: 'ts',
      }
    })
  },
}

function visitNodeHandler(recursion_level_in_admin = 0): (node: ts.Node) => void {
  function visitNode(node: ts.Node) {
    // Properties are identifiers
    let was_admin = false;
    if (ts.isIdentifier(node)) {
      const propName = node.getText()
      if (propName === 'admin' || recursion_level_in_admin >= 1) {
        console.log(`Visiting config prop: ${propName}`)
        was_admin = true;
      }
    }
  
    ts.forEachChild(node, visitNodeHandler(recursion_level_in_admin += (was_admin || recursion_level_in_admin >= 1) ? 1 : 0))
  }
  return visitNode;
}

function debug(obj: any) {
  console.log(util.inspect(obj, false, null, true /* enable colors */))
}
