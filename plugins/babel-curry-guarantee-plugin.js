exports.curryGuaranteePlugin = ({ types: t }) => {
  const curryFnName = /^_{1,}(\d)$/

  const callExpression = path => {
    const property = path.node.callee.property

    if (!curryFnName.test(property && property.name)) {
      return
    }

    const callFn = path.node.arguments[0]
    const callArgs = path.node.arguments.slice(1)

    const arityLiteral = t.numericLiteral(callArgs.length)
    const argIds = callArgs.map(init => {
      if (t.isIdentifier(init)) {
        return init
      }

      const id = path.scope.generateUidIdentifierBasedOnNode(path.node.id)
      path.scope.push({ id, init })
      return id
    })

    if (property.name.includes('__')) {
      path.replaceWith(callFn)
    } else {
      path.replaceWith(
        t.conditionalExpression(
          t.binaryExpression(
            '===',
            t.memberExpression(callFn, t.identifier('length')),
            arityLiteral,
          ),
          t.callExpression(callFn, argIds),
          t.callExpression(
            t.memberExpression(callFn, t.identifier('bind')),
            [t.nullLiteral()].concat(argIds),
          ),
        ),
      )
    }
  }

  return {
    visitor: {
      CallExpression: callExpression,
    },
  }
}
