import { Component } from '@angular/core';
import { FlagService } from '../../../../core/services/flag/flag.service';

@Component({
  selector: 'app-rooms',
  imports: [],
  templateUrl: './rooms.component.html',
  styleUrl: './rooms.component.scss'
})
export class RoomsComponent {
  constructor(private flagService: FlagService) {
  }
}
