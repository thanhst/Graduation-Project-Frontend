import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { PaginationComponent } from '../../../shared/component/pagination/pagination.component';

@Component({
  selector: 'app-list-scheduler-user',
  imports: [RouterLink,CommonModule,PaginationComponent],
  templateUrl: './list-scheduler-user.component.html',
  styleUrl: './list-scheduler-user.component.scss'
})
export class ListSchedulerUserComponent {
  mySchedulers: any[] = [];

  currentPage = 1;
  itemsPerPage = 5;

  constructor(private route:Router) {
    this.generateMockData(23); // tạo 23 mục test
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
