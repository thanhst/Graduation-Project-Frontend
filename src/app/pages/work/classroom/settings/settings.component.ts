import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Classroom } from '../../../../core/models/classroom/classroom';
import { ClassService } from '../../../../core/services/class/class.service';
import { DialogService } from '../../../../core/services/dialog/dialog.service';
import { FlagService } from '../../../../core/services/flag/flag.service';
import { LoadingService } from '../../../../core/services/loading/loading.service';

@Component({
  selector: 'app-settings',
  imports: [ReactiveFormsModule,CommonModule],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss'
})
export class SettingsComponent {
  form: FormGroup;
  isTeacher:boolean = true;
  role: string = localStorage.getItem("role") || "student"
  classroom: Classroom = new Classroom;
  constructor(private flagService: FlagService,private fb:FormBuilder,
    private classService:ClassService,
    private dialogService:DialogService,
    private loadingService: LoadingService,
    private router:Router
  ) {
    this.classService.classroom$.subscribe((data)=>{
      this.classroom = data;
    })
    this.form= fb.group({
      classId:[this.classroom.classID],
      className:[this.classroom.className],
      createdAt:[this.formatDate(new Date(this.classroom.createdAt))]
    })
  }
  formatDate(date: Date): string {
    const pad = (n: number) => n.toString().padStart(2, '0');
    return `${pad(date.getDate())}/${pad(date.getMonth() + 1)}/${date.getFullYear()} - ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
  }

  ngOnInit(): void {
    this.form.get('classId')?.disable();
    this.form.get('className')?.disable();
    this.form.get('createdAt')?.disable();
  }
  async onRemoveClass(){
    this.dialogService.setIsQuestion(true)
    const result = await this.dialogService.open({
      content:"Remove this class?",
      yesText:"Yes",
      noText:"No"
    })
    if(result==1){
      this.loadingService.show();
      this.classService.deleteClass(this.classroom.classID).subscribe({
        next:()=>{
          this.loadingService.hide();
          this.dialogService.setIsQuestion(false);
          this.dialogService.open({
            content:"Success to delete this class!"
          })
          setTimeout(()=>{
            this.dialogService.cancel();
            this.loadingService.show();
            setTimeout(()=>{
              this.loadingService.hide();
              this.router.navigate(['/work'])
            },1000)
          },3000)
        },
        error:(err)=>{
          this.loadingService.hide();
          this.dialogService.setIsQuestion(false);
          this.dialogService.open({
            content:err.message
          })
          setTimeout(()=>{
            this.dialogService.cancel();
          },3000)
        }
      })
    }
  }
}
