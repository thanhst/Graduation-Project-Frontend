import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from '../../../../environment/environment';
import { Classroom } from '../../models/classroom/classroom';
import { UserService } from '../user/user.service';

@Injectable({
  providedIn: 'root'
})
export class ClassService {
  private apiUrl = environment.apiUrl;
  private classroomsSubject = new BehaviorSubject<Classroom[]>([]);
  classrooms$ = this.classroomsSubject.asObservable();

  private countSubject = new BehaviorSubject<number>(0);
  count$ = this.countSubject.asObservable();

  constructor(private http: HttpClient, private userService: UserService) { }
  getClassPreviews(limit: number, offset: number): Observable<Classroom[]> {
    return this.http.get<Classroom[]>(`${this.apiUrl}/classrooms/user/${this.userService.getCurrentUser()?.userId}`, {
      params: {
        limit: limit.toString(),
        offset: offset.toString()
      }
    }).pipe(
      tap(data => {
        this.classroomsSubject.next(data);
      })
    );
  }
  getCountClass(): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/classrooms/user/${this.userService.getCurrentUser()?.userId}/count`, {})
      .pipe(
        tap(data => {
          this.countSubject.next(data);
        })
      );;
  }
  getClassToday(): Observable<Classroom[]> {
    return this.http.get<Classroom[]>(`${this.apiUrl}/classrooms/user/${this.userService.getCurrentUser()?.userId}/today`, {})
      .pipe(
        tap(data => {
          this.classroomsSubject.next(data);
        })
      )
  }
  createClass(classRoom: Classroom): Observable<boolean> {
    return this.http.post<boolean>(`${this.apiUrl}/classrooms/create`,classRoom)
  }
}
