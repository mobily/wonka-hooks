import { act, renderHook } from '@testing-library/react-hooks'

import { describe, expect, it, vi } from 'vitest'
import { map, pipe } from 'wonka'

import { useSourceCallback, useSubscription } from '..'

describe('useSourceCallback', () => {
  it('*', () => {
    const spy = vi.fn()

    const { result, rerender } = renderHook(() => {
      const [source, callback] = useSourceCallback<number>(source => {
        return pipe(
          source,
          map(n => n + 1),
        )
      })

      useSubscription(source, spy)

      return callback
    })

    expect(spy).toHaveBeenCalledTimes(0)

    act(() => {
      result.current(1)
      result.current(2)
      result.current(3)
    })

    expect(spy.mock.calls).toEqual([[2], [3], [4]])

    rerender()

    act(() => {
      result.current(4)
    })

    expect(spy).toHaveBeenCalledTimes(4)
    expect(spy).toHaveBeenLastCalledWith(5)
  })
})
