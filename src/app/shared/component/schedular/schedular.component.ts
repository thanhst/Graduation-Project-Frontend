import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
@Component({
  selector: 'app-schedular-shared',
  imports: [CommonModule],
  templateUrl: './schedular.component.html',
  styleUrl: './schedular.component.scss'
})
export class SchedularComponent {

  isActiveSchedular:boolean =true;

  currentDate: Date = new Date();
  weeks: number[][] = [];
  currentSelectedDate: Date = this.currentDate;

  ngOnInit() {
    this.generateCalendar();
  }

  //setter
  
  setSelectedDate(day:number){
    this.currentSelectedDate = this.getDay(day);
  }
  //end

  //getter
  get monthYear(): string {
    return this.currentDate.toLocaleDateString('en-US', {
      month: 'long',
      year: 'numeric'
    });
  }
  getClassForDay(day: number): string {
    if (this.isToday(day)) {
      return 'current-date';
    } else if (this.isPast(day)) {
      return 'past-date';
    } else {
      return 'future-date';
    }
  }

  getDay(day:number):Date{
    const date = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), day);
    return date
  }

  getSelectedDate(day:number):Date{
    return this.currentSelectedDate;
  }
  //end

  //function

  isToday(day: number): boolean {
    const today = new Date();
    return day === today.getDate() &&
      this.currentDate.getMonth() === today.getMonth() &&
      this.currentDate.getFullYear() === today.getFullYear();
  }

  isPast(day: number): boolean {
    const date = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), day);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  }

  isSelectedDate(day:number):boolean{
    const date = this.getDay(day);
    return this.currentSelectedDate.getFullYear() === date.getFullYear()
    && this.currentSelectedDate.getMonth() === date.getMonth()
    && this.currentSelectedDate.getDate() === day;
  }

  generateCalendar() {
    const firstDay = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), 1);
    const lastDay = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() + 1, 0);
    const startDay = firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1; // Mo = 0

    const totalDays = lastDay.getDate();
    const days = [];
    for (let i = 0; i < startDay; i++) {
      days.push(0); // padding
    }

    for (let i = 1; i <= totalDays; i++) {
      days.push(i);
    }

    this.weeks = [];
    for (let i = 0; i < days.length; i += 7) {
      this.weeks.push(days.slice(i, i + 7));
    }
  }
  prevMonth() {
    this.currentDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() - 1, 1);
    this.generateCalendar();
  }

  nextMonth() {
    this.currentDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() + 1, 1);
    this.generateCalendar();
  }
}
