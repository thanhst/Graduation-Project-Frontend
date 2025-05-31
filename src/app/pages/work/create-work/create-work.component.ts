import { CommonModule, Location } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { hashMD5 } from '../../../core/helpers/hashMD5';
import { Classroom } from '../../../core/models/classroom/classroom';
import { ClassService } from '../../../core/services/class/class.service';
import { DialogService } from '../../../core/services/dialog/dialog.service';
import { FlagService } from '../../../core/services/flag/flag.service';
import { LoadingService } from '../../../core/services/loading/loading.service';
import { UserService } from '../../../core/services/user/user.service';

@Component({
  selector: 'app-create-work',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './create-work.component.html',
  styleUrl: './create-work.component.scss'
})
export class CreateWorkComponent {
  form: FormGroup;

  constructor(private flagService: FlagService, private location: Location, private fb: FormBuilder,
    private classService: ClassService, private userService: UserService,
    private loadingService: LoadingService, private dialogService: DialogService
  ) {
    this.flagService.isBack$.subscribe(isBack => {
      if (isBack === true) {
        this.setFlag();
      }
    })
    this.flagService.setBack(false);
    this.setFlag();
    this.form = fb.group({
      classId: [hashMD5(Date.now().toString())],
      classname: ['', Validators.required],
      description: ['', Validators.required],
      link: ["http://localhost:4200/classrooms/" + hashMD5(Date.now().toString())+"/join"]
    })
  }
  setFlag() {
    this.flagService.setTitle("Work");
    this.flagService.setActiveScheduler(false);
    this.flagService.setActiveSchedulerNotification(false);
    this.flagService.setActiveSidebarRight(true);
    this.flagService.setActiveNotif(true);
  }

  goBack() {
    this.location.back()
  }
  copy() {
    const text = this.form.get("classId")?.value;
    navigator.clipboard.writeText(text).then(() => {
      this.dialogService.setIsQuestion(false);
      this.dialogService.open({
        content: "Already to copy the id of class in clipboard!",
      })
      setTimeout(() => {
        this.dialogService.cancel();
        this.dialogService.setIsQuestion(true);
      }, 500)
    }).catch(err => {
      console.error('Lỗi khi copy:', err);
    });
  }
  onSubmit() {
    this.form.markAllAsTouched();
    if (this.form.invalid) {
      return;
    } else {
      const classroom = new Classroom(
        this.form.get("classId")?.value,
        this.form.get("classname")?.value,
        this.userService.getCurrentUser()?.userId,
        this.form.get("description")?.value,
        this.form.get("link")?.value,
        new Date(),
        new Date(),
      )
      this.classService.createClass(classroom).subscribe({
        next: (data) => {
          console.log(data)
        }
      })
    }
  }
}
