import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FlagService } from '../../../core/services/flag/flag.service';
import { SchedulerComponent as SchedulerCpt } from '../../../shared/component/scheduler/scheduler.component';
@Component({
  selector: 'app-scheduler',
  imports: [SchedulerCpt,RouterLink,CommonModule],
  templateUrl: './scheduler.component.html',
  styleUrl: './scheduler.component.scss',
})
export class SchedulerComponent {
  constructor(private flagService:FlagService){
    this.flagService.setActiveScheduler(false);
    this.flagService.setActiveSchedulerNotification(true);
    this.flagService.setActiveSidebarRight(true);
    this.flagService.setTitle("Scheduler");
    this.flagService.setActiveNotif(false);
  }
}
