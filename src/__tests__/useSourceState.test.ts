import { makeBehaviorSubject } from '@mobily/wonka-extras'
import { act, renderHook } from '@testing-library/react-hooks'

import { describe, expect, it, vi } from 'vitest'

import { useSourceState } from '..'

describe('useSourceState', () => {
  it('*', () => {
    const subject = makeBehaviorSubject(0)

    const { result } = renderHook(() => {
      return useSourceState(subject.source, 0)
    })

    subject.next(1)

    expect(result.current).toBe(1)
  })
})
