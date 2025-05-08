import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FlagService } from '../../../../core/services/flag/flag.service';
import { PaginationComponent } from "../../../../shared/component/pagination/pagination.component";
import { RoomComponent } from "../../../../shared/object-ui/room/room.component";

@Component({
  selector: 'app-home-class',
  imports: [RoomComponent, CommonModule, PaginationComponent, RouterLink],
  templateUrl: './home-class.component.html',
  styleUrl: './home-class.component.scss'
})
export class HomeClassComponent {

  itemsPerPage: number = 2;
  currentPage: number = 1;

  constructor(private flagService: FlagService) {
    this.flagService.setTitle('workname')
  }
  roomPreviews = () => {
    return Array.from({ length: 11 }, (_, i) => ({
      id: String(i + 1),
      date: new Date(),
      title: String(i)
    }))
  };

  get paginatedContents() {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    return this.roomPreviews().slice(start, start + this.itemsPerPage);
  }

  onPageChange(page: number) {
    this.currentPage = page;
  }
}
