import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const loginSignupGuard: CanActivateFn = (route, state) => {
  const router: Router = inject(Router);
  if (localStorage.getItem('Authorization')) {
    router.navigate(['todo']);
    return false;
  } else return true;
};
