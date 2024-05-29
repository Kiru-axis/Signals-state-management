import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';

export const roleGuard: CanActivateFn = (route, state) => {
  const jwt = inject(JwtHelperService);
  const router = inject(Router);
  const decode = jwt.decodeToken();
  if (decode.role !== route.data['requiredRole']) {
    router.navigateByUrl('/about');
    return false;
  }

  return true;
};
