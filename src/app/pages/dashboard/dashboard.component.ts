import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { map } from 'rxjs';
import { ClassroomWithSrc } from '../../core/interface/class.interface';
import { AuthService } from '../../core/services/auth/auth.service';
import { ClassService } from '../../core/services/class/class.service';
import { FlagService } from '../../core/services/flag/flag.service';
import { UserService } from '../../core/services/user/user.service';
import { ClassPreviewComponent } from "../../shared/component/class-preview/class-preview.component";

@Component({
  selector: 'app-dashboard',
  imports: [RouterLink, CommonModule, ClassPreviewComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})

export class DashboardComponent {
  classPreviews: ClassroomWithSrc[] = [];
  constructor(private route: Router, private flagService: FlagService, private cdRef: ChangeDetectorRef
    , private auth: AuthService, private userService: UserService, private classService: ClassService
  ) {
    this.flagService.isBack$.subscribe(isBack => {
      if (isBack == true) {
        this.setFlag();
      }
    })
    this.flagService.setBack(false);
    this.setFlag();
  }
  ngOnInit(): void {
    this.classService.classrooms$.pipe(
      map(classes => classes.slice(0, 4))
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
  }

  setFlag() {
    const username = this.userService.getCurrentUser()?.fullName;
    const title = `Welcome ${username}!`;
    this.flagService.setTitle(title);
    this.flagService.setActiveScheduler(true);
    this.flagService.setActiveSchedulerNotification(true);
    this.flagService.setActiveSidebarRight(true);
    this.flagService.setActiveNotif(false);
  }
}
