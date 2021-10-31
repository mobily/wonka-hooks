open Wonka_types

external unsafeReactRef: React.ref<Js.undefined<'a>> => React.ref<'a> = "%identity"
external unsafeRef: Js.undefined<'a> => 'a = "%identity"
external uncurry0: (unit => 'a, . unit) => 'a = "%identity"

@gentype
let useLazyRef = (initFn: unit => 'a): React.ref<'a> => {
  let ref = React.useRef(Js.undefined)

  if ref.current == Js.undefined {
    let initFn = uncurry0(initFn)
    ref.current = Js.Undefined.return(initFn(.))
  }

  unsafeReactRef(ref)
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

let useSubscription = (
  source: sourceT<'a>,
  nextFn: option<'a => unit>,
  inputs: option<array<'b>>,
) => {
  React.useEffect1(() => {
    let next = nextFn->Belt.Option.getWithDefault(ignore)
    let subscription = source |> Wonka.subscribe((. value) => next(value))

    Some(subscription.unsubscribe)
  }, Belt.Option.getWithDefault(inputs, []))
}

let useSubscription0 = (source: sourceT<'a>, nextFn: option<'a => unit>) => {
  React.useEffect0(() => {
    let next = nextFn->Belt.Option.getWithDefault(ignore)
    let subscription = source |> Wonka.subscribe((. value) => next(value))

    Some(subscription.unsubscribe)
  })
}

let useSubscription1 = (source: sourceT<'a>, nextFn: option<'a => unit>, inputs: array<'b>) => {
  React.useEffect1(() => {
    let next = nextFn->Belt.Option.getWithDefault(ignore)
    let subscription = source |> Wonka.subscribe((. value) => next(value))

    Some(subscription.unsubscribe)
  }, inputs)
}

let useSubscription2 = (source: sourceT<'a>, nextFn: option<'a => unit>, inputs: ('b, 'c)) => {
  React.useEffect2(() => {
    let next = nextFn->Belt.Option.getWithDefault(ignore)
    let subscription = source |> Wonka.subscribe((. value) => next(value))

    Some(subscription.unsubscribe)
  }, inputs)
}

let useSubscription3 = (source: sourceT<'a>, nextFn: option<'a => unit>, inputs: ('b, 'c, 'd)) => {
  React.useEffect3(() => {
    let next = nextFn->Belt.Option.getWithDefault(ignore)
    let subscription = source |> Wonka.subscribe((. value) => next(value))

    Some(subscription.unsubscribe)
  }, inputs)
}

let useSubscription4 = (
  source: sourceT<'a>,
  nextFn: option<'a => unit>,
  inputs: ('b, 'c, 'd, 'e),
) => {
  React.useEffect4(() => {
    let next = nextFn->Belt.Option.getWithDefault(ignore)
    let subscription = source |> Wonka.subscribe((. value) => next(value))

    Some(subscription.unsubscribe)
  }, inputs)
}

let useSubscription5 = (
  source: sourceT<'a>,
  nextFn: option<'a => unit>,
  inputs: ('b, 'c, 'd, 'e, 'f),
) => {
  React.useEffect5(() => {
    let next = nextFn->Belt.Option.getWithDefault(ignore)
    let subscription = source |> Wonka.subscribe((. value) => next(value))

    Some(subscription.unsubscribe)
  }, inputs)
}

let useSource = (initFn: array<'a> => sourceT<'b>, inputs: array<'a>) => {
  let inputRef = useLazyRef(() => WonkaExtras.makeBehaviorSubject(inputs))
  let isFirstMount = useFirstMountState()
  let sourceRef = useLazyRef(() =>
    inputRef.current.source |> Wonka.switchMap((. inputs) => initFn(inputs)) |> Wonka.share
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
  let sourceRef = useLazyRef(() => Wonka.share(source))
  sourceRef.current
}

let useSource1 = (initFn: 'a => sourceT<'b>, input: 'a): sourceT<'b> => {
  let inputRef = useLazyRef(() => WonkaExtras.makeBehaviorSubject(input))
  let isFirstMount = useFirstMountState()
  let sourceRef = useLazyRef(() =>
    inputRef.current.source |> Wonka.switchMap((. input) => initFn(input)) |> Wonka.share
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
    inputRef.current.source
    |> Wonka.switchMap((. values) => {
      let (a0, a1) = values
      initFn(a0, a1)
    })
    |> Wonka.share
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
    inputRef.current.source
    |> Wonka.switchMap((. values) => {
      let (a0, a1, a2) = values
      initFn(a0, a1, a2)
    })
    |> Wonka.share
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
    inputRef.current.source
    |> Wonka.switchMap((. values) => {
      let (a0, a1, a2, a3) = values
      initFn(a0, a1, a2, a3)
    })
    |> Wonka.share
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
    inputRef.current.source
    |> Wonka.switchMap((. values) => {
      let (a0, a1, a2, a3, a4) = values
      initFn(a0, a1, a2, a3, a4)
    })
    |> Wonka.share
  )

  React.useEffect5(() => {
    if !isFirstMount {
      inputRef.current.next(inputs)
    }
    None
  }, inputs)

  sourceRef.current
}

let useSourceState = (source: sourceT<'a>, initialState: 'a) => {
  let (state, setState) = React.useState(() => initialState)
  let next = value => setState(_ => value)

  useSubscription(source, Some(next), None)

  state
}

@gentype
let useSourceCallback = (initFn: sourceT<'a> => sourceT<'b>) => {
  let subjectRef = useLazyRef(() => Wonka.makeSubject())
  let outputRef = useLazyRef(() => initFn(subjectRef.current.source))
  let callback = React.useCallback0(arg => {
    subjectRef.current.next(arg)
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

    unsafeRef(initialState.contents)
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

let useEventHandler = (initFn: 'a => sourceT<'b>, inputs: array<'c>) => {
  let subjectRef = useLazyRef(() => Wonka.makeSubject())
  let callback = React.useCallback0(arg => {
    subjectRef.current.next(arg)
  })

  useSubscription(
    subjectRef.current.source |> Wonka.switchMap((. args) => initFn(args)),
    None,
    Some(inputs),
  )

  callback
}

let useEventHandler0 = (initFn: 'a => sourceT<'b>) => {
  let subjectRef = useLazyRef(() => Wonka.makeSubject())
  let callback = React.useCallback0(arg => {
    subjectRef.current.next(arg)
  })

  useSubscription0(subjectRef.current.source |> Wonka.switchMap((. args) => initFn(args)), None)

  callback
}

let useEventHandler1 = (initFn: 'a => sourceT<'b>, inputs: array<'c>) => {
  let subjectRef = useLazyRef(() => Wonka.makeSubject())
  let callback = React.useCallback0(arg => {
    subjectRef.current.next(arg)
  })

  useSubscription1(
    subjectRef.current.source |> Wonka.switchMap((. args) => initFn(args)),
    None,
    inputs,
  )

  callback
}

let useEventHandler2 = (initFn: 'a => sourceT<'b>, inputs: ('c, 'd)) => {
  let subjectRef = useLazyRef(() => Wonka.makeSubject())
  let callback = React.useCallback0(arg => {
    subjectRef.current.next(arg)
  })

  useSubscription2(
    subjectRef.current.source |> Wonka.switchMap((. args) => initFn(args)),
    None,
    inputs,
  )

  callback
}

let useEventHandler3 = (initFn: 'a => sourceT<'b>, inputs: ('c, 'd, 'e)) => {
  let subjectRef = useLazyRef(() => Wonka.makeSubject())
  let callback = React.useCallback0(arg => {
    subjectRef.current.next(arg)
  })

  useSubscription3(
    subjectRef.current.source |> Wonka.switchMap((. args) => initFn(args)),
    None,
    inputs,
  )

  callback
}

let useEventHandler4 = (initFn: 'a => sourceT<'b>, inputs: ('c, 'd, 'e, 'f)) => {
  let subjectRef = useLazyRef(() => Wonka.makeSubject())
  let callback = React.useCallback0(arg => {
    subjectRef.current.next(arg)
  })

  useSubscription4(
    subjectRef.current.source |> Wonka.switchMap((. args) => initFn(args)),
    None,
    inputs,
  )

  callback
}

let useEventHandler5 = (initFn: 'a => sourceT<'b>, inputs: ('c, 'd, 'e, 'f, 'g)) => {
  let subjectRef = useLazyRef(() => Wonka.makeSubject())
  let callback = React.useCallback0(arg => {
    subjectRef.current.next(arg)
  })

  useSubscription5(
    subjectRef.current.source |> Wonka.switchMap((. args) => initFn(args)),
    None,
    inputs,
  )

  callback
}

@gentype
let useBehaviorSubject = (initialValue: 'a) =>
  React.useRef(WonkaExtras.makeBehaviorSubject(initialValue)).current

let useSubject = () => React.useRef(Wonka.makeSubject()).current
