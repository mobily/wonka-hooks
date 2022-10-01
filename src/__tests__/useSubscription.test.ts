import { renderHook } from '@testing-library/react-hooks'

import { describe, expect, it, vi } from 'vitest'
import { makeSubject } from 'wonka'

import { useSubscription } from '..'

describe('useSubscription', () => {
  it('*', () => {
    const spy = vi.fn()
    const subject = makeSubject<number>()

    const { result, rerender } = renderHook(() => {
      return useSubscription(subject.source, spy)
    })

    expect(spy).toHaveBeenCalledTimes(0)

    subject.next(1)
    subject.next(2)
    subject.next(3)

    expect(spy.mock.calls).toEqual([[1], [2], [3]])

    const subcription = result.all[0]

    rerender()

    subject.next(4)

    expect(spy.mock.calls).toEqual([[1], [2], [3], [4]])
    expect(subcription).toBe(result.current)
  })
})
