import { Component } from '@angular/core';
import { FlagService } from '../../../../core/services/flag/flag.service';

@Component({
  selector: 'app-home-class',
  imports: [],
  templateUrl: './home-class.component.html',
  styleUrl: './home-class.component.scss'
})
export class HomeClassComponent {
  constructor(private flagService:FlagService){
    this.flagService.setTitle('workname')
  }
}
