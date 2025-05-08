import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-user',
  imports: [CommonModule],
  templateUrl: './user.component.html',
  styleUrl: './user.component.scss'
})
export class UserComponent {
  @Input() username:string = '';
  @Input() src:string = '';
  @Input() type:'view' | 'request' ='view';
  isTeacher:boolean = true;
  
  onSubmit(){

  }
  onRemove(){

  }
}
