import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { WebSocketSubject, webSocket } from 'rxjs/webSocket';
import { User } from '../../models/user/user';

@Injectable({
  providedIn: 'root'
})
export class MeetingService {
  private hostSubject = new BehaviorSubject<User | null>(null);
  private userInRoomSubject = new BehaviorSubject<User[]>([]);
  private userWaitingRoomSubject = new BehaviorSubject<User[]>([]);

  host$ = this.hostSubject.asObservable();
  userInRoom$ = this.userInRoomSubject.asObservable();
  userWaitingRoom$ = this.userWaitingRoomSubject.asObservable();
  constructor(private router: Router) {

  }
  private socket$?: WebSocketSubject<any>;

  connect({ roomId, userId, role }: { roomId: string, userId: string, role: string }) {
    if (this.socket$) return;

    this.socket$ = webSocket({
      url: `ws://localhost:8080/ws/room`, openObserver: {
        next: () => {
          console.log('WebSocket connected ✅');
          this.socket$?.next({ userId, roomId, role });
        },
      }, closeObserver: {
        next: () => {
          console.log('WebSocket disconnected ❌');
          this.socket$ = undefined;
        }
      }
    });

    this.socket$.subscribe({
      next: msg => this.handleMessage(msg),
      error: err => console.error('WS error:', err),
      complete: () => console.log('WS closed')
    });
  }

  disconnect() {
    this.socket$?.complete();
    this.socket$ = undefined;
  }

  private handleMessage(msg: any) {
    console.log(msg)
    const role = msg?.role;
    const roomId = msg?.roomId;

    switch (msg.event) {
      case 'host_check':
        if (role === 'host' && this.router.url.includes('/waiting-room')) {
          this.router.navigate([`/meeting/${roomId}/room`]);
        }
        break;

      case 'accepted':
        if (role !== 'host') {
          this.router.navigate([`/meeting/${roomId}/room`]);
        }
        break;

      case 'join_waiting_room':
        if (this.router.url.includes('/room')) {
          this.router.navigate([`/meeting/${roomId}/waiting-room`]);
        }
        break;

      case 'update_host':
        this.hostSubject.next(msg.host);
        break;

      case 'update_user_in_room':
        this.userInRoomSubject.next(msg.users);
        break;

      case 'update_user_waiting_room':
        this.userWaitingRoomSubject.next(msg.users);
        break;

      default:
        break;
    }
  }

  send(msg: any) {
    this.socket$?.next(msg);
  }
}
