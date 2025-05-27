import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { NotificationUIComponent } from '../../object-ui/notification/notification.component';
@Component({
  selector: 'app-notification',
  imports: [CommonModule,NotificationUIComponent],
  templateUrl: './notification.component.html',
  styleUrl: './notification.component.scss'
})
export class NotificationComponent {
  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    // console.log("render này!")
  }
}
