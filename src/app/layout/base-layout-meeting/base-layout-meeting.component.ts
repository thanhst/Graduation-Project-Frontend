import { Component } from '@angular/core';
import { ActivatedRoute, RouterOutlet } from '@angular/router';
import { DialogService } from '../../core/services/dialog/dialog.service';
import { RoomService } from '../../core/services/room/room.service';
import { MeetingService } from '../../core/websocket/meeting/meeting.service';

@Component({
  selector: 'app-base-layout-meeting',
  imports: [RouterOutlet],
  templateUrl: './base-layout-meeting.component.html',
  styleUrl: './base-layout-meeting.component.scss'
})
export class BaseLayoutMeetingComponent {
  constructor(
    private route: ActivatedRoute,
    private wsService: MeetingService,
    private rooomService: RoomService,
    private dialogService:DialogService,
  ) { }

  ngOnInit(): void {
    const roomId = this.route.snapshot.paramMap.get('id')!;
    const userId = localStorage.getItem('user_id')!;
    this.rooomService.getRoom(roomId).subscribe({
      next: (room) => {
        const hostRoom = room.host;
        let role = "";
        if (userId !== hostRoom) {
          role = 'guest';
        } else {
          role = 'host';
        }
        this.wsService.connect({ roomId, userId, role })
      },
      error:(err)=>{
        this.dialogService.setIsQuestion(false);
        this.dialogService.open({
          content:err.error
        })
        setTimeout(()=>{
          this.dialogService.cancel()
          this.dialogService.setIsQuestion(true);
        },3000)
      }
    })
  }

  ngOnDestroy(): void {
    this.wsService.disconnect();
  }
}
