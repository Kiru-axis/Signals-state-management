import {
  ApplicationConfig,
  enableProdMode,
  importProvidersFrom,
} from '@angular/core';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { withInterceptors, provideHttpClient } from '@angular/common/http';
import { provideRouter, withHashLocation } from '@angular/router';
import { ToastrModule } from 'ngx-toastr';
import { JwtModule } from '@auth0/angular-jwt';

import { routes } from './app.routes';
import { environment } from '@environments/environment';
import { errorInterceptor } from '@core/interceptors/error.interceptor';
import { jwtInterceptor } from '@core/interceptors/jwt.interceptor';

if (environment.production) {
  enableProdMode();
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideAnimationsAsync(),
    provideRouter(routes, withHashLocation()),
    provideHttpClient(withInterceptors([jwtInterceptor, errorInterceptor])),

    importProvidersFrom([
      ToastrModule.forRoot({
        preventDuplicates: true,
        timeOut: 10000,
        positionClass: 'toast-bottom-right',
      }),
      JwtModule.forRoot({
        config: {
          throwNoTokenError: true,
          tokenGetter() {
            const token = sessionStorage.getItem('token');
            return token ? JSON.parse(token) : null;
          },
        },
      }),
    ]),
  ],
};
