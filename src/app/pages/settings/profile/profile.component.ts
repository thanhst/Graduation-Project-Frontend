import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DialogService } from '../../../core/services/dialog/dialog.service';
import { FlagService } from '../../../core/services/flag/flag.service';
import { LoadingService } from '../../../core/services/loading/loading.service';
import { UserService } from '../../../core/services/user/user.service';

@Component({
  selector: 'app-profile',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
})
export class ProfileComponent {
  form: FormGroup;
  isEditForm: boolean = false;
  isChangePassword: boolean = false;
  imagePreview: string = "";
  private fileUpload!: File;
  loginMethod: string | null = "";
  constructor(private fb: FormBuilder, private flagService: FlagService,
    private dialogService: DialogService,
    private loadingService: LoadingService,
    private userService: UserService,
    private router: Router
  ) {
    this.loginMethod = localStorage.getItem("login_method")
    this.flagService.isBack$.subscribe(isBack => {
      if (isBack === true) {
        this.setFlag();
      }
    })
    this.flagService.setBack(false);
    this.setFlag();

    this.form = this.fb.group({
      fullname: [this.userService.getCurrentUser()?.fullName, [Validators.required]],
      imageUser: [this.userService.getCurrentUser()?.profilePicture + "?t=" + this.userService.timestamp],
      currentPassword: ['', [Validators.required, Validators.minLength(8)]],
      newPassword: ['', [Validators.required, Validators.minLength(8)]],
      rePassword: ['', [Validators.required, Validators.minLength(8)]],
    }, {
      validators: Validators.compose([
        this.checkPassword(),
        this.checkNewPassword()
      ])
    })
  }

  setFlag() {
    this.flagService.setActiveScheduler(true);
    this.flagService.setActiveSchedulerNotification(true);
    this.flagService.setActiveSidebarRight(false);
    this.flagService.setTitle("Settings");
  }

  checkPassword(): ValidatorFn {
    return (group: AbstractControl): ValidationErrors | null => {
      const password = group.get('newPassword')?.value;
      const rePassword = group.get('rePassword')?.value;
      return password === rePassword ? null : { checkPassword: true }
    }
  }
  checkNewPassword(): ValidatorFn {
    return (group: AbstractControl): ValidationErrors | null => {
      const password = group.get('currentPassword')?.value;
      const rePassword = group.get('newPassword')?.value;
      if (group.get('newPassword')?.disabled) {
        return null;
      }
      return password === rePassword ? { checkNewPassword: true } : null;
    }
  }

  ngOnInit(): void {
    this.form.get('fullname')?.disable();
    this.form.get('currentPassword')?.disable();
    this.form.get('newPassword')?.disable();
    this.form.get('rePassword')?.disable();
    this.imagePreview = this.form.get('imageUser')?.value;
  }

  onChangeEdit() {
    if (!this.isEditForm) {
      this.isEditForm = true;
      this.form.get('fullname')?.enable();

    }
    else {
      this.isEditForm = false;
      this.form.get('fullname')?.disable();

    }
  }
  onChangePassword() {
    if (!this.isChangePassword) {
      this.isChangePassword = true;
      this.form.get('currentPassword')?.enable();
      this.form.get('newPassword')?.enable();
      this.form.get('rePassword')?.enable();
    } else {
      this.isChangePassword = false;
      this.form.get('currentPassword')?.disable();
      this.form.get('newPassword')?.disable();
      this.form.get('rePassword')?.disable();
    }
  }
  clearForm() {
    this.form.patchValue({
      currentPassword: '',
      newPassword: '',
      rePassword: ''
    });
  
    this.form.markAsPristine();
    this.form.markAsUntouched();
  }

  onFileSelected(event: Event) {
    const file = (event.target as HTMLInputElement)?.files?.[0];
    if (file) {
      this.fileUpload = file;
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  async onSubmit() {
    this.form.markAllAsTouched();
    if (this.form.invalid) {
      return;
    }
    this.dialogService.setIsQuestion(true);
    const result = await this.dialogService.open({
      content: 'Confirm update your information?',
      yesText: 'Yes',
      noText: 'No'
    });

    if (result === 1) {
      this.loadingService.show();
      const formData = new FormData();
      formData.append('imagePreview', this.fileUpload);
      formData.append('oldPassword', this.form.get('currentPassword')?.value)
      formData.append('fullname', this.form.get('fullname')?.value)
      formData.append('newPassword', this.form.get('newPassword')?.value)
      this.userService.updateUserInforSettings(formData).subscribe({
        next: () => {
          this.loadingService.hide()
          this.dialogService.setIsQuestion(false);
          this.dialogService.open({
            content: "Update your infor successfully!"
          })
          setTimeout(() => {
            this.dialogService.cancel();
            this.loadingService.show();
            this.dialogService.setIsQuestion(true);
            setTimeout(() => {
              this.loadingService.hide()
              this.isEditForm = false
              this.isChangePassword = false
              this.clearForm()
            }, 1000)
          }, 2000)
        },
        error: (err) => {
          console.log(err)
          this.loadingService.hide()
          this.dialogService.setIsQuestion(false);
          this.dialogService.open({
            content: "Cannot update your infor!"
          })
          setTimeout(() => {
            this.dialogService.cancel();
            this.dialogService.setIsQuestion(true);
          }, 3000)
        }
      })
    } else if (result === 2) {
    }
  }
}
