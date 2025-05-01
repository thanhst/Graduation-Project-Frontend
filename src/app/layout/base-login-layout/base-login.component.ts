import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { BaseComponent } from '../../shared/component/base/base.component';

@Component({
  selector: 'app-base-login',
  standalone: true,
  styleUrls:['./base-login.component.scss'],
  imports: [CommonModule, ReactiveFormsModule,FormsModule,BaseComponent,RouterModule],
  templateUrl: './base-login.component.html',
})
export class BaseLoginComponent {
  constructor(private router: Router) {}


  @Input() role: 'user' | 'admin' = 'user';
  isErrorWarning : boolean = false;

  get userRole(): boolean {
    return this.role === 'user';
  }
  
  get title(): string {
    return this.role === 'admin' ? 'Admin Login' : 'Login with your account';
  }
  get warning(): Array<string>{
    return ["Email is required","Password is required"]
  }
  email: string = '';
  password: string = '';
  rememberMe: boolean = false;
  onSubmit() {
    if (this.role === 'admin') {
      this.router.navigate(['/admin-dashboard']);
    } else {
      this.router.navigate(['/user-dashboard']);
    }
  }
}
