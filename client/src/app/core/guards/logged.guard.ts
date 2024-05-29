import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';

export const loggedGuard: CanActivateFn = (route, state) => {
  const jwt = inject(JwtHelperService);
  const router = inject(Router);

  if (jwt.decodeToken()) {
    router.navigateByUrl('dashboard');
    return false;
  }

  return true;
};
