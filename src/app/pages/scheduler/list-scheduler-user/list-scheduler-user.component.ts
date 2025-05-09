import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FlagService } from '../../../core/services/flag/flag.service';
import { PaginationComponent } from '../../../shared/component/pagination/pagination.component';

@Component({
  selector: 'app-list-scheduler-user',
  imports: [RouterLink, CommonModule, PaginationComponent],
  templateUrl: './list-scheduler-user.component.html',
  styleUrl: './list-scheduler-user.component.scss',
})
export class ListSchedulerUserComponent {

  mySchedulers: any[] = [];

  currentPage = 1;
  itemsPerPage = 5;

  constructor(private route: Router, private flagService: FlagService) {
    this.flagService.isBack$.subscribe(isBack => {
      if (isBack === true) {
        this.setFlag();
      }
    })
    this.flagService.setBack(false);
    this.setFlag();

    this.generateMockData(23); // tạo 23 mục test
  }
  
  setFlag(){
    this.flagService.setActiveScheduler(true);
    this.flagService.setActiveSchedulerNotification(true);
    this.flagService.setActiveSidebarRight(true);
    this.flagService.setTitle("Scheduler");
    this.flagService.setActiveNotif(false);
  }

  generateMockData(count: number) {
    for (let i = 1; i <= count; i++) {
      this.mySchedulers.push({
        getId: () => i,
        getTitle: () => `Schedule Title ${i}`,
        getClassname: () => `Class ${i}`
      });
    }
  }

  get paginatedSchedulers() {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    return this.mySchedulers.slice(start, start + this.itemsPerPage);
  }

  onPageChange(page: number) {
    this.currentPage = page;
  }
}
