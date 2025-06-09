import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ClassService } from '../../../core/services/class/class.service';
import { DialogService } from '../../../core/services/dialog/dialog.service';
import { LoadingService } from '../../../core/services/loading/loading.service';
import { MeetingService } from '../../../core/websocket/meeting/meeting.service';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user.component.html',
  styleUrl: './user.component.scss'
})
export class UserComponent {
  @Input() classId: string = '';
  @Input() userId: string = '';
  @Input() username: string = '';
  @Input() src: string = '';
  @Input() type: 'view' | 'request' = 'view';
  @Input() submitFun!: Function
  @Input() unSubmitFun!:Function
  @Output() accepted = new EventEmitter<string>();
  @Input () role: string = localStorage.getItem("role") || "";
  myId: string = localStorage.getItem("user_id") || ""
  constructor(
    private dialogService: DialogService,
    private loadingService: LoadingService,
    private classService: ClassService,
    private meetingService:MeetingService
  ) {}

  async onSubmit() {
    this.dialogService.setIsQuestion(true);
    const result = await this.dialogService.open({
      content: "Accept this student?",
      yesText: "Yes",
      noText: "No"
    });

    if (result === 1) {
      this.loadingService.show();
      this.submitFun(this.userId,()=>this.accepted.emit(this.userId))
    }
  }

  async onRemove() {
    this.dialogService.setIsQuestion(true);
    const result = await this.dialogService.open({
      content: "Reject this student ?",
      yesText: "Yes",
      noText: "No"
    });

    if (result === 1) {
      this.loadingService.show();
      this.unSubmitFun(this.userId,()=>this.accepted.emit(this.userId));
    }
  }
}
