import { ChangeDetectorRef, Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { FlagService } from '../../../../core/services/flag/flag.service';

@Component({
  selector: 'app-layout',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss'
})
export class LayoutComponent {
  constructor(private flagService: FlagService, private cdr:ChangeDetectorRef) {
    this.flagService.setTitle("Work");
    this.flagService.setActiveScheduler(false);
    this.flagService.setActiveSchedulerNotification(false);
    this.flagService.setActiveSidebarRight(false);
    this.flagService.setActiveNotif(false);
  }
  ngOnInit(): void {
    this.flagService.title$.subscribe(title => {
      this.cdr.detectChanges();
    });
  }
}
