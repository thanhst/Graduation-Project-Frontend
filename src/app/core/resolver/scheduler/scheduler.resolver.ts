import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { catchError, forkJoin, of } from 'rxjs';
import { SchedulerService } from '../../services/scheduler/scheduler.service';

export const schedulerResolver: ResolveFn<any> = (route, state) => {
  const schedulerService = inject(SchedulerService)
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  schedulerService.SetSelectedDate(today);
  const tasks = {
    date: route.routeConfig?.path === "scheduler"||route.routeConfig?.path === ""?schedulerService.GetSchedulerByUserAndDate().pipe(catchError(()=>of(null))):of(null),
    all:route.routeConfig?.path === "scheduler/all"||route.routeConfig?.path === ""?schedulerService.GetAll(100,0).pipe(catchError(()=>of(null))):of(null),
    view:route.routeConfig?.path === "scheduler/:id/view"||route.routeConfig?.path === "scheduler/:id/edit"?schedulerService.View(route.paramMap.get("id")||"").pipe(catchError(()=>of(null))):of(null)
  }
  return forkJoin(tasks);
};
