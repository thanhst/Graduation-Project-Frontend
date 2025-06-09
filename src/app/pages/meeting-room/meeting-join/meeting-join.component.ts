import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DialogService } from '../../../core/services/dialog/dialog.service';
import { MediaService } from '../../../core/websocket/media/media.service';

@Component({
  selector: 'app-meeting-join',
  imports: [CommonModule],
  templateUrl: './meeting-join.component.html',
  styleUrl: './meeting-join.component.scss'
})
export class MeetingJoinComponent {
  @ViewChild('video') videoElement!: ElementRef<HTMLVideoElement>;
  constructor(public mediaService: MediaService,private diaglogService:DialogService,
    private router:Router,  private route: ActivatedRoute
  ) {
  }
  async ngAfterViewInit() {
    try {
      this.stream = await navigator.mediaDevices.getUserMedia({
        video: true, audio: true
      });
      const videoTrack = this.stream.getVideoTracks()[0];
      videoTrack.enabled = this.mediaService.isCameraOnSubject.getValue();
      const audioTrack = this.stream.getAudioTracks()[0];
      audioTrack.enabled = this.mediaService.isMicOnSubject.getValue();
      
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
  isMicOn:boolean = true;
  isCamOn:boolean =true;
  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.mediaService.isCameraOn$.subscribe(value=>{
      this.isCamOn = value;
    })
    this.mediaService.isMicOn$.subscribe(value=>{
      this.isMicOn = value;
    })
  }
  ngOnDestroy(): void {
    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop());
    }
  }

  toggleCamera() {
    this.mediaService.switchCameraState();
    const videoTrack = this.stream.getVideoTracks()[0];
    videoTrack.enabled = this.mediaService.isCameraOnSubject.getValue();
  }
  
  toggleMicro() {
    this.mediaService.switchMicroState();
    const audioTrack = this.stream.getAudioTracks()[0];
    audioTrack.enabled = this.mediaService.isMicOnSubject.getValue();
  }

  async onLeave(){
    this.diaglogService.setIsQuestion(true);
    const result = await this.diaglogService.open({
      content:'Do you want to leave this room?',
      yesText:'Yes',
      noText:'No'
    })
    if(result === 1){
      this.router.navigate(['meeting/start']);
    }
  }
}
