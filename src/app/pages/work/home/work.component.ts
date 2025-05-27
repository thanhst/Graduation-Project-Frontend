import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ClassroomWithSrc } from '../../../core/interface/class.interface';
import { ClassService } from '../../../core/services/class/class.service';
import { FlagService } from '../../../core/services/flag/flag.service';
import { LoadingService } from '../../../core/services/loading/loading.service';
import { ClassPreviewComponent } from "../../../shared/component/class-preview/class-preview.component";

@Component({
  selector: 'app-work',
  imports: [ClassPreviewComponent, CommonModule, RouterLink],
  templateUrl: './work.component.html',
  styleUrl: './work.component.scss',
})
export class WorkComponent {
  role: string | null = localStorage.getItem("role")
  classPreviews: ClassroomWithSrc[] = [];

  constructor(private flagService: FlagService, private loadingService: LoadingService, private classService: ClassService) {
    this.flagService.isBack$.subscribe(isBack => {
      if (isBack === true) {
        this.setFlag();
      }
    })
    this.flagService.setBack(false);
    this.setFlag();
    this.classService.getClassToday().subscribe(previews => {
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
    })
  }
  setFlag() {
    this.flagService.setTitle("Work");
    this.flagService.setActiveScheduler(false);
    this.flagService.setActiveSchedulerNotification(false);
    this.flagService.setActiveSidebarRight(true);
    this.flagService.setActiveNotif(true);
  }
}
