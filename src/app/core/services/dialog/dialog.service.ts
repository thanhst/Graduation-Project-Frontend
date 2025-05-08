// dialog.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DialogService {
  private dialogVisibleSubject = new BehaviorSubject<boolean>(false);
  private dialogConfigSubject = new BehaviorSubject<any>(null);

  dialogVisible$ = this.dialogVisibleSubject.asObservable();
  dialogConfig$ = this.dialogConfigSubject.asObservable();

  open(config: any): Promise<number> {
    return new Promise((resolve) => {
      this.dialogConfigSubject.next(config);
      this.dialogVisibleSubject.next(true);

      this.dialogConfigSubject.subscribe(() => {
        this.dialogVisible$.subscribe(() => {
          this.dialogVisibleSubject.next(true);
        });
      });

      this.dialogVisibleSubject.subscribe((visible) => {
        if (!visible) resolve(2);
      });
    });
  }

  close() {
    this.dialogVisibleSubject.next(false);
  }

  confirm() {
    this.close();
    return 1;
  }

  cancel() {
    this.close();
    return 2;
  }
}
