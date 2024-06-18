import { CanActivateFn } from '@angular/router';

export const adminValidationGuard: CanActivateFn = (route, state) => {
  return true;
};
