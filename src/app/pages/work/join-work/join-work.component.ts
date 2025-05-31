import { CommonModule, Location } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ClassService } from '../../../core/services/class/class.service';
import { DialogService } from '../../../core/services/dialog/dialog.service';
import { FlagService } from '../../../core/services/flag/flag.service';
import { LoadingService } from '../../../core/services/loading/loading.service';

@Component({
  selector: 'app-join-work',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './join-work.component.html',
  styleUrl: './join-work.component.scss'
})
export class JoinWorkComponent {
  form: FormGroup;
  constructor(private flagService: FlagService, private fb: FormBuilder,
    private location: Location, private loadingService: LoadingService,
    private classService: ClassService, private dialogService: DialogService,
    private router: Router) {
    this.flagService.isBack$.subscribe(isBack => {
      if (isBack === true) {
        this.setFlag();
      }
    })
    this.flagService.setBack(false);
    this.setFlag();

    this.form = this.fb.group({
      classID: ['', Validators.required]
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
    this.location.back();
  }
  onSubmit() {
    this.form.markAllAsTouched();
    if (this.form.invalid) {
      return;
    } else {
      this.loadingService.show();
      this.classService.joinClass(this.form.get("classID")?.value).subscribe({
        next: (data) => {
          const content = data.message || data.error;
          this.loadingService.hide();
          this.dialogService.setIsQuestion(false);
          this.dialogService.open({ content: content });
          setTimeout(() => {
            this.dialogService.cancel();
            this.dialogService.setIsQuestion(true);
            this.loadingService.show();
            setTimeout(() => {
              this.loadingService.hide();
              this.router.navigate([`/classrooms/${this.form.get("classID")?.value}/home`])
            }, 1000)
          }, 5000)
        },
        error: (err) => {
          this.loadingService.hide();
          this.dialogService.setIsQuestion(false);
          console.log(err.error)
          this.dialogService.open({ content: err.error });
          setTimeout(() => {
            this.dialogService.cancel();
            this.dialogService.setIsQuestion(true);
          }, 5000)
        }
      })
    }
  }
}
