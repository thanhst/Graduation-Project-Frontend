import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { provideRouter, RouteReuseStrategy } from '@angular/router';
import { routes } from './app.routes';
import { CustomRouteReuseStrategy } from './core/helpers/custom-route-reuse-strategy';

export const appConfig: ApplicationConfig = {
  providers: [provideZoneChangeDetection({ eventCoalescing: true }), provideRouter(routes),importProvidersFrom(ReactiveFormsModule),
    { provide: RouteReuseStrategy, useClass: CustomRouteReuseStrategy }]
};
