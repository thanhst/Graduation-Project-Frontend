import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { FlagService } from '../../../core/services/flag/flag.service';
import { SchedulerService } from '../../../core/services/scheduler/scheduler.service';

@Component({
  selector: 'app-scheduler-notif',
  imports: [CommonModule,RouterLink, RouterLinkActive],
  templateUrl: './scheduler-notif.component.html',
  styleUrl: './scheduler-notif.component.scss',
})
export class SchedulerNotifComponent {

  constructor(public flagService:FlagService,public schedulerService:SchedulerService,private cdr:ChangeDetectorRef){

  }
  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.

  }
}
