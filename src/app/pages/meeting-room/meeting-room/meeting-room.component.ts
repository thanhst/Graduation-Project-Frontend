import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { User } from '../../../core/models/user/user';
import { StreamService } from '../../../core/services/stream/stream.service';
import { UserMeetingComponent } from "../../../shared/object-ui/user-meeting/user-meeting.component";
import { UserComponent } from "../../../shared/object-ui/user/user.component";
import { MeetingService } from '../../../core/websocket/meeting/meeting.service';

@Component({
  selector: 'app-meeting-room',
  imports: [UserMeetingComponent, CommonModule, ReactiveFormsModule, UserComponent],
  templateUrl: './meeting-room.component.html',
  styleUrl: './meeting-room.component.scss'
})
export class MeetingRoomComponent {
  @ViewChild('video') videoElement!: ElementRef<HTMLVideoElement>;
  form: FormGroup;
  host:User = new User;
  userInRoom:User[] = []
  userInWaitingRoom: User[] = []

  constructor(public streamService: StreamService, private fb: FormBuilder,
    private wsService:MeetingService
  ) {
    this.form = this.fb.group({
      'shareState': ['', Validators.required],
      'password': ['', Validators.minLength(6)],
      'hostId': [''],
      'roleJoin': ['', Validators.required]
    });
  }
  async ngAfterViewInit() {
    this.stream = await this.streamService.cameraService(this.stream, this.videoElement);
    this.streamService.isCameraOn$.subscribe(value => {
      this.isCamOn = value;
      const videoTrack = this.stream.getVideoTracks()[0];
      videoTrack.enabled = this.streamService.isCameraOnSubject.getValue();
    })
    this.streamService.isMicOn$.subscribe(value => {
      this.isMicOn = value;
      const audioTrack = this.stream.getAudioTracks()[0];
      audioTrack.enabled = this.streamService.isMicOnSubject.getValue();
    })
  }

  stream!: MediaStream;
  isMicOn: boolean = true;
  isCamOn: boolean = true;
  isShare: boolean = false;
  isSetting: boolean = false;
  isManageMember: boolean = false;

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.form.get('password')!.valueChanges.subscribe(value => {
      const numericValue = value.replace(/\D/g, '');
      if (value !== numericValue) {
        this.form.get('password')!.setValue(numericValue, { emitEvent: false });
      }
    });
  }
  ngOnDestroy(): void {
    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop());
    }
  }

  toggleCamera() {
    this.streamService.switchCameraState();
    const videoTrack = this.stream.getVideoTracks()[0];
    videoTrack.enabled = this.streamService.isCameraOnSubject.getValue();
  }

  toggleMicro() {
    this.streamService.switchMicroState();
    const audioTrack = this.stream.getAudioTracks()[0];
    audioTrack.enabled = this.streamService.isMicOnSubject.getValue();
  }
  toggleShare() {
    if (this.isShare) {
      this.isShare = false;
    } else {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getDisplayMedia) {
        console.error('Trình duyệt không hỗ trợ chia sẻ màn hình.');
        return;
      }

      const displayMediaOptions = {
        video: {
          cursor: 'always'
        },
        audio: false
      } as any;

      navigator.mediaDevices.getDisplayMedia(displayMediaOptions)
        .then(
          (stream) => {
            this.isShare = true;
            const shardElement = this.videoElement.nativeElement;
            if (shardElement) {
              if (this.stream) {
                this.stream.getTracks().forEach(track => track.stop());
              }
              shardElement.srcObject = stream;
              shardElement.play();
            }
            const [track] = stream.getVideoTracks();
            track.addEventListener('ended', async () => {
              if (shardElement) {
                this.isShare = false;
                shardElement.srcObject = null;
                setTimeout(async () => {
                  this.stream = await this.streamService.cameraService(this.stream, this.videoElement);
                }, 1000)
              }
            });
          })
        .catch((err) => {
          console.error('Lỗi chia sẻ màn hình:', err);
        });
    }
  }

  switchSetting() {
    this.isSetting = !this.isSetting;
  }

  switchMember() {
    this.isManageMember = !this.isManageMember;
  }
}
