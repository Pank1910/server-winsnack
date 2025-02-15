import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ModalService {
  private modalStateSubject = new Subject<boolean>();
  modalState$ = this.modalStateSubject.asObservable();

  open() {
    this.modalStateSubject.next(true);
  }

  close() {
    this.modalStateSubject.next(false);
  }
}
