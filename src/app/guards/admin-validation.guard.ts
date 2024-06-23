import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { inject } from '@angular/core';

export const adminValidationGuard: CanActivateFn = (route, state) => {
  const auth:AuthService = inject(AuthService);
  const router:Router = inject(Router);

  if(auth.currentUser && auth.currentUser.emailVerified){
    console.log('OK:', auth.currentUser)
    return true;
  }

  router.navigateByUrl('/bienvenido');
  return false;
};
