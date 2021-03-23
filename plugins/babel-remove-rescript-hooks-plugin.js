exports.removeReScriptHooks = ({ types: t }) => {
  const fnName = /^useSource(\d)$/

  const functionDeclaration = path => {
    if (fnName.test(path.node.id.name)) {
      path.remove()
    }
  }

  const exportNamedDeclaration = path => {
    const specifiers = path.get('specifiers')

    if (specifiers && specifiers.length) {
      specifiers.forEach(specifier => {
        if (fnName.test(specifier.node.local.name)) {
          specifier.remove()
        }
      })
    }
  }

  const variableDeclarator = path => {
    if (fnName.test(path.node.id.name)) {
      path.remove()
    }
  }

  return {
    visitor: {
      FunctionDeclaration: functionDeclaration,
      ExportNamedDeclaration: exportNamedDeclaration,
      VariableDeclarator: variableDeclarator,
    },
  }
}
