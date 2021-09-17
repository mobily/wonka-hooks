import { sourceT, subjectT } from 'wonka/src/Wonka_types.gen'

export declare type useSource = {
  <T>(initFn: () => sourceT<T>, inputs: []): sourceT<T>
  <A, T>(initFn: (args: [A]) => sourceT<T>, inputs: [A]): sourceT<T>
  <A, B, T>(initFn: (args: [A, B]) => sourceT<T>, inputs: [A, B]): sourceT<T>
  <A, B, C, T>(initFn: (args: [A, B, C]) => sourceT<T>, inputs: [A, B, C]): sourceT<T>
  <A, B, C, D, T>(initFn: (args: [A, B, C, D]) => sourceT<T>, inputs: [A, B, C, D]): sourceT<T>
  <A, B, C, D, E, T>(
    initFn: (args: [A, B, C, D, E]) => sourceT<T>,
    args: [A, B, C, D, E],
  ): sourceT<T>
  <A, B, C, D, E, F, T>(
    initFn: (args: [A, B, C, D, E, F]) => sourceT<T>,
    args: [A, B, C, D, E, F],
  ): sourceT<T>
}
export declare type useSourceState = {
  <T>(source: sourceT<T>, initialState: T): T
  <T>(source: sourceT<T>, initialState?: T): T | undefined
}
export declare type useSubscription = <A>(
  source: sourceT<A>,
  nextFn?: (value: A) => void,
  inputs?: any[],
) => void
export declare type useEventHandler = <A>(
  initFn: (arg0: A) => sourceT<unknown>,
) => (arg0: A) => void
export declare type useSubject = <A>() => subjectT<A>

export declare const useEventHandler: useEventHandler
export declare const useSubscription: useSubscription
export declare const useSource: useSource
export declare const useSourceState: useSourceState
export declare const useSubject: useSubject
