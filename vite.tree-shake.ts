import type { Plugin } from 'vite'
import { parse } from '@babel/parser'
import type { NodePath } from '@babel/traverse'
import _traverse from '@babel/traverse'
import * as t from '@babel/types'
import type { ImportDeclaration, JSXIdentifier } from '@babel/types'

// @babel/traverse is a CommonJS module that exports default
const traverse = (_traverse as any).default

export function treeShakePlugin(): Plugin {
  const usedExports = new Set<string>()

  return {
    name: 'vite:tree-shake',
    enforce: 'pre',
    async transform(code: string, id: string) {
      if (!id.endsWith('.tsx') && !id.endsWith('.ts')) return

      const ast = parse(code, {
        sourceType: 'module',
        plugins: ['typescript', 'jsx']
      })

      traverse(ast, {
        ImportDeclaration(path: NodePath<ImportDeclaration>) {
          const source = path.node.source.value
          if (source.startsWith('.') || source.startsWith('@/')) {
            path.node.specifiers.forEach((specifier: t.ImportSpecifier | t.ImportDefaultSpecifier | t.ImportNamespaceSpecifier) => {
              if (t.isImportSpecifier(specifier)) {
                usedExports.add(specifier.local.name)
              }
            })
          }
        },
        JSXIdentifier(path: NodePath<JSXIdentifier>) {
          usedExports.add(path.node.name)
        }
      })

      return {
        code,
        map: null
      }
    }
  }
}
