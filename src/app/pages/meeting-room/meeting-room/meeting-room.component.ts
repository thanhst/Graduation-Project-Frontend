import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DialogService } from '../../../core/services/dialog/dialog.service';
import { FlagService } from '../../../core/services/flag/flag.service';
import { LoadingService } from '../../../core/services/loading/loading.service';
import { StreamService } from '../../../core/services/stream/stream.service';
import { UserService } from '../../../core/services/user/user.service';
import { MediaService } from '../../../core/websocket/media/media.service';
import { MeetingService } from '../../../core/websocket/meeting/meeting.service';
import { UserMeetingComponent } from "../../../shared/object-ui/user-meeting/user-meeting.component";
import { UserComponent } from "../../../shared/object-ui/user/user.component";
import { BehaviorSubject } from 'rxjs';

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
  roomId: string = "";
  hostId: string = "";
  constructor(public streamService: StreamService, private fb: FormBuilder,
    public meetingService: MeetingService, private dialogService: DialogService,
    private loadingService: LoadingService, private router: Router, public mediaService: MediaService,
    private activeRoute: ActivatedRoute, public userService: UserService, public flagService: FlagService
  ) {
    this.roomId = this.activeRoute.parent?.snapshot.paramMap.get('id')!;
    this.form = this.fb.group({
      'shareState': [this.meetingService.shareState ? "Allow" : "Forbid", Validators.required],
      'hostId': [this.meetingService.host?.userId],
      'roleJoin': [this.meetingService.autoJoin ? "Auto" : "Waiting", Validators.required]
    });

    this.meetingService.host$.subscribe((host) => {
      if (host) {
        this.form.patchValue({ hostId: host.userId });
        this.hostId = host.userId;
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
    this.isShare = this.flagService.getIsShare();
    this.flagService.isShare$.subscribe(value => {
      this.isShare = value;
    })
    this.mediaService.isCameraOn$.subscribe(value => {
      this.isCamOn = value
    })
    this.mediaService.isMicOn$.subscribe(value => {
      this.isMicOn = value
    })
    setTimeout(() => {
      this.mediaService.connect(this.userId, this.roomId, "guest");
    }, 10)
  }
  ngAfterViewInit() {
    this.streamService.stream$.subscribe(streamMap => {
      if (!this.isShare) {
        if (this.videoElement.nativeElement.srcObject == null) {
          const userStream = streamMap.get(this.meetingService.host?.userId || "");
          if (userStream) {
            const stream = userStream.stream;
            if (stream != null) {
              this.videoElement.nativeElement.srcObject = stream;
              this.isHostCamOn = userStream.isCamOn
            }
            if (!userStream.onChange$) {
              userStream.onChange$ = new BehaviorSubject<void>(undefined);
              userStream.onChange$?.subscribe(() => {
                this.isHostCamOn = userStream.isCamOn
              })
            }
            this.videoElement.nativeElement.muted = (this.userId === userStream.userId);
          }
        }
      }
    });
    this.mediaService.shareStream$.subscribe((stream) => {
      if (stream != null && this.flagService.getIsShare() == true) {
        this.stream = stream
        this.videoElement.nativeElement.srcObject = this.stream;
      } else if (this.flagService.getIsShare() == false) {
        const streamMap = this.streamService.getStream();
        const userStream = streamMap.get(this.meetingService.host?.userId || "");
        if (userStream) {
          const stream = userStream.stream;
          if (stream != null) {
            this.videoElement.nativeElement.srcObject = stream;
            this.isHostCamOn = userStream.isCamOn
          }
          this.videoElement.nativeElement.muted = (this.userId === userStream.userId);
        }
      }
    })
  }

  stream!: MediaStream;
  isMicOn: boolean = true;
  isCamOn: boolean = true;
  isShare: boolean = false;
  isSetting: boolean = false;
  isManageMember: boolean = false;
  isHostCamOn: boolean = false;

  ngOnInit(): void {
  }
  ngOnDestroy(): void {
    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop());
      this.videoElement.nativeElement.srcObject = null;
      this.mediaService.disconnect();
    }
  }

  toggleCamera() {
    this.mediaService.switchCameraState();
  }

  toggleMicro() {
    this.mediaService.switchMicroState();
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
          cursor: 'always',
          width: { ideal: 1280 },
          height: { ideal: 720 },
          frameRate: { ideal: 30, max: 30 }
        },
        audio: false
      } as any;

      navigator.mediaDevices.getDisplayMedia(displayMediaOptions)
        .then(
          async (stream) => {
            this.isShare = true;
            const shardElement = this.videoElement.nativeElement;
            if (shardElement) {
              if (this.stream) {
                this.stream.getTracks().forEach(track => track.stop());
              }
              shardElement.srcObject = stream;
              shardElement.play();
              stream.getTracks().forEach(track => {
                this.mediaService.peerConnection?.addTrack(track, stream);
              })
              const streams = [];
              streams.push({ trackId: stream.getVideoTracks()[0].id, type: "screen" })
              this.flagService.setIsShare(true);
              if (this.mediaService.peerConnection) {
                this.mediaService.sendOffer(this.mediaService.peerConnection, this.userId, this.roomId, streams)
                this.mediaService.send({
                  event: "start-share",
                  userId: this.userId,
                  payload: {
                  },
                })
              }
            }
            const [track] = stream.getVideoTracks();
            track.addEventListener('ended', async () => {
              if (shardElement) {
                this.isShare = false;
                shardElement.srcObject = null;
                this.flagService.setIsShare(false);
                this.mediaService.send({
                  event: "stop-share",
                  userId: this.userId,
                  payload: {
                  },
                })
                setTimeout(async () => {
                  this.streamService.stream$.subscribe(streamMap => {
                    const userStream = streamMap.get(this.meetingService.host?.userId || "");
                    if (userStream) {
                      const stream = userStream.stream;
                      if (stream != null) {
                        this.videoElement.nativeElement.srcObject = stream;
                      }
                      this.videoElement.nativeElement.muted = (this.userId === userStream.userId);
                    }
                  });
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
          this.isShare = false;
          this.meetingService.send({
            event: "close_room",
            data: {}
          })
          setTimeout(() => {
            this.loadingService.hide();
            window.location.href = '/meeting/start';
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

  trackByKey(index: number, item: any) {
    return item.key;
  }
}
