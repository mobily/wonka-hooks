open Wonka_types

external unsafeRef: React.ref<Js.undefined<'a>> => React.ref<'a> = "%identity"

@gentype
let useLazyRef = (initFn: unit => 'a): React.ref<'a> => {
  let ref = React.useRef(Js.undefined)

  if ref.current == Js.undefined {
    let value = initFn()
    ref.current = Js.Undefined.return(value)
  }

  unsafeRef(ref)
}

@gentype
let useFirstMountState = () => {
  let initialRef = React.useRef(true)

  React.useEffect0(() => {
    initialRef.current = false
    None
  })

  initialRef.current
}

let useSubscription = (source: sourceT<'a>, nextFn: option<'a => unit>) => {
  React.useEffect0(() => {
    let next = nextFn->Belt.Option.getWithDefault(ignore)
    let subscription = source |> Wonka.subscribe((. value) => next(value))

    Some(subscription.unsubscribe)
  })
}

let useSource = (initFn: array<'a> => sourceT<'b>, inputs: array<'a>) => {
  let inputRef = useLazyRef(() => WonkaExtras.makeBehaviorSubject(inputs))
  let isFirstMount = useFirstMountState()
  let sourceRef = useLazyRef(() =>
    inputRef.current.source |> Wonka.switchMap((. inputs) => initFn(inputs))
  )

  React.useEffect1(() => {
    if !isFirstMount {
      inputRef.current.next(inputs)
    }
    None
  }, inputs)

  sourceRef.current
}

let useSource0 = (source: sourceT<'a>) => {
  let sourceRef = React.useRef(source)
  sourceRef.current
}

let useSource1 = (initFn: 'a => sourceT<'b>, input: 'a): sourceT<'b> => {
  let inputRef = useLazyRef(() => WonkaExtras.makeBehaviorSubject(input))
  let isFirstMount = useFirstMountState()
  let sourceRef = useLazyRef(() =>
    inputRef.current.source |> Wonka.switchMap((. input) => initFn(input))
  )

  React.useEffect1(() => {
    if !isFirstMount {
      inputRef.current.next(input)
    }
    None
  }, [input])

  sourceRef.current
}

let useSource2 = (initFn: ('a, 'b) => sourceT<'c>, inputs: ('a, 'b)): sourceT<'c> => {
  let inputRef = useLazyRef(() => WonkaExtras.makeBehaviorSubject(inputs))
  let isFirstMount = useFirstMountState()
  let sourceRef = useLazyRef(() =>
    inputRef.current.source |> Wonka.switchMap((. values) => {
      let (a0, a1) = values
      initFn(a0, a1)
    })
  )

  React.useEffect2(() => {
    if !isFirstMount {
      inputRef.current.next(inputs)
    }
    None
  }, inputs)

  sourceRef.current
}

let useSource3 = (initFn: ('a, 'b, 'c) => sourceT<'d>, inputs: ('a, 'b, 'c)): sourceT<'d> => {
  let inputRef = useLazyRef(() => WonkaExtras.makeBehaviorSubject(inputs))
  let isFirstMount = useFirstMountState()
  let sourceRef = useLazyRef(() =>
    inputRef.current.source |> Wonka.switchMap((. values) => {
      let (a0, a1, a2) = values
      initFn(a0, a1, a2)
    })
  )

  React.useEffect3(() => {
    if !isFirstMount {
      inputRef.current.next(inputs)
    }
    None
  }, inputs)

  sourceRef.current
}

let useSource4 = (initFn: ('a, 'b, 'c, 'd) => sourceT<'e>, inputs: ('a, 'b, 'c, 'd)): sourceT<
  'e,
> => {
  let inputRef = useLazyRef(() => WonkaExtras.makeBehaviorSubject(inputs))
  let isFirstMount = useFirstMountState()
  let sourceRef = useLazyRef(() =>
    inputRef.current.source |> Wonka.switchMap((. values) => {
      let (a0, a1, a2, a3) = values
      initFn(a0, a1, a2, a3)
    })
  )

  React.useEffect4(() => {
    if !isFirstMount {
      inputRef.current.next(inputs)
    }
    None
  }, inputs)

  sourceRef.current
}

let useSource5 = (
  initFn: ('a, 'b, 'c, 'd, 'e) => sourceT<'f>,
  inputs: ('a, 'b, 'c, 'd, 'e),
): sourceT<'f> => {
  let inputRef = useLazyRef(() => WonkaExtras.makeBehaviorSubject(inputs))
  let isFirstMount = useFirstMountState()
  let sourceRef = useLazyRef(() =>
    inputRef.current.source |> Wonka.switchMap((. values) => {
      let (a0, a1, a2, a3, a4) = values
      initFn(a0, a1, a2, a3, a4)
    })
  )

  React.useEffect5(() => {
    if !isFirstMount {
      inputRef.current.next(inputs)
    }
    None
  }, inputs)

  sourceRef.current
}

let useSourceState = (source: sourceT<'a>, initialState: option<'a>) => {
  let (state, setState) = React.useState(() => initialState)
  let next = value => setState(_ => Some(value))

  useSubscription(source, Some(next))

  state
}

@gentype
let useSourceCallback = (initFn: sourceT<'a> => sourceT<'b>) => {
  let subjectRef = useLazyRef(() => Wonka.makeSubject())
  let outputRef = useLazyRef(() => initFn(subjectRef.current.source))
  let callback = React.useCallback0(input => {
    subjectRef.current.next(input)
  })

  (outputRef.current, callback)
}

@gentype
let useSourceEagerState = (source: sourceT<'a>): 'a => {
  let isAsyncEmissionRef = React.useRef(false)
  let didAsyncEmitRef = React.useRef(false)
  let (state, setState) = React.useState(() => {
    let initialState = ref(Js.undefined)

    source
    |> Wonka.take(1)
    |> Wonka.forEach((. value) => {
      didAsyncEmitRef.current = true
      initialState := Js.Undefined.return(value)
    })
  })

  React.useEffect1(() => {
    isAsyncEmissionRef.current = true

    let subscription = source |> Wonka.subscribe((. value) => {
      if isAsyncEmissionRef.current {
        setState(_ => value)
      }
    })

    Some(subscription.unsubscribe)
  }, [source])

  if !didAsyncEmitRef.current {
    failwith("WonkaHooks - useEagerState, something went wrong!")
  }

  state
}
