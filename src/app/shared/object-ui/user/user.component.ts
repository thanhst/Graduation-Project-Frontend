import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ClassService } from '../../../core/services/class/class.service';
import { DialogService } from '../../../core/services/dialog/dialog.service';
import { LoadingService } from '../../../core/services/loading/loading.service';

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
  @Output() accepted = new EventEmitter<string>();
  role: string = localStorage.getItem("role") || "";
  myId: string = localStorage.getItem("user_id") || ""
  constructor(
    private dialogService: DialogService,
    private loadingService: LoadingService,
    private classService: ClassService
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
      this.classService.acceptClass(this.classId, this.userId).subscribe({
        next: (data) => {
          this.loadingService.hide();
          this.dialogService.setIsQuestion(false);
          this.dialogService.open({
            content: data.message,
          });
          setTimeout(() => {
            this.dialogService.cancel();
          }, 5000);
          this.accepted.emit(this.userId);
        },
        error: () => {
          this.loadingService.hide();
          this.dialogService.setIsQuestion(false);
          this.dialogService.open({
            content: 'Error to accept!',
          });
          setTimeout(() => {
            this.dialogService.cancel();
          }, 5000);
        }
      });
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
      this.classService.rejectClass(this.classId, this.userId).subscribe({
        next: (data) => {
          this.loadingService.hide();
          this.accepted.emit(this.userId);
          this.dialogService.setIsQuestion(false);
          this.dialogService.open({
            content: data.message,
          });
          setTimeout(() => {
            this.dialogService.cancel();
          }, 1000);
        },
        error: () => {
          this.loadingService.hide();
          this.dialogService.setIsQuestion(false);
          this.dialogService.open({
            content: 'Error to accept!',
          });
          setTimeout(() => {
            this.dialogService.cancel();
          }, 5000);
        }
      });
    }
  }
}
