import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ClassroomWithSrc } from '../../../core/interface/class.interface';
import { ClassService } from '../../../core/services/class/class.service';
import { FlagService } from '../../../core/services/flag/flag.service';
import { LoadingService } from '../../../core/services/loading/loading.service';
import { ClassPreviewComponent } from '../../../shared/component/class-preview/class-preview.component';
import { PaginationComponent } from '../../../shared/component/pagination/pagination.component';

@Component({
  selector: 'app-all-work',
  imports: [CommonModule, ClassPreviewComponent, PaginationComponent],
  templateUrl: './all-work.component.html',
  styleUrl: './all-work.component.scss'
})
export class AllWorkComponent {
  classPreviews: ClassroomWithSrc[] = [];
  count:number = 0;
  constructor(private flagService: FlagService, private classService: ClassService,
    private loadingService: LoadingService
  ) {
    this.flagService.isBack$.subscribe(isBack => {
      if (isBack === true) {
        this.setFlag();
      }
    })
    this.flagService.setBack(false);
    this.setFlag();
  }
  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.classService.classrooms$.pipe(
    ).subscribe(previews => {
      this.classPreviews = previews.map(c => {
        const first4StudentClasses = c.StudentClasses ? c.StudentClasses.slice(0, 4) : [];
        const srcUrls = first4StudentClasses.map(sc => sc.User?.profilePicture || '');
        return {
          classroom: {
            ...c,
            StudentClasses: first4StudentClasses,
          },
          src: srcUrls,
        };
      });
    });
    this.classService.count$.pipe(
    ).subscribe((count)=>{
      this.count = count
    });
  }

  setFlag() {
    this.flagService.setTitle("Work");
    this.flagService.setActiveScheduler(false);
    this.flagService.setActiveSchedulerNotification(false);
    this.flagService.setActiveSidebarRight(false);
    this.flagService.setActiveNotif(true);
  }


  currentPage = 1;
  itemsPerPage = 6;

  // get paginatedContents() {
  //   const start = (this.currentPage - 1) * this.itemsPerPage;
  //   return this.classPreviews.slice(start, start + this.itemsPerPage);
  // }

  onPageChange(page: number) {
    this.currentPage = page;
    this.loadingService.show()
    this.classService.getClassPreviews(this.itemsPerPage,(this.currentPage-1)*this.itemsPerPage).subscribe({
      next: (data)=>{this.loadingService.hide();}
    });
  }
}
