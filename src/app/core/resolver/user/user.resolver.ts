import { inject } from '@angular/core';
import { ResolveFn, Router } from '@angular/router';
import { from, of } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { AuthService } from '../../services/auth/auth.service';
import { DialogService } from '../../services/dialog/dialog.service';
import { UserService } from '../../services/user/user.service';

export const userResolver: ResolveFn<any> = (route, state) => {
  const router = inject(Router)
  const userService = inject(UserService);
  const authService = inject(AuthService);
  const dialogService = inject(DialogService);

  const userID = localStorage.getItem('user_id');
  if (!userID) {
    return from(authService.logout()).pipe(
      switchMap(() => of(router.navigate(['/login'])))
    );
  }

  return userService.getUserInfor(userID).pipe(
    catchError((err) => {
      dialogService.setIsQuestion(false);
      dialogService.open({
        content:"Not found your user information !! Sorry!"
      })
      setTimeout(()=>{
        dialogService.cancel()
        dialogService.setIsQuestion(true);
      },3000)
      return from(authService.logout()).pipe(
        switchMap(() => of(router.navigate(['/login'])))
      )
    })
  );
};
