import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
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
  form: FormGroup;
  
  constructor(private router: Router,private fb: FormBuilder) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      rememberMe: [false],
    });
  }

  @Input() role: 'user' | 'admin' = 'user';


  ngOnInit(): void {

  }

  get userRole(): boolean {
    return this.role === 'user';
  }
  
  get title(): string {
    return this.role === 'admin' ? 'Admin Login' : 'Login with your account';
  }
  get warning(): Array<string>{
    return ["Email is required","Password is required"]
  }

  onSubmit() {
    this.form.markAllAsTouched();
    if (this.form.invalid) {
      return;
    }
  
    if (this.role === 'admin') {
      this.router.navigate(['/admin-dashboard']);
    } else {
      this.router.navigate(['/user-dashboard']);
    }
  }
}
