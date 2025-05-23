import { ResolveFn } from '@angular/router';

export const schedulerResolver: ResolveFn<boolean> = (route, state) => {
  return true;
};
