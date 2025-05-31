import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from '../../../../environment/environment';
import { Classroom } from '../../models/classroom/classroom';
import { User } from '../../models/user/user';
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

  private countJoinedSubject = new BehaviorSubject<number>(0);
  countJoinedSubject$ = this.countJoinedSubject.asObservable();

  private countWaitingSubject = new BehaviorSubject<number>(0);
  countWaitingSubject$ = this.countWaitingSubject.asObservable();

  private classRoomSubject = new BehaviorSubject<Classroom>(new Classroom);
  classroom$ = this.classRoomSubject.asObservable();

  private countDataSubject = new BehaviorSubject<{ countJoined: string; countWaiting: string } | null>(null);
  countData$ = this.countDataSubject.asObservable();

  private userJoinedSubject = new BehaviorSubject<User[]>([]);
  userJoined$ = this.userJoinedSubject.asObservable();

  private userWaitingSubject = new BehaviorSubject<User[]>([]);
  userWaiting$ = this.userWaitingSubject.asObservable();

  constructor(private http: HttpClient, private userService: UserService) { }
  getClassroom(classId: string) {
    return this.http.get<Classroom>(`${this.apiUrl}/classrooms/${classId}`,{
      withCredentials: true
    }).pipe(tap(data => {
      this.classRoomSubject.next(data);
    }))
  }
  getClassPreviews(limit: number, offset: number): Observable<Classroom[]> {
    return this.http.get<Classroom[]>(`${this.apiUrl}/classrooms/user/${this.userService.getCurrentUser()?.userId}`, {
      params: {
        limit: limit.toString(),
        offset: offset.toString()
      }, withCredentials: true
    }).pipe(
      tap(data => {
        this.classroomsSubject.next(data);
      })
    );
  }
  getCountClass(): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/classrooms/user/${this.userService.getCurrentUser()?.userId}/count`, {
      withCredentials: true
    })
      .pipe(
        tap(data => {
          this.countSubject.next(data);
        })
      );;
  }
  getClassToday(): Observable<Classroom[]> {
    return this.http.get<Classroom[]>(`${this.apiUrl}/classrooms/user/${this.userService.getCurrentUser()?.userId}/today`, {
      withCredentials: true
    })
      .pipe(
        tap(data => {
          this.classroomsSubject.next(data);
        })
      )
  }
  createClass(classRoom: Classroom): Observable<boolean> {
    return this.http.post<boolean>(`${this.apiUrl}/classrooms/create`, classRoom, {
      withCredentials: true
    })
  }
  joinClass(classRoom: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/classrooms/${classRoom}/join`,
      { "userId": this.userService.getCurrentUser()?.userId }, {
      withCredentials: true
    })
  }
  acceptClass(classId: string, userId: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/classrooms/${classId}/accept`,
      { "userId": userId }, {
      withCredentials: true
    })
  }
  rejectClass(classId: string, userId: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/classrooms/${classId}/reject`,
      { "userId": userId }, {
      withCredentials: true
    })
  }
  getCountClassroom(classId: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/classrooms/${classId}/count`, {
      withCredentials: true
    }).pipe(tap((data) => {
      this.countDataSubject.next(data);
    }))
  }
  getClassroomBy(classId: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/classrooms/${classId}`, {
      withCredentials: true
    })
  }
  getUserJoinedWithClassrooms(classId:string,limit:number,offset:number){
    return this.http.get<any>(`${this.apiUrl}/classrooms/${classId}/users/joined`, {
      params: {
        limit: limit.toString(),
        offset: offset.toString()
      },
      withCredentials: true
    }).pipe(tap((data)=>{this.userJoinedSubject.next(data)}))
  }
  getUserWaitingWithClassrooms(classId:string,limit:number,offset:number){
    return this.http.get<any>(`${this.apiUrl}/classrooms/${classId}/users/waiting`, {
      params: {
        limit: limit.toString(),
        offset: offset.toString()
      },
      withCredentials: true
    }).pipe(tap((data)=>{
      this.userWaitingSubject.next(data)}))
  }
  deleteClass(classId:string){
    return this.http.delete<any>(`${this.apiUrl}/classrooms/${classId}/delete`, {
      withCredentials: true
    })
  }
}
