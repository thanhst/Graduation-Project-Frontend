import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { FlagService } from '../../../../core/services/flag/flag.service';

@Component({
  selector: 'app-settings',
  imports: [ReactiveFormsModule,CommonModule],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss'
})
export class SettingsComponent {
  form: FormGroup;
  isTeacher:boolean = true;
  constructor(private flagService: FlagService,private fb:FormBuilder) {
    this.flagService.setTitle('workname');
    this.form= fb.group({
      classId:[''],
      className:[''],
      createdAt:['']
    })
  }
  ngOnInit(): void {
    this.form.get('classId')?.disable();
    this.form.get('className')?.disable();
    this.form.get('createdAt')?.disable();
  }
}
