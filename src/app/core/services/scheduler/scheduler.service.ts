import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from '../../../../environment/environment';
import { Scheduler } from '../../models/scheduler/scheduler';
import { UserService } from '../user/user.service';

@Injectable({
  providedIn: 'root'
})
export class SchedulerService {
  private apiUrl = environment.apiUrl;
  private userId = localStorage.getItem("user_id")

  private selectedDateSubject = new BehaviorSubject<Date>(new Date);
  selectedDate$ = this.selectedDateSubject.asObservable();

  private schedulersSubject = new BehaviorSubject<Scheduler[]>([]);
  schedulers$ = this.schedulersSubject.asObservable();

  constructor(private http: HttpClient, private userService: UserService) {
  }
  SetSelectedDate(date: Date) {
    this.selectedDateSubject.next(date);
  }
  GetSelectedDate() {
    return this.selectedDateSubject.value;
  }
  GetSchedulerByUserAndDate(): Observable<any> {
    const localDate = new Date(this.selectedDateSubject.getValue());
    localDate.setMinutes(localDate.getMinutes() - localDate.getTimezoneOffset());
    return this.http.get<any>(`${this.apiUrl}/schedulers/user/${this.userId}/get`, {
      params: {
        "date": localDate.toISOString().split('T')[0]
      },
      withCredentials: true
    }).pipe(
      tap(data => {
        this.schedulersSubject.next(data)
      }),
    )
  }
  GetAll(): Observable<Scheduler[]> {
    return this.http.get<Scheduler[]>(`${this.apiUrl}/schedulers/user/${this.userId}/get/all`, {
      withCredentials: true
    }).pipe(
      tap(data=> {
        this.schedulersSubject.next(data)
      })
    )
  }
  Create(sc: Scheduler): Observable<Scheduler> {
    return this.http.post<Scheduler>(`${this.apiUrl}/schedulers/create`, sc, {
      withCredentials: true
    })
  }
  Update(sc: Scheduler): Observable<Scheduler> {
    return this.http.post<Scheduler>(`${this.apiUrl}/schedulers/${sc.schedulerID}/update`, sc, {
      withCredentials: true
    })
  }
  Delete(schedulerID: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/schedulers/${schedulerID}/delete`, {
      withCredentials: true
    })
  }
  View(scId: string): Observable<Scheduler> {
    return this.http.get<Scheduler>(`${this.apiUrl}/schedulers/${scId}/view`, {
      withCredentials: true
    })
  }
}
