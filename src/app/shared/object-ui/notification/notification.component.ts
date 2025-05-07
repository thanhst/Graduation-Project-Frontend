import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'app-ui-notification',
  imports: [CommonModule],
  templateUrl: './notification.component.html',
  styleUrl: './notification.component.scss',
  changeDetection:ChangeDetectionStrategy.OnPush
})
export class NotificationUIComponent {
  @Input() type:'success'|'warning'|'info' = 'info';
  @Input() className:string = '';
  @Input() title:string = '';
  @Input() description: string = '';
  constructor(){}
}
