import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { User } from '../../../../core/models/user/user';
import { ClassService } from '../../../../core/services/class/class.service';
import { FlagService } from '../../../../core/services/flag/flag.service';
import { LoadingService } from '../../../../core/services/loading/loading.service';
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
  classId: string = "";
  studentJoined: User[] = [];
  role: string = localStorage.getItem("role") || "student"
  typeStd: string = "view"
  constructor(private flagService: FlagService, public classService: ClassService,
    private loadingService: LoadingService,private cdr:ChangeDetectorRef, private activeRoute: ActivatedRoute) {
    this.activeRoute.parent?.paramMap.subscribe(params => {
      this.classId = params.get('id') || '';
    });
    this.classService.getUserJoinedWithClassrooms(this.classId, this.itemsPerPage, (this.currentPage - 1) * this.itemsPerPage).subscribe({
      next: (data) => { }
    });
    this.classService.userJoined$.pipe(
    ).subscribe(previews => {
      this.studentJoined = previews
    });
  }
  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.flagService.title$.subscribe(title => {
      this.cdr.detectChanges();
    });
  }
  removeUser(userId: string) {
    this.studentJoined = this.studentJoined.filter(user => user.userId !== userId);
    this.classService.getUserJoinedWithClassrooms(this.classId, this.itemsPerPage, (this.currentPage - 1) * this.itemsPerPage).subscribe({
      next: (data) => { }
    })
    this.classService.getCountClassroom(this.classId);
  }

  onPageChange(page: number) {
    this.currentPage = page;
    this.loadingService.show()
    this.classService.getUserJoinedWithClassrooms(this.classId, this.itemsPerPage, (this.currentPage - 1) * this.itemsPerPage).subscribe({
      next: (data) => { this.loadingService.hide(); }
    });
  }
}
