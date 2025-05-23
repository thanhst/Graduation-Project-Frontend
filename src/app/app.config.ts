import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { provideRouter, RouteReuseStrategy, withEnabledBlockingInitialNavigation } from '@angular/router';
import { routes } from './app.routes';
import { CustomRouteReuseStrategy } from './core/helpers/custom-route-reuse-strategy';
import { AuthInterceptor } from './core/services/auth/auth.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [provideZoneChangeDetection({ eventCoalescing: true }), importProvidersFrom(ReactiveFormsModule),
  { provide: RouteReuseStrategy, useClass: CustomRouteReuseStrategy },
  provideHttpClient(withInterceptorsFromDi()),
  {
    provide: HTTP_INTERCEPTORS,
    useClass: AuthInterceptor,
    multi: true,
  },
  provideRouter(routes, withEnabledBlockingInitialNavigation())]
};
