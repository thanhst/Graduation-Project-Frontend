import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const welcomeGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const lastLogin = localStorage.getItem('last_login');

  if (!lastLogin || lastLogin === 'null' || lastLogin === '') {
    return router.createUrlTree(['/welcome']);
  }

  return true;
};
