import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StreamService {
  public isMicOnSubject = new BehaviorSubject<boolean>(true);
  public isCameraOnSubject = new BehaviorSubject<boolean>(true);

  isMicOn$ = this.isMicOnSubject.asObservable();
  isCameraOn$ = this.isCameraOnSubject.asObservable();
  constructor() {
  }
  switchCameraState(){
    this.isCameraOnSubject.next(!this.isCameraOnSubject.getValue())
  }
  switchMicroState(){
    this.isMicOnSubject.next(!this.isMicOnSubject.getValue())
  }
}
