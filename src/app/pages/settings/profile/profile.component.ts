import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { DialogService } from '../../../core/services/dialog/dialog.service';
import { FlagService } from '../../../core/services/flag/flag.service';
import { LoadingService } from '../../../core/services/loading/loading.service';

@Component({
  selector: 'app-profile',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
})
export class ProfileComponent {
  form: FormGroup;
  isEditForm: boolean = false;

  constructor(private fb: FormBuilder, private flagService: FlagService,
    private dialogService: DialogService,
    private loadingService: LoadingService
  ) {
    this.flagService.isBack$.subscribe(isBack => {
      if (isBack === true) {
        this.setFlag();
      }
    })
    this.flagService.setBack(false);
    this.setFlag();

    this.form = this.fb.group({
      fullname: ['', [Validators.required]],
      email: ['', [Validators.email, Validators.required]],
      imageUser: ['', [Validators.required]],
      currentPassword: ['', [Validators.required, Validators.minLength(8)]],
      newPassword: ['', [Validators.required, Validators.minLength(8)]],
      rePassword: ['', [Validators.required, Validators.minLength(8)]]
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
    this.form.get('email')?.disable();
    this.form.get('imageUser')?.disable();
    this.form.get('currentPassword')?.disable();
    this.form.get('newPassword')?.disable();
    this.form.get('rePassword')?.disable();
  }

  onChangeEdit() {
    if (!this.isEditForm) {
      this.isEditForm = true;
      this.form.get('fullname')?.enable();
      this.form.get('email')?.enable();
      this.form.get('imageUser')?.enable();
      this.form.get('currentPassword')?.enable();
      this.form.get('newPassword')?.enable();
      this.form.get('rePassword')?.enable();
    }
    else {
      this.isEditForm = false;
      this.form.get('fullname')?.disable();
      this.form.get('email')?.disable();
      this.form.get('imageUser')?.disable();
      this.form.get('currentPassword')?.disable();
      this.form.get('newPassword')?.disable();
      this.form.get('rePassword')?.disable();
    }
  }

  async onSubmit() {
    this.form.markAllAsTouched();

    if (this.form.invalid) {
      return;
    }
    const result = await this.dialogService.open({
      content: 'Confirm update your information?',
      yesText: 'Yes',
      noText: 'No'
    });

    if (result === 1) {
      // Người dùng chọn "Yes"
      console.log('Gửi dữ liệu!');
      this.loadingService.show();
      setTimeout(() => {
        this.loadingService.hide();
      }, 5000)
      // Gọi API hoặc logic xử lý tại đây
    } else if (result === 2) {
      // Người dùng chọn "No"
      console.log('Hủy gửi.');
    }
  }
}
