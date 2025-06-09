import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-room',
  imports: [CommonModule],
  templateUrl: './room.component.html',
  styleUrl: './room.component.scss'
})
export class RoomComponent {
  @Input() startTime: Date = new Date();
  @Input() roomTitle: string = '';
  @Input() roomId: string = '';

  constructor(private router: Router) { }
  onJoin() {
    this.router.navigate([`/meeting/${this.roomId}/waiting-room`]);
  }
}
