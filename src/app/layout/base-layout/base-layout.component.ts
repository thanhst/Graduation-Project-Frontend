import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, Type } from '@angular/core';
import { Router, RouterLink, RouterModule, RouterOutlet } from '@angular/router';
import { AuthService } from '../../core/services/auth/auth.service';
import { DialogService } from '../../core/services/dialog/dialog.service';
import { FlagService } from '../../core/services/flag/flag.service';
import { LoadingService } from '../../core/services/loading/loading.service';
import { UserService } from '../../core/services/user/user.service';
@Component({
  selector: 'app-base-layout',
  imports: [RouterOutlet, RouterLink, RouterModule, CommonModule,],
  templateUrl: './base-layout.component.html',
  styleUrl: './base-layout.component.scss',
})
export class BaseLayoutComponent {
  constructor(private router: Router, public flagService: FlagService,
    private cdRef: ChangeDetectorRef, private dialogService: DialogService,
    private loading: LoadingService,
    public userService: UserService,
    private authService: AuthService) {
    this.flagService.setActiveScheduler(true);
    this.flagService.setActiveSchedulerNotification(true);
    this.flagService.setActiveSidebarRight(true);
    this.flagService.setActiveNotif(false);
  }

  schedulerComponent: Type<any> | null = null;
  schedulerNotifComponent: Type<any> | null = null;
  notificationComponent: Type<any> | null = null;
  loadDateTimeJs:boolean = false;

  //init
  ngOnInit(): void {
    this.flagService.isActiveScheduler$.subscribe((isActive) => {
      if (isActive) {
        this.loadScheduler();
      } else {
        this.unloadScheduler();
      }
    });
    this.flagService.isActiveNotification$.subscribe((isActive) => {
      if (isActive) {
        this.loadNotif();
      } else {
        this.unloadNotif();
      }
    })

    this.flagService.isActiveSchedulerNotification$.subscribe((isActive) => {
      if (isActive) {
        this.loadSchedulerNotif();
      }
      else {
        this.unloadNotif();
      }
    })

    this.flagService.title$.subscribe(title => {
      this.cdRef.detectChanges();
    });
  }
  //destroy
  ngOnDestroy(): void {

  }

  //setter

  //end-setter

  //function
  async loadScheduler() {
    this.loadDateTimeJs = true;
    if (!this.schedulerComponent) {
      const { SchedulerComponent } = await import('../../shared/component/scheduler/scheduler.component');
      this.schedulerComponent = SchedulerComponent;
    }
  }

  unloadScheduler() {
    this.schedulerComponent = null;
  }

  async loadNotif() {
    if (!this.notificationComponent) {
      const { NotificationComponent } = await import('../../shared/component/notification/notification.component');
      this.notificationComponent = NotificationComponent;
    }
  }
  unloadNotif() {
    this.notificationComponent = null;
  }

  async loadSchedulerNotif() {
    if (!this.schedulerNotifComponent) {
      const { SchedulerNotifComponent } = await import('../../shared/component/scheduler-notif/scheduler-notif.component');
      this.schedulerNotifComponent = SchedulerNotifComponent;
    }
  }
  unloadSchedulerNotif() {
    this.schedulerNotifComponent = null;
  }

  async logOut() {
    this.dialogService.setIsQuestion(true);
    const result = await this.dialogService.open({
      content: 'Confirm logout ?',
      yesText: 'Yes',
      noText: 'No'
    })
    if (result == 1) {
      this.loading.show()
      setTimeout(() => {
        this.loading.hide()
        this.authService.logout().subscribe({
          next: () => {
          },
          error: (err) => {
            this.dialogService.setIsQuestion(false);
            this.dialogService.open({
              content: 'Error to logout!',
            });
            setTimeout(() => {
              this.dialogService.cancel();
            }, 5000);
          }
        });
      }, 1000)
    }
    else {
    }
  }
}
