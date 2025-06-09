import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DialogService } from '../../../core/services/dialog/dialog.service';
import { LoadingService } from '../../../core/services/loading/loading.service';
import { StreamService } from '../../../core/services/stream/stream.service';
import { UserService } from '../../../core/services/user/user.service';
import { MediaService } from '../../../core/websocket/media/media.service';
import { MeetingService } from '../../../core/websocket/meeting/meeting.service';
import { UserMeetingComponent } from "../../../shared/object-ui/user-meeting/user-meeting.component";
import { UserComponent } from "../../../shared/object-ui/user/user.component";

@Component({
  selector: 'app-meeting-room',
  imports: [UserMeetingComponent, CommonModule, ReactiveFormsModule, UserComponent],
  templateUrl: './meeting-room.component.html',
  styleUrl: './meeting-room.component.scss'
})
export class MeetingRoomComponent {
  @ViewChild('video') videoElement!: ElementRef<HTMLVideoElement>;
  form: FormGroup;
  userId: string = localStorage.getItem("user_id") || "";

  constructor(public streamService: StreamService, private fb: FormBuilder,
    public meetingService: MeetingService, private dialogService: DialogService,
    private loadingService: LoadingService, private router: Router, private mediaService: MediaService,
    private activeRoute: ActivatedRoute, public userService:UserService
  ) {
    const roomId = this.activeRoute.parent?.snapshot.paramMap.get('id')!;
    this.form = this.fb.group({
      'shareState': [this.meetingService.shareState ? "Allow" : "Forbid", Validators.required],
      'hostId': [this.meetingService.host?.userId],
      'roleJoin': [this.meetingService.autoJoin ? "Auto" : "Waiting", Validators.required]
    });

    this.meetingService.host$.subscribe((host) => {
      if (host) {
        this.form.patchValue({ hostId: host.userId });
      }
    });
    this.meetingService.autoJoin$.subscribe((value) => {
      if (value) {
        this.form.patchValue({ roleJoin: "Auto" });
      } else {
        this.form.patchValue({ roleJoin: "Waiting" });
      }
    });
    this.meetingService.shareState$.subscribe((value) => {
      if (value) {
        this.form.patchValue({ shareState: "Allow" });
      } else {
        this.form.patchValue({ shareState: "Forbid" });
      }
    });
    setTimeout(() => {
      this.mediaService.connect(this.userId, roomId, "guest", this.mediaService.isCameraOnSubject.getValue(), this.mediaService.isMicOnSubject.getValue());
    },10)
  }
  ngAfterViewInit() {
    this.streamService.stream$.subscribe(streamMap => {
      const userStream = streamMap.get(this.meetingService.host?.userId||"");
      if (userStream) {
        this.isCamOn = userStream.isCamOn;
        this.isMicOn = userStream.isMicOn;
        const stream = userStream.stream;
        if (stream != null) {
          this.videoElement.nativeElement.srcObject = userStream.stream;
        }
        this.videoElement.nativeElement.muted = ( this.userId === userStream.userId);
      }
    });
  }

  stream!: MediaStream;
  isMicOn: boolean = true;
  isCamOn: boolean = true;
  isShare: boolean = false;
  isSetting: boolean = false;
  isManageMember: boolean = false;

