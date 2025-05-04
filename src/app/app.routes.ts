import { Routes } from '@angular/router';
import { BaseLayoutComponent } from './layout/base-layout/base-layout.component';
import { SchedularComponent } from './pages/schedular/schedular.component';
import { WelcomeComponent } from './pages/welcome/welcome.component';
export const routes: Routes = [
    { path: 'login', loadComponent:()=> import('../app/pages/auth/user-login/user-login.component').then(m=>m.UserLoginComponent) },
    { path: 'register', loadComponent:()=> import('../app/pages/auth/user-register/user-register.component').then(m=>m.UserRegisterComponent)},
    {
        path: 'admin', children: [
            { path: 'login', loadComponent:()=> import('../app/pages/auth/admin-login/admin-login.component').then(m=>m.AdminLoginComponent) }
        ]
    },
    {
        path: 'welcome',
        loadComponent: () => import('../app/pages/welcome/welcome.component').then(m => m.WelcomeComponent) // Lazy load WelcomeModule
    },
    {
        path: '',
        component: BaseLayoutComponent,
        children: [
            { path: 'dashboard', component: WelcomeComponent },
            {path:'schedular',component:SchedularComponent},
            { path: '**', redirectTo: 'dashboard' }
        ]
    },
    { path: '**', redirectTo: '' }
];
