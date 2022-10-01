import { Source, Subscription, makeSubject, pipe, subscribe } from 'wonka'

type Handler<T = unknown> = {
  suspender: Promise<T>
  resolve: (value?: T) => void
}

export class Resource<T, R extends T = T> {
  readonly subject = makeSubject<{ current: R } | undefined>()

  private handler: Handler | null = this.makeHandler()
  private value: R | undefined
  private error: Error | null = null
  private source: Source<T>
  private subscription: Subscription
  private isSuccess = (_value: T): _value is R => true

  private destroyed = false

  constructor(
    source: Source<T>,
    isSuccess?: T extends R ? (value: T) => boolean : (value: T) => value is R,
  ) {
    if (isSuccess) {
      this.isSuccess = isSuccess as (value: T) => value is R
    }

    this.source = source
    this.subscription = pipe(source, subscribe(this.handleNext))
  }

  get isDestroyed(): boolean {
    return this.destroyed
  }

  read(): R {
    if (this.error) {
      throw this.error
    }
    if (this.handler) {
      throw this.handler.suspender
    }

    return this.value!
  }

  reload(source?: Source<T>) {
    if (this.destroyed) {
      throw new Error('Cannot reload a destroyed Resource')
    }

    if (source) {
      this.source = source
    }

    this.subscription.unsubscribe()
    this.error = null

    if (this.handler) {
      this.handler.resolve()
      this.handler = this.makeHandler()
    }

    this.subscription = pipe(this.source, subscribe(this.handleNext))
  }

  destroy() {
    this.destroyed = true
    this.subscription.unsubscribe()
    this.subject.complete()

    if (this.handler) {
      const { resolve } = this.handler
      this.error = new Error('Resource has been destroyed')
      this.handler = null
      resolve()
    }
  }

  private handleNext = (value: T) => {
    this.error = null

    if (this.isSuccess(value)) {
      const isDiff = this.value !== value
      this.value = value

      if (this.handler) {
        const { resolve } = this.handler
        this.handler = null
        resolve()
      }

      if (isDiff) {
        this.subject.next({ current: value })
      }
    } else if (!this.handler) {
      this.handler = this.makeHandler()
      this.subject.next(undefined)
    }
  }

  private makeHandler(): Handler {
    const handler: Partial<Handler> = {}
    handler.suspender = new Promise(resolve => {
      handler.resolve = resolve
    })
    return handler as Handler
  }
}
