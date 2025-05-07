import { CommonModule, Location } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { FlagService } from '../../../core/services/flag/flag.service';

@Component({
  selector: 'app-create-scheduler',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './create-scheduler.component.html',
  styleUrl: './create-scheduler.component.scss'
})
export class CreateSchedulerComponent {
  form: FormGroup;
  isTeacher: boolean = true;

  constructor(private route: Router, private fb: FormBuilder,
    private location: Location, private flagService: FlagService) {
    this.flagService.setActiveScheduler(true);
    this.flagService.setActiveSearch(false);
    this.flagService.setActiveSchedulerNotification(true);
    this.flagService.setActiveSidebarRight(true);
    this.flagService.setTitle("Scheduler");
    this.flagService.setActiveNotif(false);


    this.form = this.fb.group(
      {
        title: ['', [Validators.required]],
        password: [''],
        date: [null, [Validators.required]],
        classname: [''],
        description: ['']
      })
    // gọi service lấy thông tin user để thay đổi về role người dùng.
  }
  numbers = [0, 1, 2, 3, 4];

  goBack() {
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
