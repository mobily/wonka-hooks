import { makeBehaviorSubject } from '@mobily/wonka-extras'
import { renderHook } from '@testing-library/react-hooks'

import { describe, expect, it, vi } from 'vitest'

import { useSourceEagerState } from '..'

describe('useSourceEagerState', () => {
  it('*', () => {
    const subject = makeBehaviorSubject(0)

    const { result, rerender } = renderHook(() => {
      return useSourceEagerState(subject.source)
    })

    expect(result.current).toBe(0)
    subject.next(1)
    expect(result.current).toBe(1)
    rerender()
    subject.next(2)
    expect(result.current).toBe(2)
  })
})
