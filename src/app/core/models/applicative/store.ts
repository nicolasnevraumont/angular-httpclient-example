import { BehaviorSubject, Observable } from 'rxjs';

export class Store<T> {
  // Using a behavior subject so we can provide a default value
  protected state$: BehaviorSubject<T>;

  protected constructor(initialState: T) {
    // Setting the default state
    this.state$ = new BehaviorSubject(initialState);
  }

  getState(): Observable<T> {
    return this.state$.asObservable();
  }

  setState(nextState: T): void {
    this.state$.next(nextState);
  }
}
