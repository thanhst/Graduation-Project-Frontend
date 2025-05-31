import { CommonModule, Location } from '@angular/common';
import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Classroom } from '../../../core/models/classroom/classroom';
import { Scheduler } from '../../../core/models/scheduler/scheduler';
import { ClassService } from '../../../core/services/class/class.service';
import { DialogService } from '../../../core/services/dialog/dialog.service';
import { FlagService } from '../../../core/services/flag/flag.service';
import { LoadingService } from '../../../core/services/loading/loading.service';
import { SchedulerService } from '../../../core/services/scheduler/scheduler.service';
import { UserService } from '../../../core/services/user/user.service';

@Component({
  selector: 'app-create-scheduler',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './create-scheduler.component.html',
  styleUrl: './create-scheduler.component.scss',
})
export class CreateSchedulerComponent {
  form: FormGroup;
  isTeacher: boolean = true;
  role: string = localStorage.getItem("role") || ""
  classrooms: Record<string, Classroom> = {};

  constructor(private route: Router, private fb: FormBuilder,
    private location: Location, private flagService: FlagService,
    private schedulerService: SchedulerService, private userService: UserService,
    private classService: ClassService, private loadingService: LoadingService,
    private dialogService: DialogService) {

    this.flagService.isBack$.subscribe(isBack => {
      if (isBack == true) {
        this.setFlag();
      }
    })
    this.flagService.setBack(false);
    this.setFlag();

    this.form = this.fb.group(
      {
        title: ['', [Validators.required]],
        date: [null, [Validators.required, this.futureDateValidator()]],
        classname: [''],
        description: ['']
      })
  }
  futureDateValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const inputDate = new Date(control.value);
      if (inputDate < new Date()) {
        return { pastDate: true };
      }
      return null;
    };
  }
  ngOnInit(): void {
    if (this.role == "teacher") {
      this.classService.getClassPreviews(100, 0).subscribe({
        next: (data) => {
          data.forEach(cls => {
            this.classrooms[cls.className] = cls;
          });
        }
      });
    }
  }

  setFlag() {
    this.flagService.setActiveScheduler(true);
    this.flagService.setActiveSchedulerNotification(true);
    this.flagService.setActiveSidebarRight(true);
    this.flagService.setTitle("Scheduler");
    this.flagService.setActiveNotif(false);
  }

  goBack() {
    this.location.back();
  }
  get classroomArray(): Classroom[] {
    return Object.values(this.classrooms);
  }
  clearForm() {
    this.form.patchValue({
      title: '',
      date: null,
      classname: '',
      description: ''
    });
    this.form.markAsPristine();
    this.form.markAsUntouched();
  }


  async onSubmit() {
    this.form.markAllAsTouched();
    if (this.form.invalid) {
      return
    }
    this.dialogService.setIsQuestion(true);
    const result = await this.dialogService.open({
      content: 'Confirm update your information?',
      yesText: 'Yes',
      noText: 'No'
    });
    var isoString: string = "";
    const val = this.form.get('date')?.value;
    const dateObj = val ? new Date(val) : null;
    // console.log(dateObj)
    if (dateObj && !isNaN(dateObj.getTime())) {
      isoString = dateObj.toISOString();
    } else {
      // console.error('Giá trị không phải ngày hợp lệ:', val);
    }
    if (result === 1) {
      this.loadingService.show();
      var sc:Scheduler;
      if (this.role == "teacher") {
        const selectedClassName = this.form.get("classname")?.value || "";
        const selectedClassroom = this.classrooms[selectedClassName];
        sc = new Scheduler(
          '',
          '',
          this.userService.getCurrentUser()?.userId,
          selectedClassroom.classID,
          isoString,
          this.form.get("title")?.value||"",
          this.form.get("description")?.value||"",
          new Date,
          new Date,
        )
      }else{
        sc = new Scheduler(
          '',
          '',
          this.userService.getCurrentUser()?.userId,
          null,
          isoString,
          this.form.get("title")?.value||"",
          this.form.get("description")?.value||"",
          new Date,
          new Date,)
      }
      this.schedulerService.Create(sc).subscribe({
        next: () => {
          this.loadingService.hide()
          this.dialogService.setIsQuestion(false);
          this.dialogService.open({
            content: "Create schedule successfully!"
          })
          setTimeout(() => {
            this.dialogService.cancel();
            this.loadingService.show();
            this.dialogService.setIsQuestion(true);
            setTimeout(() => {
              this.loadingService.hide()
              this.clearForm()
            }, 1000)
          }, 2000)
        },
        error: (err) => {
          console.log(err)
          this.loadingService.hide()
          this.dialogService.setIsQuestion(false);
          this.dialogService.open({
            content: err.error
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
