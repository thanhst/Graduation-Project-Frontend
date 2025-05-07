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
}
