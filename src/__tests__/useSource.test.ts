import { renderHook } from '@testing-library/react-hooks'

import { beforeEach, describe, expect, it, vi } from 'vitest'
import { interval, pipe, take } from 'wonka'

import { useSource, useSubscription } from '..'

describe('useSource', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  it('*', () => {
    const spy = vi.fn()

    renderHook(() => {
      const source = useSource(() => {
        return pipe(interval(200), take(3))
      })

      useSubscription(source, spy)

      return source
    })

    vi.advanceTimersByTime(600)

    expect(spy.mock.calls).toEqual([[0], [1], [2]])
  })

  it('*', () => {
    const spy = vi.fn()

    const { rerender } = renderHook(
      props => {
        const { ms } = props
        const source = useSource(
          ms => {
            return pipe(interval(ms), take(3))
          },
          [ms],
        )

        useSubscription(source, spy)

        return source
      },
      {
        initialProps: {
          ms: 200,
        },
      },
    )

    vi.advanceTimersByTime(600)

    expect(spy.mock.calls).toEqual([[0], [1], [2]])

    rerender({ ms: 300 })

    vi.advanceTimersByTime(900)

    expect(spy.mock.calls).toEqual([[0], [1], [2], [0], [1], [2]])
  })
})
