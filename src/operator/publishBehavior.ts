import {BehaviorSubject} from '../subject/BehaviorSubject';
import {multicast} from './multicast';
import {ConnectableObservable} from '../observable/ConnectableObservable';

export function publishBehavior<T>(value: T): ConnectableObservable<T> {
  return multicast.call(this, new BehaviorSubject<T>(value));
}
