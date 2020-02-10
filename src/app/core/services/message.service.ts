import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MessageService {
  messages$: Subject<string> = new Subject<string>();

  add(message: string) {
    this.messages$.next(message);
  }
}
