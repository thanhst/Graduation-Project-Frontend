import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FlagService } from '../../../../core/services/flag/flag.service';
import { PaginationComponent } from "../../../../shared/component/pagination/pagination.component";
import { UserComponent } from "../../../../shared/object-ui/user/user.component";

@Component({
  selector: 'app-all-member',
  imports: [CommonModule, RouterLink, PaginationComponent, UserComponent],
  templateUrl: './all-member.component.html',
  styleUrl: './all-member.component.scss'
})
export class AllMemberComponent {
  itemsPerPage: number = 5;
  currentPage: number = 1;

  constructor(private flagService: FlagService) {
    this.flagService.setTitle('workname')
  }

  studentPreviews = () => {
    return Array.from({ length: 11 }, (_, i) => ({
      name: 'username'+i,
      src: 'url'+i,
    }))
  };

  get paginatedContents() {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    return this.studentPreviews().slice(start, start + this.itemsPerPage);
  }

  onPageChange(page: number) {
    this.currentPage = page;
  }
}
