import { sourceT } from 'wonka/src/Wonka_types.gen'

export declare type useSource = {
  <T>(init: () => sourceT<T>): sourceT<T>
  <A, T>(init: (inputs: [A]) => sourceT<T>, inputs: [A]): sourceT<T>
  <A, B, T>(init: (inputs: [A, B]) => sourceT<T>, inputs: [A, B]): sourceT<T>
  <A, B, C, T>(init: (inputs: [A, B, C]) => sourceT<T>, inputs: [A, B, C]): sourceT<T>
  <A, B, C, D, T>(init: (inputs: [A, B, C, D]) => sourceT<T>, inputs: [A, B, C, D]): sourceT<T>
  <A, B, C, D, E, T>(
    init: (inputs: [A, B, C, D, E]) => sourceT<T>,
    inputs: [A, B, C, D, E],
  ): sourceT<T>
  <A, B, C, D, E, F, T>(
    init: (inputs: [A, B, C, D, E, F]) => sourceT<T>,
    inputs: [A, B, C, D, E, F],
  ): sourceT<T>
}
export declare type useSourceState = {
  <T>(input: sourceT<T>, initialState: T): T
  <T>(input: sourceT<T>, initialState?: T): T | undefined
}

export declare const useSource: useSource
export declare const useSourceState: useSourceState