  ngOnInit(): void {
  }
  ngOnDestroy(): void {
    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop());
    }
  }

  toggleCamera() {
    const currentCamera = this.mediaService.getLocalStream()?.stream
    if (currentCamera != null) {
      this.isCamOn = !this.isCamOn
      this.mediaService.switchCameraState();
      const videoTrack = currentCamera.getVideoTracks()[0];
      videoTrack.enabled = this.mediaService.isCameraOnSubject.getValue();
      if (!this.mediaService.isCameraOnSubject.getValue()) {
        videoTrack.stop
      }
    }
  }

  toggleMicro() {
    const currentCamera = this.mediaService.getLocalStream()?.stream
    if (currentCamera != null) {
      this.isMicOn = !this.isMicOn
      this.mediaService.switchMicroState();
      const audioTrack = currentCamera.getAudioTracks()[0];
      audioTrack.enabled = this.mediaService.isMicOnSubject.getValue();
    }
  }
  toggleShare() {
    if (this.isShare) {
      this.isShare = false;
    } else {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getDisplayMedia) {
        console.error('Browser cannot support to share screen!');
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
              stream.getTracks().forEach(track=>{
                this.mediaService.peerConnection?.addTrack(track);
              })
              const streams = [];
              streams.push({ trackId: stream.getVideoTracks()[0].id, type: "screen" })

            }
            const [track] = stream.getVideoTracks();
            track.addEventListener('ended', async () => {
              if (shardElement) {
                this.isShare = false;
                shardElement.srcObject = null;
                setTimeout(async () => {
                  // this.stream = await this.mediaService.cameraService(this.stream, this.videoElement);
                }, 1000)
              }
            });
          })
        .catch((err) => {
          console.error('Error to share screen:', err);
        });
    }
  }

  switchSetting() {
    this.isSetting = !this.isSetting;
  }

  switchMember() {
    this.isManageMember = !this.isManageMember;
  }

  addUser(userId: string) {
    this.meetingService.send({
      event: "accept_user",
      data: {
        "user_id": userId
      }
    })
    this.dialogService.cancel();
    this.dialogService.setIsQuestion(true);
    this.loadingService.hide();
  }
  removeUser(userId: string) {
    this.meetingService.send({
      event: "remove_user",
      data: {
        "user_id": userId
      }
    })
    this.dialogService.cancel();
    this.dialogService.setIsQuestion(true);
    this.loadingService.hide();
  }
  async outRoom() {
    if (this.meetingService.host != null) {
      if (this.userId == this.meetingService.host.userId) {
        this.dialogService.setIsQuestion(true);
        const result = await this.dialogService.open({
          content: "Close this room?",
          yesText: "Yes",
          noText: "No"
        })
        if (result == 1) {
          this.isShare=false;
          this.meetingService.send({
            event: "close_room",
            data: {}
          })
          setTimeout(() => {
            this.loadingService.hide();
            this.router.navigate(["/meeting/start"])
          }, 500)
        }
      } else {
        this.dialogService.setIsQuestion(true);
        const result = await this.dialogService.open({
          content: "Leave this room?",
          yesText: "Yes",
          noText: "No"
        })
        if (result == 1) {
          this.dialogService.cancel();
          this.loadingService.show();
          setTimeout(() => {
            this.loadingService.hide();
            this.router.navigate(["/meeting/start"])
          }, 500)
        }
      }
    }
  }
  async submitSettingRoom() {
    this.loadingService.show();
    this.dialogService.setIsQuestion(true);
    const result = await this.dialogService.open({
      content: "Are you sure with settings ? ",
      yesText: "Yes",
      noText: "No"
    })
    if (result == 1) {
      var autoShare;
      var newHostId;
      var autoJoin;
      if (this.form.get("shareState")?.value == "Allow") {
        autoShare = true;
      } else {
        autoShare = false;
      }
      this.meetingService.send({
        event: "toggle_share",
        data: {
          "allow_share": autoShare,
        }
      })
      if (this.form.get("roleJoin")?.value == "Auto") {
        autoJoin = true;
      } else {
        autoJoin = false;
      }
      this.meetingService.send({
        event: "toggle_auto_join",
        data: {
          "auto_join": autoJoin,
        }
      })
      if (this.form.get("hostId")?.value != this.meetingService.host?.userId && this.form.get("hostId")?.value != null) {
        newHostId = this.form.get("hostId")?.value
        this.meetingService.send({
          event: "tranfer_host",
          data: {
            "newHostId": newHostId,
          }
        })
        this.isSetting = false;
      }
    }
    this.loadingService.hide();
  }
}
