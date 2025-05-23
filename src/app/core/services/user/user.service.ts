import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../../environment/environment';
import { User } from '../../models/user/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = environment.apiUrl
  constructor(private http: HttpClient) { }
  private currentUser: User | null = null;

  getUserInfor(userId: string): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/users/${userId}/get`, {
      withCredentials: true
    }).pipe(
      tap(user => this.currentUser = user)
    );
  }
  getCurrentUser(): User | null {
    return this.currentUser;
  }

  clearUser() {
    this.currentUser = null;
  }

  updateUser(formData: FormData): Observable<any> {
    var userId = ""
    if (this.currentUser != null) {
      userId = this.currentUser.userId
      formData.append("user", JSON.stringify(this.currentUser))
    }
    return this.http.post<any>(`${this.apiUrl}/users/${userId}/update`, formData, {
      withCredentials: true
    }).pipe(
      tap(value => {
        this.currentUser = value.user,
        localStorage.setItem("last_login",value.last_login)
      })
    );
  }
}
