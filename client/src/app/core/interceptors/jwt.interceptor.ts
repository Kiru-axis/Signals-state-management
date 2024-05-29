import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';

export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
  const jwt = inject(JwtHelperService);
  const token = jwt.tokenGetter();
  if (token) {
    req = req.clone({
      setHeaders: {
        Authorization: 'Bearer ' + token,
      },
    });
  }

  return next(req);
};
