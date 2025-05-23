import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { DialogService } from './core/services/dialog/dialog.service';
import { LoadingService } from './core/services/loading/loading.service';
import { DiaglogComponent } from "./shared/component/diaglog/diaglog.component";
import { LoadingComponent } from "./shared/component/loading/loading.component";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, LoadingComponent, CommonModule, DiaglogComponent,],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'frontend';
  constructor(public loadingService:LoadingService,public dialogService:DialogService
    ,private cdf:ChangeDetectorRef
  ){
  }
  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.loadingService.isLoading$.subscribe(value=>{
      this.cdf.detectChanges();
    });
    this.dialogService.dialogVisible$.subscribe(value=>{
      this.cdf.detectChanges();
    });
    this.dialogService.dialogConfig$.subscribe(value=>{
      this.cdf.detectChanges();
    });
  }
}
