import { CommonModule, Location } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FlagService } from '../../../core/services/flag/flag.service';

@Component({
  selector: 'app-create-work',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './create-work.component.html',
  styleUrl: './create-work.component.scss'
})
export class CreateWorkComponent {
  form: FormGroup;

  constructor(private flagService: FlagService, private location: Location, private fb: FormBuilder) {

    this.flagService.isBack$.subscribe(isBack => {
      if (isBack === true) {
        this.setFlag();
      }
    })
    this.flagService.setBack(false);
    this.setFlag();
    this.form = fb.group({
      classname: ['', Validators.required],
      description: ['', Validators.required],
      link:['']
    })
  }
  setFlag(){
    this.flagService.setTitle("Work");
    this.flagService.setActiveScheduler(false);
    this.flagService.setActiveSchedulerNotification(false);
    this.flagService.setActiveSidebarRight(true);
    this.flagService.setActiveNotif(true);
  }

  goBack() {
    this.location.back()
  }
  onSubmit(){
    this.form.markAllAsTouched();
    if(this.form.invalid){
      return;
    }
    console.log('Hello');
  }
}
