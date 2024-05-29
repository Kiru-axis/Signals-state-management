import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';

export const authGuard: CanActivateFn = (route, state) => {
  const jwt = inject(JwtHelperService);
  const router = inject(Router);

  if (jwt.isTokenExpired() || !jwt.decodeToken()) {
    router.navigateByUrl('/auth/login');
    return false;
  }

  return true;
};
