import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, map, Observable, of, tap, throwError } from 'rxjs';
import { environment } from '../../../../environment/environment';
import { Account } from '../../models/account/account';
import { User } from '../../models/user/user';
import { DialogService } from '../dialog/dialog.service';
import { LoadingService } from '../loading/loading.service';
import { UserService } from '../user/user.service';

interface TokenResponse {
  user_id: string;
  role: string;
  last_login: string;
  login_method:string;
  access_exprise: string;
  refresh_exprise: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = environment.apiUrl;
  private refreshing = false;

  constructor(private http: HttpClient, private router: Router,
    private dialogService: DialogService,
    private loadingService: LoadingService,
    private userService: UserService) { }

  private setUserInfo(tokens: TokenResponse): void {
    localStorage.setItem('user_id', tokens.user_id);
    localStorage.setItem('role', tokens.role);
    localStorage.setItem('last_login', tokens.last_login);
    localStorage.setItem('login_method',tokens.login_method);
    localStorage.setItem('access_exprise', tokens.access_exprise);
    localStorage.setItem('refresh_exprise', tokens.refresh_exprise);
  }
  private clearUserInfo(): void {
    localStorage.removeItem('user_id');
    localStorage.removeItem('role');
    localStorage.removeItem("last_login");
    localStorage.removeItem('login_method');
    localStorage.removeItem('access_exprise');
    localStorage.removeItem('refresh_exprise');
  }
  register(account: Account, user: User): Observable<any> {
    const payload = {
      account,
      user
    };
    return this.http.post(`${this.apiUrl}/auth/register`, payload, {
      withCredentials: true
    });
  }

  login(account: Account): Observable<TokenResponse> {
    return this.http.post<TokenResponse>(`${this.apiUrl}/auth/login`, account, {
      withCredentials: true
    }).pipe(
      tap(tokens => this.setUserInfo(tokens))
    );
  }

  refreshToken(): Observable<TokenResponse> {
    if (this.refreshing) {
      return throwError(() => new Error('Refreshing in progress'));
    }

    this.refreshing = true;

    return this.http.post<TokenResponse>(`${this.apiUrl}/auth/refresh-token`, {}, {
      withCredentials: true
    }).pipe(
      tap(tokens => {
        localStorage.setItem('access_exprise', tokens.access_exprise);
        localStorage.setItem('refresh_exprise', tokens.refresh_exprise);
        this.refreshing = false;
      }),
      catchError(err => {
        this.refreshing = false;
        this.clearUserInfo();
        return throwError(() => err);
      })
    );
  }

  logout(): Observable<any> {
    const userId = localStorage.getItem('user_id');
    this.clearUserInfo();
    return this.http.post(`${this.apiUrl}/auth/logout`, {
      userId
    }, { withCredentials: true }).pipe(
      tap(() => {
        this.router.navigate(['/login']);
      }), catchError(err => {
        return throwError(() => err);
      })
    );
  }

  isLoggedIn(): Observable<boolean> {
    return this.http.get(`${this.apiUrl}/auth/check`, { withCredentials: true }).pipe(
      map(() => {
        return true;
      }),
      catchError(err => {
        return of(false);
      })
    );
  }
  loginWithGoogle(idToken: string): Observable<TokenResponse> {
    return this.http.post<TokenResponse>(`${this.apiUrl}/auth/google`, { token: idToken }, {
      withCredentials: true
    }).pipe(
      tap(tokens => this.setUserInfo(tokens))
    );
  }
  loginWithGithub() {
    const popup = window.open(
      "http://localhost:8080/api/auth/github/login?redirect_uri=http://localhost:4200",
      "_blank",
      "width=500,height=600"
    );

    window.addEventListener("message", (event) => {
      if (event.origin !== "http://localhost:8080") return;
      const data = event.data;
      if (data) {
        this.setUserInfo(data)
        popup?.close();
        this.loadingService.show()
        setTimeout(() => {
          this.loadingService.hide()
          this.router.navigate(["/dashboard"])
        },1000)
      }
    });
  }
}
