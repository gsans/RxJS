import {Operator} from '../Operator';
import {Subscriber} from '../Subscriber';
import {Observable} from '../Observable';

import {OuterSubscriber} from '../OuterSubscriber';
import {InnerSubscriber} from '../InnerSubscriber';
import {subscribeToResult} from '../util/subscribeToResult';

/**
 * Buffers the incoming observable values until the passed `closingNotifier`
 * emits a value, at which point it emits the buffer on the returned observable
 * and starts a new buffer internally, awaiting the next time `closingNotifier`
 * emits.
 *
 * <img src="./img/buffer.png" width="100%">
 *
 * @param {Observable<any>} closingNotifier an Observable that signals the
 * buffer to be emitted} from the returned observable.
 * @returns {Observable<T[]>} an Observable of buffers, which are arrays of
 * values.
 */
export function buffer<T>(closingNotifier: Observable<any>): Observable<T[]> {
  return this.lift(new BufferOperator<T>(closingNotifier));
}

export interface BufferSignature<T> {
  (closingNotifier: Observable<any>): Observable<T[]>;
}

class BufferOperator<T> implements Operator<T, T[]> {

  constructor(private closingNotifier: Observable<any>) {
  }

  call(subscriber: Subscriber<T[]>): Subscriber<T> {
    return new BufferSubscriber(subscriber, this.closingNotifier);
  }
}

class BufferSubscriber<T> extends OuterSubscriber<T, any> {
  private buffer: T[] = [];

  constructor(destination: Subscriber<T[]>, closingNotifier: Observable<any>) {
    super(destination);
    this.add(subscribeToResult(this, closingNotifier));
  }

  protected _next(value: T) {
    this.buffer.push(value);
  }

  notifyNext(outerValue: T, innerValue: any,
             outerIndex: number, innerIndex: number,
             innerSub: InnerSubscriber<T, any>): void {
    const buffer = this.buffer;
    this.buffer = [];
    this.destination.next(buffer);
  }
}
