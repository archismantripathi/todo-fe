import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const todoGuard: CanActivateFn = (route, state) => {
  const router: Router = inject(Router);
  if (localStorage.getItem('Authorization')) return true;
  else {
    router.navigate(['login']);
    return false;
  }
};
