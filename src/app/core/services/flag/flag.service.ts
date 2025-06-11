import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FlagService {
  // Cờ trạng thái cho giao diện
  private titleSubject = new BehaviorSubject<string>('title');
  title$ = this.titleSubject.asObservable();

  private isBackSubject = new BehaviorSubject<boolean>(false);
  isBack$ = this.isBackSubject.asObservable();

  private isActiveSchedulerSubject = new BehaviorSubject<boolean>(true);
  isActiveScheduler$ = this.isActiveSchedulerSubject.asObservable();


  private isActiveSidebarRightSubject = new BehaviorSubject<boolean>(true);
  isActiveSidebarRight$ = this.isActiveSidebarRightSubject.asObservable();

  private isActiveSchedulerNotificationSubject = new BehaviorSubject<boolean>(true);
  isActiveSchedulerNotification$ = this.isActiveSchedulerNotificationSubject.asObservable();

  private isActiveNotificationSubject = new BehaviorSubject<boolean>(false);
  isActiveNotification$ = this.isActiveNotificationSubject.asObservable();

  private isShareSubject = new BehaviorSubject<boolean>(false);
  isShare$ = this.isShareSubject.asObservable();

  constructor() {}

  // Các setter và getter để cập nhật và lấy giá trị của các cờ
  setActiveScheduler(value: boolean) {
    this.isActiveSchedulerSubject.next(value);
  }

  setActiveSidebarRight(value: boolean) {
    this.isActiveSidebarRightSubject.next(value);
  }

  setActiveSchedulerNotification(value: boolean) {
    this.isActiveSchedulerNotificationSubject.next(value);
  }

  setTitle(value:string){
    this.titleSubject.next(value);
  }

  setActiveNotif(value:boolean){
    this.isActiveNotificationSubject.next(value);
  }
  setBack(value:boolean){
    this.isBackSubject.next(value);
  }

  setIsShare(value:boolean){
    this.isShareSubject.next(value);
  }

  getIsShare(){
    return this.isShareSubject.getValue();
  }
}
