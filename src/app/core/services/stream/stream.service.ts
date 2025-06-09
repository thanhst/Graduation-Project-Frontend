import { Injectable } from '@angular/core';
import { combineLatest, map, Observable } from 'rxjs';
import { MediaService } from '../../websocket/media/media.service';

interface UserStream {
  userId: string;
  stream: MediaStream;
  isMicOn: boolean;
  isCamOn: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class StreamService {
  stream$: Observable<Map<string, UserStream>>;
  userId:string = localStorage.getItem("user_id")||""
  constructor(private mediaService: MediaService) {
    this.stream$ = combineLatest([
      this.mediaService.localStream$,
      this.mediaService.remoteStreams$
    ]).pipe(
      map(([local,remoteMap]) => {
        const newMap = new Map<string, UserStream>();

        if (local) {
          const stream = local.stream
          if(stream!=null){
            newMap.set(this.userId, {
              userId: this.userId,
              stream: stream,
              isMicOn: this.mediaService.isMicOnSubject.getValue(),
              isCamOn: this.mediaService.isCameraOnSubject.getValue(),
            });
          }
        }
        remoteMap.forEach((userStream, userId) => {
          const stream = userStream.stream;
          if(stream!=null){
            newMap.set(userId, {
              userId,
              stream:stream,
              isMicOn: true,
              isCamOn: true,
            });
          }
        });
        return newMap;
      })
    );
  }
}
