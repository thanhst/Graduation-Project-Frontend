import { CommonModule, Location } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { User } from '../../../../core/models/user/user';
import { ClassService } from '../../../../core/services/class/class.service';
import { FlagService } from '../../../../core/services/flag/flag.service';
import { LoadingService } from '../../../../core/services/loading/loading.service';
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
  classId:string = "";
  studentWaiting:User[] = [];

  constructor(private flagService: FlagService, private location:Location,
    public classService:ClassService,private loadingService:LoadingService,
    private activeRoute:ActivatedRoute,private cdr:ChangeDetectorRef
  ) {
    this.activeRoute.parent?.paramMap.subscribe(params => {
      this.classId = params.get('id') || '';
    });
    this.classService.getUserWaitingWithClassrooms(this.classId, this.itemsPerPage, (this.currentPage - 1) * this.itemsPerPage).subscribe({
      next: (data) => { this.loadingService.hide(); }
    });
    this.classService.userWaiting$.pipe(
    ).subscribe(previews => {
      this.studentWaiting = previews
    });
  }

  onPageChange(page: number) {
    this.currentPage = page;
    this.loadingService.show()
    this.classService.getUserWaitingWithClassrooms(this.classId, this.itemsPerPage, (this.currentPage - 1) * this.itemsPerPage).subscribe({
      next: (data) => { this.loadingService.hide(); }
    });
  }
  
  goBack(){
    this.location.back();
  }
  removeUser(userId: string){
    this.studentWaiting = this.studentWaiting.filter(user => user.userId !== userId);
    this.classService.getUserWaitingWithClassrooms(this.classId, this.itemsPerPage, (this.currentPage - 1) * this.itemsPerPage).subscribe({
      next: (data) => { }
    })
    this.classService.getCountClassroom(this.classId);
  }
}
