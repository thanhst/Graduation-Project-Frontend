import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
@Component({
  selector: 'app-welcome',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './welcome.component.html',
  styleUrl: './welcome.component.scss'
})
export class WelcomeComponent {
  form: FormGroup;
  imagePreview: string = "";

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      selectRole: ['none', [Validators.required, this.invalidRoleValidator()]],
      teacherId: ['', [Validators.required, Validators.minLength(5)]],
    });
  }

  get selectRole() {
    return this.form.get('selectRole');
  }

  get teacherId() {
    return this.form.get('teacherId');
  }

  ngOnInit(): void {
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
      const formData = new FormData();
      formData.append('selectedRole',this.form.get('selectedRole')?.value);
      formData.append('teacherId',this.form.get('teacherId')?.value);
      formData.append('imagePreview', this.imagePreview);
      console.log(formData);
    } else {
      console.log('Form is invalid');
    }
  }

  invalidRoleValidator():ValidatorFn{
    return(control:AbstractControl):ValidationErrors | null=>{
      return control.value === 'none' ? { invalidRole: true } : null;
    }
  }

  // readfile image
  onFileSelected(event: Event) {
    const file = (event.target as HTMLInputElement)?.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }
  

  username: string = "Hello";
}
