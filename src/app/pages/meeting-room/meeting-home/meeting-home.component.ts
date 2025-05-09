import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';

@Component({
  selector: 'app-meeting-home',
  imports: [CommonModule],
  templateUrl: './meeting-home.component.html',
  styleUrl: './meeting-home.component.scss'
})
export class MeetingHomeComponent {
  @ViewChild('video') videoElement!: ElementRef<HTMLVideoElement>;

  async ngAfterViewInit() {
    try {
      this.stream = await navigator.mediaDevices.getUserMedia({
        video: true, audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        }
      });
      this.videoElement.nativeElement.srcObject = this.stream;
      this.videoElement.nativeElement.muted = true;

      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const mediaStreamSource = audioContext.createMediaStreamSource(this.stream);
      const gainNode = audioContext.createGain();
      gainNode.gain.value = 1;

      mediaStreamSource.connect(gainNode);
      // gainNode.connect(audioContext.destination);
    } catch (err) {
    }
  }

  stream!: MediaStream;
  isCameraOn = true;
  isMicOn = true;

  toggleCamera() {
    this.isCameraOn = !this.isCameraOn;
    const videoTrack = this.stream.getVideoTracks()[0];
    videoTrack.enabled = this.isCameraOn;
  }

  toggleMicro() {
    this.isMicOn = !this.isMicOn;
    const audioTrack = this.stream.getAudioTracks()[0];
    audioTrack.enabled = this.isMicOn;
  }
}
