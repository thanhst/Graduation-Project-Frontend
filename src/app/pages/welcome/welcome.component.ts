import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DialogService } from '../../core/services/dialog/dialog.service';
import { LoadingService } from '../../core/services/loading/loading.service';
import { UserService } from '../../core/services/user/user.service';
@Component({
  selector: 'app-welcome',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './welcome.component.html',
  styleUrl: './welcome.component.scss'
})
export class WelcomeComponent {
  form: FormGroup;
  imagePreview: string = "";
  username: string | undefined = "";
  private fileUpload!: File;

  constructor(private fb: FormBuilder, private userService: UserService,
    private route: Router, private dialogService: DialogService,
    private loading: LoadingService) {
    this.form = this.fb.group({
      selectRole: ['none', [Validators.required, this.invalidRoleValidator()]],
      teacherId: ['', [Validators.required, Validators.minLength(5)]],
    });
    this.username = this.userService.getCurrentUser()?.fullName
  }

  get selectRole() {
    return this.form.get('selectRole');
  }

  get teacherId() {
    return this.form.get('teacherId');
  }

  ngOnInit(): void {
    //load data from user.
    this.selectRole?.valueChanges.subscribe(value => {
      if (value !== 'teacher') {
        this.teacherId?.setValue('');
        this.teacherId?.disable();
      }
      else {
        this.teacherId?.enable();
      }
    });
    this.teacherId?.disable();
  }

  onSubmit() {
    this.form.markAllAsTouched();
    if (this.form.invalid) {
      return;
    }
    if (this.form.valid) {
      this.loading.show()
      const formData = new FormData();
      formData.append('selectedRole', this.form.get('selectRole')?.value);
      formData.append('teacherId', this.form.get('teacherId')?.value);
      formData.append('imagePreview', this.fileUpload);

      this.userService.updateUser(formData).subscribe({
        next: () => {
          this.loading.hide()
          this.dialogService.setIsQuestion(false);
          this.dialogService.open({
            content:"Update your infor successfully!"
          })
          setTimeout(() => {
            this.dialogService.cancel();
            this.loading.show();
            this.dialogService.setIsQuestion(true);
            setTimeout(()=>{
              this.loading.hide()
              this.route.navigate(['/dashboard'])
            },1000)
          }, 3000)
        },
        error: (err) => {
          this.loading.hide()
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
    } else {
      console.log('Form is invalid');
    }
  }

  invalidRoleValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      return control.value === 'none' ? { invalidRole: true } : null;
    }
  }

  // readfile image
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
}
