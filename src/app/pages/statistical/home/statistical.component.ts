import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { FlagService } from '../../../core/services/flag/flag.service';
import { PaginationComponent } from "../../../shared/component/pagination/pagination.component";

@Component({
  selector: 'app-home',
  imports: [ReactiveFormsModule, CommonModule, PaginationComponent, RouterModule],
  templateUrl: './statistical.component.html',
  styleUrl: './statistical.component.scss'
})
export class StatisticalComponent {
  myRooms: any[] = [];

  currentPage = 1;
  itemsPerPage = 5;

  constructor(private route: Router, private flagService: FlagService) {
    this.flagService.setActiveScheduler(true);
    this.flagService.setActiveSchedulerNotification(true);
    this.flagService.setActiveSearch(true);
    this.flagService.setActiveSidebarRight(false);
    this.flagService.setTitle("Statistical");

    this.generateMockData(50); // tạo 23 mục test
  }

  generateMockData(count: number) {
    for (let i = 1; i <= count; i++) {
      this.myRooms.push({
        getId: () => i,
        getTitle: () => `Class Title ${i}`,
        getClassname: () => `Class ${i}`
      });
    }
  }

  get paginatedContents() {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    return this.myRooms.slice(start, start + this.itemsPerPage);
  }

  onPageChange(page: number) {
    this.currentPage = page;
  }
}
