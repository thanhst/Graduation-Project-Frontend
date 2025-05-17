import { ElementRef, Injectable } from '@angular/core';
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
  async cameraService(stream:MediaStream,videoRef: ElementRef<HTMLVideoElement>): Promise<MediaStream>{
    try {
      stream = await navigator.mediaDevices.getUserMedia({
        video: true, audio: true
      });
      const videoTrack = stream.getVideoTracks()[0];
      videoTrack.enabled = this.isCameraOnSubject.getValue();
      const audioTrack = stream.getAudioTracks()[0];
      audioTrack.enabled = this.isMicOnSubject.getValue();
      videoRef.nativeElement.srcObject = stream;
      videoRef.nativeElement.muted = true;

      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const mediaStreamSource = audioContext.createMediaStreamSource(stream);
      const gainNode = audioContext.createGain();
      gainNode.gain.value = 1;

      mediaStreamSource.connect(gainNode);
      return stream;
      // gainNode.connect(audioContext.destination);
    } catch (err) {
      throw err;
    }
  }
}
