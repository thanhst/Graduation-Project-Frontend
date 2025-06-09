import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Room } from '../../../core/models/room/room';
import { DialogService } from '../../../core/services/dialog/dialog.service';
import { LoadingService } from '../../../core/services/loading/loading.service';
import { RoomService } from '../../../core/services/room/room.service';
import { UserService } from '../../../core/services/user/user.service';
import { MediaService } from '../../../core/websocket/media/media.service';

@Component({
  selector: 'app-meeting-home',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './meeting-home.component.html',
  styleUrl: './meeting-home.component.scss'
})
export class MeetingHomeComponent {
  form: FormGroup;
  user_id: string = localStorage.getItem("user_id") || ""
  @ViewChild('video') videoElement!: ElementRef<HTMLVideoElement>;
  constructor(public mediaService: MediaService, fb: FormBuilder, private loadingService: LoadingService,
    private roomService: RoomService, private router: Router, private dialogService: DialogService,
    public userService: UserService,
  ) {
    this.form = fb.group({
      roomId: ['', Validators.required],
    })
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
  isMicOn: boolean = true;
  isCamOn: boolean = true;
  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.mediaService.isCameraOn$.subscribe(value => {
      this.isCamOn = value;
    })
    this.mediaService.isMicOn$.subscribe(value => {
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

  createNewMeeting() {
    this.loadingService.show();
    const room = new Room(
      "",
      null,
      "opening",
      this.user_id,
      new Date(),
      null
    )
    this.roomService.createRoom(room).subscribe({
      next: (room) => {
        this.loadingService.hide();
        this.router.navigate([`meeting/${room.roomID}/room`]);
      },
      error: (err) => {
        this.loadingService.hide();
        this.dialogService.setIsQuestion(false);
        this.dialogService.open({
          content: err.error
        })
        setTimeout(() => {
          this.dialogService.cancel()
        }, 3000)
      }
    })
  }
  async joinRoom() {
    this.form.markAllAsTouched();
    if (this.form.invalid) {
      return;
    } else {
      this.dialogService.setIsQuestion(true)
      const result = await this.dialogService.open({
        content: "Ready to join this room?",
        yesText: "Yes",
        noText: "No",
      })
      if (result == 1) {
        this.loadingService.show();
        this.roomService.getRoom(this.form.get("roomId")?.value).subscribe({
          next:(room)=>{
            this.loadingService.hide();
            this.router.navigate(["/meeting/"+room.roomID+"/waiting-room"])
          },
          error:(err)=>{
            this.loadingService.hide();
            this.dialogService.setIsQuestion(true)
            this.dialogService.open({
              content: err,
            })
            setTimeout(()=>{
              this.dialogService.cancel();
            },3000)
          }
        })
      }
    }
  }
}
