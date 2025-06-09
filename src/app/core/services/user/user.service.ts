import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from '../../../../environment/environment';
import { User } from '../../models/user/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = environment.apiUrl;
  private switchHostSubject = new BehaviorSubject<Boolean>(true);
  public switchHost$ = this.switchHostSubject.asObservable()

  private currentUserSubject = new BehaviorSubject<User | null>(null);
  currentUser$ = this.currentUserSubject.asObservable();
  timestamp = Date.now()
  constructor(private http: HttpClient) {}

  /** Set current user */
  setCurrentUser(user: User | null): void {
    this.currentUserSubject.next(user);
    this.timestamp = Date.now()
  }

  /** Get current user (non-reactive, use only when really needed) */
  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  /** Clear current user */
  clearUser(): void {
    this.setCurrentUser(null);
  }

  /** Get user role from localStorage */
  getUserRole(): string | null {
    return localStorage.getItem("role");
  }

  /** Load user info and update state */
  getUserInfor(userId: string): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/users/${userId}/get`, {
      withCredentials: true
    }).pipe(
      tap(user => this.setCurrentUser(user))
    );
  }

  /** Update user profile settings (general info) */
  updateUserInforSettings(formData: FormData): Observable<any> {
    const user = this.getCurrentUser();
    if (!user) return new Observable<any>();

    const loginMethod = localStorage.getItem("login_method") || "email";
    formData.append("loginMethod", loginMethod);

    return this.http.post<any>(
      `${this.apiUrl}/users/${user.userId}/update/infor`,
      formData,
      { withCredentials: true }
    ).pipe(
      tap(response => this.setCurrentUser(response.user))
    );
  }

  /** Update full user data */
  updateUser(formData: FormData): Observable<any> {
    const user = this.getCurrentUser();
    if (!user) return new Observable<any>();

    formData.append("user", JSON.stringify(user));

    return this.http.post<any>(
      `${this.apiUrl}/users/${user.userId}/update`,
      formData,
      { withCredentials: true }
    ).pipe(
      tap(response => {
        this.setCurrentUser(response.user);
        localStorage.setItem("last_login", response.last_login);
        localStorage.setItem("role", response.role);
      })
    );
  }
  switchHost(value:boolean){
    this.switchHostSubject.next(value);
  }
}
