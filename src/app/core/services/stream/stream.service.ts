import { Injectable } from '@angular/core';
import { BehaviorSubject, combineLatest, map } from 'rxjs';
import { MediaService, UserStream } from '../../websocket/media/media.service';

@Injectable({
  providedIn: 'root'
})
export class StreamService {
  private streamSubject = new BehaviorSubject<Map<string, UserStream>>(new Map());
  stream$ = this.streamSubject.asObservable();

  userId: string = localStorage.getItem("user_id") || ""
  constructor(private mediaService: MediaService) {
    combineLatest([
      this.mediaService.localStream$,
      this.mediaService.remoteStreams$
    ]).pipe(
      map(([local, remoteMap]) => {
        const newMap = new Map<string, UserStream>();

        if (local) {
          const stream = local.stream;
          if (stream != null) {
            newMap.set(this.userId,local);
          }
        }

        remoteMap.forEach((userStream, userId) => {
          const stream = userStream.stream;
          if (stream != null) {
            newMap.set(userId, userStream);
          }
        });

        return newMap;
      })
    ).subscribe((map) => this.streamSubject.next(map));
  }
  getStream() {
    return this.streamSubject.getValue();
  }
}
