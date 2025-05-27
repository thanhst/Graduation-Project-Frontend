import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { of } from 'rxjs';
import { ClassService } from '../../services/class/class.service';

export const classroomResolver: ResolveFn<any> = (route, state) => {
  const classService = inject(ClassService);

  classService.getCountClass().subscribe({
    next: (count) => {
      // console.log('Count:', count);
    },
    error: (err) => {
      console.error('Error getting count:', err.error);
    }
  });
  
  classService.getClassPreviews(6, 0).subscribe({
    next: (classes) => {
      // console.log('Classes:', classes);
    },
    error: (err) => {
      console.error('Error getting class previews:', err.error);
    }
  });

  return of(true);
};
