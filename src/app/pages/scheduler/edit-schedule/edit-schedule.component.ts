import { CommonModule, Location } from '@angular/common';
import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Scheduler } from '../../../core/models/scheduler/scheduler';
import { DialogService } from '../../../core/services/dialog/dialog.service';
import { FlagService } from '../../../core/services/flag/flag.service';
import { LoadingService } from '../../../core/services/loading/loading.service';
import { SchedulerService } from '../../../core/services/scheduler/scheduler.service';

@Component({
  selector: 'app-edit-schedule',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './edit-schedule.component.html',
  styleUrl: './edit-schedule.component.scss',
})
export class EditScheduleComponent {
  form: FormGroup;
  isTeacher: boolean = true;
  role: string = localStorage.getItem("role") || ""
  thisScheduler: Scheduler = new Scheduler()
  userId: string = localStorage.getItem("user_id") || ""

  constructor(private route: Router, private fb: FormBuilder,
    private location: Location, private flagService: FlagService,
    private loadingService: LoadingService, private dialogService: DialogService,
    private router: ActivatedRoute, private schedulerService: SchedulerService) {
    this.flagService.isBack$.subscribe(isBack => {
      if (isBack === true) {
        this.setFlag();
      }
    })
    this.flagService.setBack(false);
    this.setFlag();


    this.form = this.fb.group(
      {
        idRoom: [""],
        title: ["", [Validators.required]],
        date: [null, [Validators.required, this.futureDateValidator()]],
        classname: [this.thisScheduler.Classroom?.className],
        description: [""]
      })
    this.router.data.subscribe(data => {
      this.thisScheduler = data['data']['view'];
      console.log(data)
      this.form = this.fb.group(
        {
          idRoom: [this.thisScheduler.roomID],
          title: [this.thisScheduler.title, [Validators.required]],
          date: [this.thisScheduler.startTime, [Validators.required]],
          classname: [this.thisScheduler.Classroom?.className],
          description: [this.thisScheduler.description]
        })
      const iso = this.thisScheduler.startTime;
      const formatted = iso.slice(0, 16);
      this.form.patchValue({ date: formatted });
    });
    this.form.get("classname")?.disable;
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
  futureDateValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const inputDate = new Date(control.value);
      if (inputDate < new Date()) {
        return { pastDate: true };
      }
      return null;
    };
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
      var sc: Scheduler = new Scheduler(
        this.thisScheduler.schedulerID,
        this.thisScheduler.roomID,
        this.thisScheduler.userID,
        this.thisScheduler.classID,
        isoString,
        this.form.get("title")?.value,
        this.form.get("description")?.value,
        this.thisScheduler.createdAt,
        new Date(),
      );
      this.schedulerService.Update(sc).subscribe({
        next: () => {
          this.loadingService.hide()
          this.dialogService.setIsQuestion(false);
          this.dialogService.open({
            content: "Update schedule successfully!"
          })
          setTimeout(() => {
            this.dialogService.cancel();
            this.loadingService.show();
            this.dialogService.setIsQuestion(true);
            setTimeout(() => {
              this.loadingService.hide()
              this.route.navigate([`/scheduers/${this.thisScheduler.schedulerID}/view`])
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
