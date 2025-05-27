import { CommonModule } from '@angular/common';
import { Component, ElementRef, Input, NgZone, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { finalize } from 'rxjs';
import { Account } from '../../core/models/account/account';
import { AuthService } from '../../core/services/auth/auth.service';
import { DialogService } from '../../core/services/dialog/dialog.service';
import { LoadingService } from '../../core/services/loading/loading.service';
import { UserService } from '../../core/services/user/user.service';
import { BaseComponent } from '../../shared/component/base/base.component';

declare const google: any;

@Component({
  selector: 'app-base-login',
  standalone: true,
  styleUrls: ['./base-login.component.scss'],
  imports: [CommonModule, ReactiveFormsModule, FormsModule, BaseComponent, RouterModule],
  templateUrl: './base-login.component.html',
})
export class BaseLoginComponent {
  @ViewChild('hiddenGoogleBtn') hiddenGoogleBtn!: ElementRef;

  form: FormGroup;

  constructor(private router: Router, private fb: FormBuilder
    , private loading: LoadingService, private dialogService: DialogService
    , private auth: AuthService, private userService: UserService,
    private ngZone: NgZone,
  ) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      rememberMe: [false],
    });
  }

  @Input() role: 'user' | 'admin' = 'user';

  ngOnInit(): void {
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

  get userRole(): boolean {
    return this.role === 'user';
  }

  get title(): string {
    return this.role === 'admin' ? 'Admin Login' : 'Login with your account';
  }
  get warning(): Array<string> {
    return ["Email is required", "Password is required"]
  }

  handleCredentialResponse(response: any) {
    this.loading.show()
    this.ngZone.run(() => {
      setTimeout(() => {
        const idToken = response.credential;
        this.auth.loginWithGoogle(idToken).subscribe({
          next: (res) => {
            this.loading.hide()
            this.router.navigate(['/dashboard']);
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
    })
  }
  loginWithGithub() {
    this.auth.loginWithGithub();
  }

  onSubmit() {
    this.form.markAllAsTouched();
    if (this.form.invalid) {
      return;
    } else {
      this.loading.show();
      setTimeout(() => {
        const account = new Account(
          '',
          '',
          this.form.get('email')?.value,
          this.form.get('password')?.value,
          "email",
          new Date(),
          new Date()
        )
        this.auth.login(account)
          .pipe(finalize(() => {
            this.loading.hide();
          }))
          .subscribe({
            next: (res) => {
              // setTimeout(()=>{
              this.router.navigate(['/dashboard']);
              // },10000)
            },
            error: (err) => {
              let errorMessage;
              if (err.status == 0) {
                errorMessage = 'Error! The server have fixed!'
              } else {
                errorMessage = err.error?.message || err.error?.error || err.error || 'Error! The server have fixed!';
              }
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
