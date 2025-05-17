import { CommonModule } from '@angular/common';
import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { StreamService } from '../../../core/services/stream/stream.service';

@Component({
  selector: 'app-user-meeting',
  imports: [CommonModule],
  templateUrl: './user-meeting.component.html',
  styleUrl: './user-meeting.component.scss'
})
export class UserMeetingComponent {
  @Input() userId:string = '';
  imgAvatar:string='url';
  public stream!: MediaStream;

  isOpenShare:boolean = false;
  emotion: 'Fear'|'Happy'|'Neutral'|'Sad'|'Surprise'|null  = 'Sad';

  @ViewChild('video') videoElement!: ElementRef<HTMLVideoElement>;
  constructor(public streamService: StreamService) {
  }
  async ngAfterViewInit() {
    this.stream = await this.streamService.cameraService(this.stream,this.videoElement);
    this.streamService.isCameraOn$.subscribe(value=>{
      this.isCamOn = value;
      const videoTrack = this.stream.getVideoTracks()[0];
      videoTrack.enabled = this.streamService.isCameraOnSubject.getValue();
    })
    this.streamService.isMicOn$.subscribe(value=>{
      this.isMicOn = value;
      const audioTrack = this.stream.getAudioTracks()[0];
      audioTrack.enabled = this.streamService.isMicOnSubject.getValue();
    })
  }

  isMicOn:boolean = true;
  isCamOn:boolean =true;
  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    
  }
  ngOnDestroy(): void {
    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop());
    }
  }
}
