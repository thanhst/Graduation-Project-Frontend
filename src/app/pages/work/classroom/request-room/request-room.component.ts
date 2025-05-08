import { CommonModule, Location } from '@angular/common';
import { Component } from '@angular/core';
import { FlagService } from '../../../../core/services/flag/flag.service';
import { PaginationComponent } from "../../../../shared/component/pagination/pagination.component";
import { UserComponent } from "../../../../shared/object-ui/user/user.component";

@Component({
  selector: 'app-request-room',
  imports: [CommonModule, PaginationComponent, UserComponent],
  templateUrl: './request-room.component.html',
  styleUrl: './request-room.component.scss'
})
export class RequestRoomComponent {
  itemsPerPage: number = 5;
  currentPage: number = 1;

  constructor(private flagService: FlagService, private location:Location) {
    this.flagService.setTitle('workname')
  }

  studentPreviews = () => {
    return Array.from({ length: 11 }, (_, i) => ({
      name: 'username' + i,
      src: 'url' + i,
    }))
  };

  get paginatedContents() {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    return this.studentPreviews().slice(start, start + this.itemsPerPage);
  }

  onPageChange(page: number) {
    this.currentPage = page;
  }
  
  goBack(){
    this.location.back();
  }
}
