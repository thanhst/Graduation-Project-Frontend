import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environment/environment';
import { Classroom } from '../../models/classroom/classroom';

@Injectable({
  providedIn: 'root'
})
export class ClassService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}
  getClassPreviews(): Observable<Classroom[]> {
    return this.http.get<Classroom[]>(`${this.apiUrl}/classroom/`);
  }
}
