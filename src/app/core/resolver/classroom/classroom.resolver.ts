import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { catchError, forkJoin, of } from 'rxjs';
import { ClassService } from '../../services/class/class.service';

export const classroomResolver: ResolveFn<any> = (route, state) => {
  const classService = inject(ClassService);
  const classId = route.parent?.paramMap.get('id') || ""

  const tasks = {
    count: classService.getCountClass().pipe(catchError(() => of(null))),
    previews: classService.getClassPreviews(6, 0).pipe(catchError(() => of(null))),
    classroom: classId && route.parent?.routeConfig?.path === "work/:id/class"
      ? classService.getClassroom(classId).pipe(catchError(() => of(null)))
      : of(null),
    countClassroom: (route.parent?.routeConfig?.path === "work/:id/class" && classId)
      ? classService.getCountClassroom(classId).pipe(catchError(() => of(null)))
      : of(null),
    allMember:(route.routeConfig?.path === "all-member" && classId)?
    "":of(null)
  };

  return forkJoin(tasks);
};
