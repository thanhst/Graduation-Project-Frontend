import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, Type } from '@angular/core';
import { Router, RouterLink, RouterModule, RouterOutlet } from '@angular/router';
import { User } from '../../core/models/user/user';
import { DialogService } from '../../core/services/dialog/dialog.service';
import { FlagService } from '../../core/services/flag/flag.service';
@Component({
  selector: 'app-base-layout',
  imports: [RouterOutlet, RouterLink, RouterModule, CommonModule],
  templateUrl: './base-layout.component.html',
  styleUrl: './base-layout.component.scss',
})
export class BaseLayoutComponent {
  constructor(private router: Router, public flagService: FlagService,
    private cdRef: ChangeDetectorRef, private dialogService:DialogService ) {
    this.flagService.setActiveScheduler(true);
    this.flagService.setActiveSchedulerNotification(true);
    this.flagService.setActiveSidebarRight(true);
    this.flagService.setActiveNotif(false);
  }

  schedulerComponent: Type<any> | null = null;
  schedulerNotifComponent: Type<any> | null = null;
  notificationComponent: Type<any> | null = null;

  user: User = new User();

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

  onSearch(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    console.log('Enter pressed: ', value);
  }

  async logOut() {
    const result = await this.dialogService.open({
      content:'Confirm logout ?',
      yesText:'Yes',
      noText:'No'
    })
    if(result==1){
      console.log('logout');
    }
    else{
      console.log('Not logout');
    }
  }
  //end
}
