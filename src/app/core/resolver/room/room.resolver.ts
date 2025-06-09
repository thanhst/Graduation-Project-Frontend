import { inject } from '@angular/core';
import { ResolveFn, Router } from '@angular/router';
import { catchError, forkJoin, of, tap } from 'rxjs';
import { Room } from '../../models/room/room';
import { RoomService } from '../../services/room/room.service';

export const roomResolver: ResolveFn<any> = (route, state) => {
  const roomService = inject(RoomService);
  const router = inject(Router)
  const user_id = localStorage.getItem("user_id") || ""
  const task = {
    create: route.routeConfig?.path === ":id/room" ? roomService.createRoom(
      new Room(
        route.paramMap?.get("id") || "",
        null,
        "opening",
        user_id,
        new Date(),
        null
      )
    ).pipe(catchError(() => {
      router.navigate([`/meeting/${route.paramMap?.get("id")}/waiting`]);
      return of(null)
    })) : of(null),
    getRoom: route.routeConfig?.path == ":id" ? roomService.getRoom(route.paramMap?.get("id") || "").pipe(tap(room => {
      if (room.roomID == "") {
        router.navigate([`/meeting`]);
      }
      return of(null)
    })) : of(null),
  }
  return forkJoin(task);
};
