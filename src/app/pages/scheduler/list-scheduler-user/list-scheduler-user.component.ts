import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Scheduler } from '../../../core/models/scheduler/scheduler';
import { FlagService } from '../../../core/services/flag/flag.service';
import { LoadingService } from '../../../core/services/loading/loading.service';
import { SchedulerService } from '../../../core/services/scheduler/scheduler.service';

@Component({
  selector: 'app-list-scheduler-user',
  imports: [RouterLink, CommonModule],
  templateUrl: './list-scheduler-user.component.html',
  styleUrl: './list-scheduler-user.component.scss',
})
export class ListSchedulerUserComponent {

  mySchedulers: Scheduler[] = [];
  userId:string = localStorage.getItem("user_id") || ""
  currentPage = 1;
  itemsPerPage = 5;

  constructor(private route: Router, private flagService: FlagService,
    private schedulerService:SchedulerService,
    private router: ActivatedRoute,private loadingService:LoadingService) {
    this.flagService.isBack$.subscribe(isBack => {
      if (isBack === true) {
        this.setFlag();
      }
    })
    this.flagService.setBack(false);
    this.setFlag();
    this.router.data.subscribe((data) => {
      this.mySchedulers = data['data']["all"]
    });
  }

  setFlag() {
    this.flagService.setActiveScheduler(true);
    this.flagService.setActiveSchedulerNotification(true);
    this.flagService.setActiveSidebarRight(true);
    this.flagService.setTitle("Scheduler");
    this.flagService.setActiveNotif(false);
  }

  // generateMockData(count: number) {
  //   for (let i = 1; i <= count; i++) {
  //     this.mySchedulers.push({
  //       getId: () => i,
  //       getTitle: () => `Schedule Title ${i}`,
  //       getClassname: () => `Class ${i}`
  //     });
  //   }
  // }

  onPageChange(page: number) {
    this.currentPage = page;
    this.loadingService.show()
    this.schedulerService.GetAll(this.itemsPerPage,(this.currentPage-1)*this.itemsPerPage).subscribe({
      next: (data)=>{this.loadingService.hide();}
    });
  }
}
