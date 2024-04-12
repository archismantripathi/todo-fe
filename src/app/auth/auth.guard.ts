import { inject } from "@angular/core";
import { AuthService } from "./auth.service";
import { Router } from "express";

export const CanActivate = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if(authService.isAuth()) {
    return true;
  } else {
    router.navigate(['/login']);
    return false;
  }
}
