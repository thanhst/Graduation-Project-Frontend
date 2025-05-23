import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import { Account } from '../../../core/models/account/account';
import { User } from '../../../core/models/user/user';
import { AuthService } from '../../../core/services/auth/auth.service';
import { DialogService } from '../../../core/services/dialog/dialog.service';
import { LoadingService } from '../../../core/services/loading/loading.service';
import { BaseComponent } from '../../../shared/component/base/base.component';

declare const google: any;
@Component({
  selector: 'app-user-register',
  imports: [BaseComponent, CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './user-register.component.html',
  styleUrl: './user-register.component.scss'
})
export class UserRegisterComponent {
  form: FormGroup;
  @ViewChild('hiddenGoogleBtn') hiddenGoogleBtn!: ElementRef;

  constructor(private router: Router, private fb: FormBuilder, private auth: AuthService,
    private loading: LoadingService, private dialogService: DialogService
  ) {
    this.form = this.fb.group({
      fullname: ['', [Validators.required, Validators.maxLength(50)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      rePassword: ['', [Validators.required, Validators.minLength(8)]],
    }, { validators: this.checkPassword() });
  }

  checkPassword(): ValidatorFn {
    return (group: AbstractControl): ValidationErrors | null => {
      const password = group.get('password')?.value;
      const rePassword = group.get('rePassword')?.value;
      return password === rePassword ? null : { checkPassword: true }
    }
  }
  ngAfterViewInit(): void {
    //Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
    //Add 'implements AfterViewInit' to the class.
    google.accounts.id.initialize({
      client_id: '1080112318843-g94n44vjk20ukgiq33agepmqllept54c.apps.googleusercontent.com',
      callback: this.handleCredentialResponse.bind(this),
      itp_support: true
    });
    google.accounts.id.renderButton(this.hiddenGoogleBtn.nativeElement, {
      theme: 'outline',
      size: 'large'
    });
  }

  onGoogleLogin() {
    if (!this.hiddenGoogleBtn) {
      console.error('hiddenGoogleBtn chưa được khởi tạo');
      return;
    }
    const realButton = this.hiddenGoogleBtn.nativeElement.querySelector('div[role=button]');
    if (realButton) {
      realButton.click();
    } else {
      console.error('Không tìm thấy nút Google để click');
    }
  }

  handleCredentialResponse(response: any) {
    this.loading.show()
    setTimeout(() => {
      const idToken = response.credential;
      this.auth.loginWithGoogle(idToken).subscribe({
        next: (res) => {
          setTimeout(() => {
            this.loading.hide()
            this.router.navigate(['/dashboard']);
          }, 2000)
        },
        error: (err) => {
          this.dialogService.setIsQuestion(false)
          this.dialogService.open({
            content: "Error for login by google!"
          })
          setTimeout(() => {
            this.loading.hide()
            this.dialogService.cancel()
            this.dialogService.setIsQuestion(true)
          }, 5000)
        }
      });
    }, 100)
  }

  onSubmit() {
    this.form.markAllAsTouched();
    if (this.form.invalid) {
      return;
    }
    else {
      this.loading.show();
      const account = new Account(
        '',
        '',
        this.form.get('email')?.value,
        this.form.get('password')?.value,
        'email',
        new Date(),
        new Date()
      )
      const user = new User(
        '',
        this.form.get('fullname')?.value,
        '',
        new Date(),
        new Date()
      )
      setTimeout(() => {
        this.auth.register(account, user)
          .pipe(finalize(() => this.loading.hide()))
          .subscribe({
            next: (res) => {
              this.dialogService.setIsQuestion(false);
              this.dialogService.open({
                content: "Register your account successfully!"
              })
              setTimeout(() => {
                this.dialogService.cancel();
                setTimeout(() => {
                  this.router.navigate(['/login']);
                }, 1000)
              }, 2000)
            },
            error: (err) => {
              const errorMessage = err.error?.message || err.error?.error || 'Error!';
              this.dialogService.setIsQuestion(false);
              this.dialogService.open({
                content: errorMessage
              })
              setTimeout(() => {
                this.dialogService.cancel();
              }, 10000)
            }
          });
      }, 1000)
    }
  }
}
