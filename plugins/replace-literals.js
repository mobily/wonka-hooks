exports.replaceLiterals = (j, source) => {
  const literals = [
    ['wonka/src/Wonka.bs.js', 'wonka'],
    ['@mobily/wonka-extras/src/WonkaExtras.bs.js', '@mobily/wonka-extras'],
  ]
  const check = p => ([search]) => {
    return p.value.value === search
  }

  return j(source)
    .find(j.Literal)
    .filter(p => {
      return literals.some(check(p))
    })
    .replaceWith(p => {
      const [, value] = literals.find(check(p))
      return j.stringLiteral(value)
    })
    .toSource()
}
