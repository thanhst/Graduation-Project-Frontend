import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, ElementRef, Input, ViewChild } from '@angular/core';
import { User } from '../../../core/models/user/user';
import { StreamService } from '../../../core/services/stream/stream.service';
import { MediaService } from '../../../core/websocket/media/media.service';

@Component({
  selector: 'app-user-meeting',
  imports: [CommonModule],
  templateUrl: './user-meeting.component.html',
  styleUrl: './user-meeting.component.scss'
})
export class UserMeetingComponent {
  @Input() user: User = new User();
  @Input() hostId: string = "";
  public stream!: MediaStream;
  public role: string = "";
  localUser:string = localStorage.getItem("user_id")|| ""
  isOpenShare: boolean = false;
  emotion: 'Fear' | 'Happy' | 'Neutral' | 'Sad' | 'Surprise' | null = "Fear";

  @ViewChild('video') videoElement!: ElementRef<HTMLVideoElement>;
  constructor(public streamService: StreamService, public mediaService: MediaService, private cdr: ChangeDetectorRef) {
  }
  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    if (this.hostId != this.user.userId) {
      this.role = "guess"
    } else {
      this.role = "host"
    }
  }
  async ngAfterViewInit() {
    const userId = this.user.userId
    this.streamService.stream$.subscribe(streamMap => {
      const userStream = streamMap.get(userId);
      if (userStream) {
        this.isCamOn = userStream.isCamOn;
        this.isMicOn = userStream.isMicOn;
        const stream = userStream.stream;
        if (stream != null) {
          this.videoElement.nativeElement.srcObject = userStream.stream;
        }
        this.videoElement.nativeElement.muted = ( this.localUser === userStream.userId);
        this.cdr.detectChanges()
      }
    });
  }

  isMicOn: boolean = true;
  isCamOn: boolean = true;

  ngOnDestroy(): void {
    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop());
    }
  }
}
