exports.removeRescriptHooks = (j, source) => {
  const fnName = /^(useSource|useSubscription|useEventHandler)(\d)$/

  const root = j(source)

  root
    .find(j.FunctionDeclaration)
    .filter(p => {
      return fnName.test(p.value.id.name)
    })
    .remove()

  root
    .find(j.ExportSpecifier)
    .filter(p => {
      return fnName.test(p.value.local.name)
    })
    .remove()

  root
    .find(j.VariableDeclarator)
    .filter(p => {
      return fnName.test(p.value.id.name)
    })
    .remove()

  return root.toSource()
}
