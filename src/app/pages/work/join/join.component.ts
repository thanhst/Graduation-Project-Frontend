import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ClassService } from '../../../core/services/class/class.service';
import { DialogService } from '../../../core/services/dialog/dialog.service';
import { LoadingService } from '../../../core/services/loading/loading.service';

@Component({
  selector: 'app-join',
  imports: [],
  templateUrl: './join.component.html',
  styleUrl: './join.component.scss'
})
export class JoinComponent {
  classId: string | null = "";
  constructor(private route: ActivatedRoute, private router: Router, private loadingService: LoadingService, private dialogService: DialogService, private classService: ClassService) {
    this.loadingService.show();
    setTimeout(() => {
      this.classId = this.route.snapshot.parent?.paramMap.get('id')?.toString() || "";
      this.classService.joinClass(this.classId).subscribe({
        next:(data)=>{
          const content = data.message || data.error;
          this.loadingService.hide();
          this.dialogService.setIsQuestion(false);
          this.dialogService.open({ content:content });
          setTimeout(()=>{
            this.dialogService.cancel();
            this.dialogService.setIsQuestion(true);
            this.loadingService.show();
            setTimeout(()=>{
              this.loadingService.hide();
              this.router.navigate([`/classrooms/${this.classId}/home`])
            },1000)
          },5000)
        },
        error:(err)=>{
          this.loadingService.hide();
          this.dialogService.setIsQuestion(false);
          console.log(err.error)
          this.dialogService.open({ content:err.error });
          setTimeout(()=>{
            this.dialogService.cancel();
            this.dialogService.setIsQuestion(true);
            this.loadingService.show();
            setTimeout(()=>{
              this.loadingService.hide();
              this.router.navigate([`/classrooms/join`])
            },1000)
          },5000)
        }
      })
    }, 1000)
  }
}
