import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SchedulerComponent as SchedulerCpt } from '../../../shared/component/scheduler/scheduler.component';
@Component({
  selector: 'app-scheduler',
  imports: [SchedulerCpt,RouterLink,CommonModule],
  templateUrl: './scheduler.component.html',
  styleUrl: './scheduler.component.scss'
})
export class SchedulerComponent {
  
}
