import * as React from 'react'

import { makeBehaviorSubject } from '@mobily/wonka-extras'

import { Source, Subscription, makeSubject, pipe, subscribe, switchMap, take } from 'wonka'

import { Resource } from './resource'

const increment = (n: number): number => {
  return (n + 1) % 1000000
}

export const useForceUpdate = () => {
  const [, update] = React.useState(0)
  return React.useRef(() => update(increment)).current
}

const useIsomorphicEffect =
  typeof window !== 'undefined' &&
  typeof window.document !== 'undefined' &&
  typeof window.document.createElement !== 'undefined'
    ? React.useLayoutEffect
    : React.useEffect

const useLazyRef = <T>(initFn: () => T): React.MutableRefObject<T> => {
  const firstMountRef = React.useRef(true)
  const ref = React.useRef<T>(null as T)

  if (firstMountRef.current === true) {
    firstMountRef.current = false
    ref.current = initFn()
  }
  return ref
}

const useFirstMountState = () => {
  const initialRef = React.useRef(true)

  React.useEffect(() => {
    initialRef.current = false
  }, [])

  return initialRef.current
}

export const useSubscription = <T>(
  source: Source<T>,
  nextFn?: (value: T) => void,
): React.MutableRefObject<Subscription | undefined> => {
  const subscriptionRef = React.useRef<Subscription>()
  const sourceRef = React.useRef(source)

  useIsomorphicEffect(() => {
    sourceRef.current = source
  })

  React.useEffect(() => {
    const source = sourceRef.current

    const subscription = pipe(
      source,
      subscribe(value => {
        nextFn?.(value)
      }),
    )

    subscriptionRef.current = subscription

    return subscription.unsubscribe
  }, [sourceRef.current !== source, nextFn])

  return subscriptionRef
}

export const useSource = <T, P extends readonly any[]>(
  initFn: (() => Source<T>) | ((...args: P) => Source<T>),
  inputs?: [...P],
) => {
  if (!inputs) {
    return useLazyRef(initFn as () => Source<T>).current
  }

  const inputsRef = useLazyRef(() => {
    return makeBehaviorSubject(inputs)
  })
  const isFirstMount = useFirstMountState()
  const sourceRef = useLazyRef(() => {
    return pipe(
      inputsRef.current.source,
      switchMap(args => initFn(...args)),
    )
  })

  React.useEffect(() => {
    if (!isFirstMount) {
      inputsRef.current.next(inputs)
    }
  }, inputs)

  return sourceRef.current
}

export const useSourceEvent = <P extends readonly any[]>(
  initFn: (...args: P) => Source<any>,
): ((...args: P) => void) => {
  const subjectRef = useLazyRef(() => {
    return makeSubject<P>()
  })
  const callback = React.useCallback((...args: P) => {
    return subjectRef.current.next(args)
  }, [])

  useSubscription(
    pipe(
      subjectRef.current.source,
      switchMap(args => initFn(...args)),
    ),
  )

  return callback
}

export const useSourceCallback = <O, T = O, P extends readonly any[] = [T]>(
  initFn: (source: Source<T>) => Source<O>,
  selectorFn?: (...args: P) => O,
): readonly [Source<O>, (...args: P) => void] => {
  const subjectRef = useLazyRef(() => {
    return makeSubject<T>()
  })

  const outputRef = useLazyRef(() => {
    return initFn(subjectRef.current.source)
  })

  const callback = React.useCallback(
    (...args: P) => {
      return subjectRef.current.next(selectorFn ? selectorFn(...args) : args[0])
    },
    [selectorFn],
  )

  return [outputRef.current, callback] as const
}

type UseSourceState = {
  <T>(source: Source<T>, initialState: T | (() => T)): T
  <T>(source: Source<T>, initialState?: T | (() => T)): T | undefined
}

export const useSourceState: UseSourceState = <T>(source: Source<T>, initialState: T): T => {
  const [state, setState] = React.useState<T>(initialState)

  useSubscription(source, setState)

  return state
}

export const useSourceEagerState = <T>(source: Source<T>): T => {
  const sourceRef = React.useRef(source)

  const isAsyncEmissionRef = React.useRef(false)
  const didSyncEmitRef = React.useRef(false)

  useIsomorphicEffect(() => {
    sourceRef.current = source
  })

  const [state, setState] = React.useState<T>(() => {
    let contents: T = undefined as T

    const subscription = pipe(
      source,
      take(1),
      subscribe(value => {
        didSyncEmitRef.current = true
        contents = value
      }),
    )

    subscription.unsubscribe()

    return contents
  })

  React.useEffect(() => {
    const source = sourceRef.current
    let secondInitialValue = state

    const subscription = pipe(
      source,
      subscribe(value => {
        if (isAsyncEmissionRef.current) {
          setState(value)
        } else {
          secondInitialValue = value
        }
      }),
    )

    if (!isAsyncEmissionRef.current && secondInitialValue !== state) {
      setState(secondInitialValue)
    }

    isAsyncEmissionRef.current = true

    return subscription.unsubscribe
  }, [sourceRef.current !== source])

  if (!didSyncEmitRef.current) {
    throw new Error('[useSourceEagerState]: a source did not synchronously emit a value')
  }

  return state
}

export const useSourceSuspense = <T, R extends T = T>(resource: Resource<T, R>): R => {
  const resourceValue = resource.read()
  const forceUpdate = useForceUpdate()
  const [state, setState] = React.useState<R>(resourceValue)

  useSubscription(resource.subject.source, value => {
    if (value) {
      return setState(value.current)
    }

    forceUpdate()
  })

  return state
}

export const useResource = <T, R extends T = T>(
  source: Source<T>,
  isSuccess?: T extends R ? (value: T) => boolean : (value: T) => value is R,
): Resource<T, R> => {
  const resource = React.useRef(new Resource(source, isSuccess)).current

  React.useEffect(() => {
    return () => {
      if (!resource.isDestroyed) {
        resource.destroy()
      }
    }
  }, [])

  return resource
}

export const useBehaviorSubject = <T>(initialValue: T) => {
  return React.useRef(makeBehaviorSubject<T>(initialValue)).current
}

export const useSubject = <T>() => {
  return React.useRef(makeSubject<T>()).current
}
