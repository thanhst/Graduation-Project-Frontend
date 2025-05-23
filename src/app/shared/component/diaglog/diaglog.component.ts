import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { DialogService } from '../../../core/services/dialog/dialog.service';

@Component({
  selector: 'app-diaglog',
  imports: [CommonModule],
  templateUrl: './diaglog.component.html',
  styleUrl: './diaglog.component.scss'
})
export class DiaglogComponent {
  constructor(public dialogService:DialogService , private cdRef: ChangeDetectorRef){
  }
  isQuestion :boolean = true;
  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.dialogService.dialogConfig$.subscribe(value=>{
      this.cdRef.detectChanges();
    })
    this.dialogService.dialogVisible$.subscribe(value=>{
      this.cdRef.detectChanges();
    })
    this.dialogService.isQuestion$.subscribe(value=>{
      this.isQuestion = value;
      this.cdRef.detectChanges();
    })
  }
  onSubmit(){
    this.dialogService.confirm();
  }
  onCancel(){
    this.dialogService.cancel();
  }
}
