import { CommonModule, Location } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FlagService } from '../../../core/services/flag/flag.service';

@Component({
  selector: 'app-join-work',
  imports: [CommonModule,ReactiveFormsModule],
  templateUrl: './join-work.component.html',
  styleUrl: './join-work.component.scss'
})
export class JoinWorkComponent {
  form: FormGroup;
  constructor(private flagService: FlagService, private fb: FormBuilder, private location:Location) {
    this.flagService.isBack$.subscribe(isBack => {
      if (isBack === true) {
        this.setFlag();
      }
    })
    this.flagService.setBack(false);
    this.setFlag();

    this.form = this.fb.group({
      classID: ['',Validators.required]
    })
  }

  setFlag(){
    this.flagService.setTitle("Work");
    this.flagService.setActiveScheduler(false);
    this.flagService.setActiveSchedulerNotification(false);
    this.flagService.setActiveSidebarRight(true);
    this.flagService.setActiveNotif(true);
  }
  
  goBack(){
    this.location.back();
  }
  onSubmit(){

  }
}
