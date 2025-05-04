import { CommonModule } from '@angular/common';
import { Component, Type } from '@angular/core';
import { NavigationEnd, Router, RouterLink, RouterModule, RouterOutlet } from '@angular/router';
import { filter, Subscription } from 'rxjs';
import { Schedular } from '../../core/models/schedular/schedular';
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

  isActiveSchedular: boolean = true;
  schedularComponent: Type<any> | null = null;
  user: User = new User();

  notifClass = Array.from({ length: 20 }, () => new Schedular());
  activeMenu: string = 'dashboard';
  title: string = "";


  //init
  ngOnInit(): void {
    this.listenRouteChanges();
    const initialUrl = this.router.url;
    this.handleRouteChange(initialUrl);

    // Optionally auto-load schedular initially
    if (this.isActiveSchedular) {
      this.loadSchedular();
    }
  }
  //destroy
  ngOnDestroy(): void {
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }

  //setter
  setActiveSchedular(value: boolean) {
    this.isActiveSchedular = value;
  }
  setActive(menu: string) {
    this.activeMenu = menu;
  }
  //end-setter

  //function
  async loadSchedular() {
    if (!this.schedularComponent) {
      const { SchedularComponent } = await import('../../shared/component/schedular/schedular.component');
      this.schedularComponent = SchedularComponent;
      this.isActiveSchedular = true;
    }
  }

  unloadSchedular() {
    this.schedularComponent = null;
    this.isActiveSchedular = false;
  }

  private listenRouteChanges() {
    this.routerSubscription = this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event) => {
        const currentUrl = (event as NavigationEnd).urlAfterRedirects;
        if (currentUrl.includes('/schedular')) {
          this.unloadSchedular();
          this.title = "Schedular"!
        }
        else if (currentUrl.includes('/dashboard')) {
          this.title = `Welcome, ${this.user.getUsername()}`
          this.loadSchedular();
        }
        else if (currentUrl.includes('/work')) {
          this.title = "Work"
        }
        else if (currentUrl.includes('/statisfical')) {
          this.title = "Statisfical"
        }
        else if (currentUrl.includes('/settings')) {
          this.title = "Settings"
        }
      });
  }

  private handleRouteChange(currentUrl: string) {
    if (currentUrl.includes('/schedular')) {
      this.unloadSchedular();
      this.title = 'Schedular';
    } else if (currentUrl.includes('/dashboard')) {
      this.title = `Welcome, ${this.user.getUsername()}`;
    } else if (currentUrl.includes('/work')) {
      this.title = 'Work';
    } else if (currentUrl.includes('/statisfical')) {
      this.title = 'Statisfical';
    } else if (currentUrl.includes('/settings')) {
      this.title = 'Settings';
    }
  }

  logOut() {
    console.log("Logout")
    return;
  }
  //end
}
