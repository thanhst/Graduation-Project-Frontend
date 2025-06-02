import { ChangeDetectorRef, Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { ClassService } from '../../../../core/services/class/class.service';
import { FlagService } from '../../../../core/services/flag/flag.service';

@Component({
  selector: 'app-layout',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss'
})
export class LayoutComponent {
  constructor(private flagService: FlagService, private cdr: ChangeDetectorRef, private classService: ClassService) {

  }
  ngOnInit(): void {
    this.flagService.setActiveScheduler(false);
    this.flagService.setActiveSchedulerNotification(false);
    this.flagService.setActiveSidebarRight(false);
    this.flagService.setActiveNotif(false);
    this.classService.classroom$.subscribe(
      classroom => {
        this.flagService.setTitle(classroom.className);
        this.cdr.detectChanges();
      }
    )
  }
}
