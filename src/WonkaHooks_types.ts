import { sourceT } from 'wonka/src/Wonka_types.gen'

export declare type useSource = {
  <T>(initFn: () => sourceT<T>): sourceT<T>
  <A, T>(initFn: (inputs: [A]) => sourceT<T>, inputs: [A]): sourceT<T>
  <A, B, T>(initFn: (inputs: [A, B]) => sourceT<T>, inputs: [A, B]): sourceT<T>
  <A, B, C, T>(initFn: (inputs: [A, B, C]) => sourceT<T>, inputs: [A, B, C]): sourceT<T>
  <A, B, C, D, T>(initFn: (inputs: [A, B, C, D]) => sourceT<T>, inputs: [A, B, C, D]): sourceT<T>
  <A, B, C, D, E, T>(
    initFn: (inputs: [A, B, C, D, E]) => sourceT<T>,
    inputs: [A, B, C, D, E],
  ): sourceT<T>
  <A, B, C, D, E, F, T>(
    initFn: (inputs: [A, B, C, D, E, F]) => sourceT<T>,
    inputs: [A, B, C, D, E, F],
  ): sourceT<T>
}
export declare type useSourceState = {
  <T>(source: sourceT<T>, initialState: T): T
  <T>(source: sourceT<T>, initialState?: T): T | undefined
}
export declare type useSubscription = <A>(source: sourceT<A>, nextFn?: (value: A) => void) => void

export declare const useSubscription: useSubscription
export declare const useSource: useSource
export declare const useSourceState: useSourceState
