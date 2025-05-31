import { CommonModule, Location } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Scheduler } from '../../../core/models/scheduler/scheduler';
import { DialogService } from '../../../core/services/dialog/dialog.service';
import { FlagService } from '../../../core/services/flag/flag.service';
import { LoadingService } from '../../../core/services/loading/loading.service';
import { SchedulerService } from '../../../core/services/scheduler/scheduler.service';

@Component({
  selector: 'app-view-schedule',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './view-schedule.component.html',
  styleUrl: './view-schedule.component.scss',
})
export class ViewScheduleComponent {
  form: FormGroup;
  isTeacher: boolean = true;
  role: string = localStorage.getItem("role") || ""
  userId: string = localStorage.getItem("user_id") || ""
  thisScheduler: Scheduler = new Scheduler()

  constructor(private route: Router, private fb: FormBuilder
    , private location: Location, private flagService: FlagService,
    private schedulerService: SchedulerService, private router: ActivatedRoute,private loadingService:LoadingService
  ,private dialogService:DialogService) {
    this.router.data.subscribe(data => {
      this.thisScheduler = data['data']['view'];
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
    this.flagService.isBack$.subscribe(isBack => {
      if (isBack === true) {
        this.setFlag();
      }
    })
    this.flagService.setBack(false);
    this.setFlag();

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
  }
  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
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

  async onRemove() {
    this.dialogService.setIsQuestion(true);
    const result = await this.dialogService.open({
      content: 'Confirm delete your schedule?',
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
      this.schedulerService.Delete(this.thisScheduler.schedulerID).subscribe({
        next: () => {
          this.loadingService.hide()
          this.dialogService.setIsQuestion(false);
          this.dialogService.open({
            content: "Delete schedule successfully!"
          })
          setTimeout(() => {
            this.dialogService.cancel();
            this.loadingService.show();
            this.dialogService.setIsQuestion(true);
            setTimeout(() => {
              this.loadingService.hide()
              this.route.navigate([`/scheduers`])
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
