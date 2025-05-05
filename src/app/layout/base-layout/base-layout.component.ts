import { CommonModule } from '@angular/common';
import { Component, Type } from '@angular/core';
import { NavigationEnd, Router, RouterLink, RouterModule, RouterOutlet } from '@angular/router';
import { filter, Subscription } from 'rxjs';
import { Scheduler } from '../../core/models/scheduler/scheduler';
import { User } from '../../core/models/user/user';
@Component({
  selector: 'app-base-layout',
  imports: [RouterOutlet, RouterLink, RouterModule, CommonModule],
  templateUrl: './base-layout.component.html',
  styleUrl: './base-layout.component.scss'
})
export class BaseLayoutComponent {
  constructor(private router: Router) { }

  private routerSubscription!: Subscription;

  isActiveScheduler: boolean = true;
  isActiveSearch: boolean = true;
  isActiveSidebarRight: boolean = true;

  schedulerComponent: Type<any> | null = null;

  user: User = new User();
  title: string = "";
  selectedDate:Date= new Date();

  notifClass = Array.from({ length: 20 }, () => new Scheduler());



  //init
  ngOnInit(): void {
    this.listenRouteChanges();
    const initialUrl = this.router.url;
    this.handleRouteChange(initialUrl);

    // Optionally auto-load scheduler initially
    if (this.isActiveScheduler) {
      this.loadScheduler();
    }
  }
  //destroy
  ngOnDestroy(): void {
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }

  //setter
  setActiveScheduler(value: boolean) {
    this.isActiveScheduler = value;
  }
  //end-setter

  //function
  async loadScheduler() {
    if (!this.schedulerComponent) {
      const { SchedulerComponent } = await import('../../shared/component/scheduler/scheduler.component');
      this.schedulerComponent = SchedulerComponent;
      this.isActiveScheduler = true;
    }
  }

  unloadScheduler() {
    this.schedulerComponent = null;
    this.isActiveScheduler = false;
  }

  private listenRouteChanges() {
    this.routerSubscription = this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event) => {
        const currentUrl = (event as NavigationEnd).urlAfterRedirects;
        this.handleRouteChange(currentUrl);
      });
  }

  private handleRouteChange(currentUrl: string) {
    const routeConfig = [
      { path: '/scheduler/create', title: 'Scheduler', isSearch: false, isActiveScheduler: true, isActiveSidebarRight:true },
      { path: '/scheduler/update', title: 'Scheduler', isSearch: false, isActiveScheduler: true, isActiveSidebarRight:true },
      { path: '/scheduler/list-your', title: 'Scheduler', isSearch: true, isActiveScheduler: true, isActiveSidebarRight:true },
      { path: '/scheduler', title: 'Scheduler', isSearch: true, isActiveScheduler: true,isActiveSidebarRight:true },
      { path: '/dashboard', title: () => `Welcome, ${this.user.getUsername()}`, isSearch: false, isActiveScheduler: false },
      { path: '/work', title: 'Work', isSearch: true },
      { path: '/statisfical', title: 'Statisfical', isSearch: true },
      { path: '/settings', title: 'Settings', isSearch: false }
    ];

    for (const config of routeConfig) {
      if (currentUrl.includes(config.path)) {
        this.title = typeof config.title === 'function' ? config.title() : config.title;
        this.isActiveSearch = config.isSearch;
        this.isActiveSidebarRight = config.isActiveSidebarRight?? true;

        if (config.isActiveScheduler) this.loadScheduler();
        if (!config.isActiveScheduler) this.unloadScheduler();

        break;
      }
    }
  }

  onSearch(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    console.log('Enter pressed: ', value);
  }

  logOut() {
    console.log("Logout")
    return;
  }
  //end
}
