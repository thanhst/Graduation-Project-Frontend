import { CommonModule, Location } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-view-schedule',
  imports: [CommonModule,ReactiveFormsModule,RouterLink],
  templateUrl: './view-schedule.component.html',
  styleUrl: './view-schedule.component.scss'
})
export class ViewScheduleComponent {
  form: FormGroup;
  isTeacher:boolean = true;

  constructor(private route: Router, private fb: FormBuilder, private location:Location) {
    this.form = this.fb.group(
      {
        idRoom:[''],
        title: ['', [Validators.required]],
        password: [''],
        date: [null,[Validators.required]],
        classname: [''],
        description: ['']
      })
    // gọi service lấy thông tin user để thay đổi về role người dùng.
  }
  numbers = [0, 1, 2, 3, 4];

  goBack(){
    this.location.back();
  }
  
  onSubmit() {
    this.form.markAllAsTouched();
    if (this.form.valid) {
      const classnameValue = this.form.get("classname")?.value;  // Lấy giá trị của "classname"
      console.log(classnameValue);
    }
    return;
  }
}
