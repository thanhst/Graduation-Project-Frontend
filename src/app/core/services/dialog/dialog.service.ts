import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DialogService {
  private dialogVisibleSubject = new BehaviorSubject<boolean>(false);
  private dialogConfigSubject = new BehaviorSubject<any>(null);


  private resolver: ((result: number) => void) | null = null;

  dialogVisible$ = this.dialogVisibleSubject.asObservable();
  dialogConfig$ = this.dialogConfigSubject.asObservable();


  open(config: any): Promise<number> {
    this.dialogConfigSubject.next(config);
    this.dialogVisibleSubject.next(true);

    return new Promise((resolve) => {
      this.resolver = resolve;  // Gán resolver để dùng trong confirm/cancel
    });
  }

  confirm() {
    this.dialogVisibleSubject.next(false);
    if (this.resolver) this.resolver(1); // 1: Yes
    this.resolver = null;
  }

  cancel() {
    this.dialogVisibleSubject.next(false);
    if (this.resolver) this.resolver(2); // 2: No
    this.resolver = null;
  }
}
