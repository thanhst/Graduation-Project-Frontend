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
    this.flagService.setTitle("Work");
    this.flagService.setActiveScheduler(false);
    this.flagService.setActiveSchedulerNotification(false);
    this.flagService.setActiveSidebarRight(true);
    this.flagService.setActiveSearch(false);
    this.flagService.setActiveNotif(true);

    this.form = fb.group({
      classname: ['', Validators.required],
      description: ['', Validators.required],
      classLink:['']
    })
  }

  goBack() {
    this.location.back()
  }
  onSubmit(){
    
  }
}
