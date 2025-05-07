import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { Scheduler } from '../../../core/models/scheduler/scheduler';
import { FlagService } from '../../../core/services/flag/flag.service';

@Component({
  selector: 'app-scheduler-notif',
  imports: [CommonModule,RouterLink, RouterLinkActive],
  templateUrl: './scheduler-notif.component.html',
  styleUrl: './scheduler-notif.component.scss',
})
export class SchedulerNotifComponent {
  selectedDate: Date = new Date();
  notifClass = Array.from({ length: 20 }, () => new Scheduler());

  constructor(public flagService:FlagService){
  }
}
