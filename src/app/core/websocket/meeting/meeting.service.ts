import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { WebSocketSubject, webSocket } from 'rxjs/webSocket';
import { environment } from '../../../../environment/environment';
import { WSMessage } from '../../interface/wsmessage.interface';
import { User } from '../../models/user/user';
import { DialogService } from '../../services/dialog/dialog.service';

@Injectable({
  providedIn: 'root'
})
export class MeetingService {
  private hostSubject = new BehaviorSubject<User | null>(null);
  private userInRoomMapSubject = new BehaviorSubject<Map<string, User>>(new Map());
  private userWaitingRoomMapSubject = new BehaviorSubject<Map<string, User>>(new Map());
  private shareStateSubject = new BehaviorSubject<Boolean>(false);
  private autoJoinSubject = new BehaviorSubject<Boolean>(false);

  host$ = this.hostSubject.asObservable();
  

  userInRoom$ = this.userInRoomMapSubject.asObservable();
  userWaitingRoom$ = this.userWaitingRoomMapSubject.asObservable();
  shareState$ = this.shareStateSubject.asObservable();
  autoJoin$ = this.autoJoinSubject.asObservable();

  constructor(private router: Router, private dialogService: DialogService) { }

  private socket$?: WebSocketSubject<any>;

  connect({ roomId, userId, role }: { roomId: string, userId: string, role: string }) {
    if (this.socket$) return;

    this.socket$ = webSocket({
      url: environment.wsRoom,
      openObserver: {
        next: () => {
          console.log('WebSocket connected ✅');
          this.socket$?.next({ userId, roomId, role });
          if (role == "host") {
            this.send({
              event: "return_host",
              data: {
              }
            });
          }
        },
      },
      closeObserver: {
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
    const role = msg?.data?.role;
    const roomId = msg?.data?.roomId;

    switch (msg.event) {
      case 'host_check':
        const users = new Map<string, User>(
          Object.entries(msg.data.users_in_room)
        );
        const usersWaitingRoom = new Map<string, User>(
          Object.entries(msg.data.users_in_waiting_room)
        );
        this.userInRoomMapSubject.next(users);
        this.userWaitingRoomMapSubject.next(usersWaitingRoom);
        this.hostSubject.next(msg.data.user)
        this.autoJoinSubject.next(msg.data.auto_join)
        this.shareStateSubject.next(msg.data.share_state)
        if (role === 'host' && this.router.url.includes('/waiting-room')) {
          this.router.navigate([`/meeting/${roomId}/room`]);
        }
        break;

      case 'accepted':
        if (role !== 'host') {
          const users = new Map<string, User>(
            Object.entries(msg.data.users_in_room)
          );
          this.userInRoomMapSubject.next(users);
          this.hostSubject.next(msg.data.host);
          this.shareStateSubject.next(msg.data.share_state);
          this.router.navigate([`/meeting/${roomId}/room`]);
        }
        break;

      case 'join_waiting_room':
        if (this.router.url.includes('/room')) {
          this.router.navigate([`/meeting/${roomId}/waiting-room`]);
        }
        break;

      case 'update_host':
        this.hostSubject.next(msg.data.user);
        break;

      case 'update_user_in_room': {
        const action = msg.data.action;
        const user = msg.data.user;
        const currentMap = new Map(this.userInRoomMapSubject.getValue());

        if (action === 'add') {
          currentMap.set(user.userId, user);
        } else if (action === 'remove') {
          currentMap.delete(user.userId);
        }
        this.userInRoomMapSubject.next(currentMap);
        break;
      }

      case 'update_user_waiting_room': {
        if (role == "host") {
          const action = msg.data.action;
          const user = msg.data.user;
          const currentMap = new Map(this.userWaitingRoomMapSubject.getValue());

          if (action === 'add') {
            currentMap.set(user.userId, user);
          } else if (action === 'remove') {
            currentMap.delete(user.userId);
          }
          this.userWaitingRoomMapSubject.next(currentMap);
        }
        break;
      }

      case 'host_transferred':
        this.hostSubject.next(msg.data.host);
        break;

      case 'removed':
        this.disconnect();
        this.router.navigate(["/meeting/start"]);
        setTimeout(() => {
          this.dialogService.setIsQuestion(false);
          this.dialogService.open({
            content: "Host not allow you to join this room! Please tell something for host by messenger of facebook !!!"
          })
          this.dialogService.cancel();
          this.dialogService.setIsQuestion(true);
        }, 3000)
        break;
      case "room_closed":
        this.disconnect();
        this.router.navigate(["/meeting/start"]);
        this.dialogService.setIsQuestion(false);
        this.dialogService.open({
          content: "Host closed this room. Bye bye!"
        })
        setTimeout(() => {
          this.dialogService.cancel();
          this.dialogService.setIsQuestion(true);
        }, 3000)
        break;
      case "change_share_permission":
        this.shareStateSubject.next(msg.data.share_state);
        break;
      default:
        break;
    }
  }

  send(msg: WSMessage) {
    this.socket$?.next(msg);
  }

  get userInRoomList(): User[] {
    return Array.from(this.userInRoomMapSubject.getValue().values());
  }

  get userWaitingRoomList(): User[] {
    return Array.from(this.userWaitingRoomMapSubject.getValue().values());
  }

  get host():User | null{
    return this.hostSubject.getValue();
  }
  get shareState():Boolean{
    return this.shareStateSubject.getValue();
  }

  get autoJoin():Boolean{
    return this.autoJoinSubject.getValue();
  }
}
