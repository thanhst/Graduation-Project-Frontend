import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FlagService } from '../../../core/services/flag/flag.service';
import { ClassPreviewComponent } from '../../../shared/component/class-preview/class-preview.component';
import { PaginationComponent } from '../../../shared/component/pagination/pagination.component';

@Component({
  selector: 'app-all-work',
  imports: [CommonModule,ClassPreviewComponent,PaginationComponent],
  templateUrl: './all-work.component.html',
  styleUrl: './all-work.component.scss'
})
export class AllWorkComponent {
  constructor(private flagService: FlagService) {
    this.flagService.isBack$.subscribe(isBack => {
      if (isBack === true) {
        this.setFlag();
      }
    })
    this.flagService.setBack(false);
    this.setFlag();
  }

  setFlag(){
    this.flagService.setTitle("Work");
    this.flagService.setActiveScheduler(false);
    this.flagService.setActiveSchedulerNotification(false);
    this.flagService.setActiveSidebarRight(false);
    this.flagService.setActiveNotif(true);
  }
  
  classPreviews = Array.from({ length: 20 }, () => {
    return {
      id: "idClass",
      username: "username",
      classname: "hello",
      description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
      src: ["/assets/images/base.png", "path2/to/image.png", "path3/to/image.png", "path4/to/image.png"]
    };
  });
  currentPage=1;
  itemsPerPage = 6;

  get paginatedContents() {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    return this.classPreviews.slice(start, start + this.itemsPerPage);
  }
  onPageChange(page: number) {
    this.currentPage = page;
  }
}
