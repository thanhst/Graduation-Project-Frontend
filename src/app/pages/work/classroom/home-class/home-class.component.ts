import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Scheduler } from '../../../../core/models/scheduler/scheduler';
import { ClassService } from '../../../../core/services/class/class.service';
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
  role: string = localStorage.getItem("role") || "student"
  roomPreviews: Scheduler[] = [];
  constructor(private flagService: FlagService, private cdr: ChangeDetectorRef, public classService: ClassService) {

  }
  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.flagService.title$.subscribe(title => {
      this.cdr.detectChanges();
    });
    this.classService.classroom$.subscribe(room => {
      this.roomPreviews = room.Schedulers?.filter(scheduler => {
        const today = new Date();
        const schedulerDate = new Date(scheduler.startTime);
      
        return (
          today.getFullYear() === schedulerDate.getFullYear() &&
          today.getMonth() === schedulerDate.getMonth() &&
          today.getDate() === schedulerDate.getDate()
        );
      })||[];
    })
  }
  toDate(dateStr: string): Date {
    return new Date(dateStr);
  }

  get paginatedContents() {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    return this.roomPreviews.slice(start, start + this.itemsPerPage);
  }

  onPageChange(page: number) {
    this.currentPage = page;
  }
}
