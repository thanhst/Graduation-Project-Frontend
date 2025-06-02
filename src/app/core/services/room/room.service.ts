import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../../../../environment/environment';
import { Room } from '../../models/room/room';

@Injectable({
  providedIn: 'root'
})
export class RoomService {
  private currentRoomSubject = new BehaviorSubject<Room | null>(null);
  public currentRoom$ = this.currentRoomSubject.asObservable();
  private apiUrl = environment.apiUrl;


  constructor(private http: HttpClient) { }

  createRoom(rm: Room): Observable<Room> {
    return this.http.post<Room>(`${this.apiUrl}/room/create`,rm, {
      withCredentials: true,
    }).pipe(
      tap(room => this.currentRoomSubject.next(room))
    );
  }

  getRoom(roomId:string):Observable<Room>{
    return this.http.get<Room>(`${this.apiUrl}/room/${roomId}/get`,{
      withCredentials: true,
    }).pipe(tap((room)=>{
      this.currentRoomSubject.next(room)
    }))
  }
  getCurrentRoom(): Room | null {
    return this.currentRoomSubject.value;
  }
}
