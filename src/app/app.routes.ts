import { Routes } from '@angular/router';
import { BaseLayoutComponent } from './layout/base-layout/base-layout.component';
import { BaseLoginComponent } from './layout/base-login-layout/base-login.component';
import { AdminLoginComponent } from './pages/auth/admin-login/admin-login.component';
import { WelcomeComponent } from './pages/welcome/welcome.component';
export const routes: Routes = [
    { path: '', component: BaseLoginComponent },
    { path: 'admin', component: AdminLoginComponent },
    {
        path: '',
        component: BaseLayoutComponent,
        children: [
            { path: 'dashboard', component: AdminLoginComponent }
        ]
    },
    {
        path: 'welcome',
        component: WelcomeComponent
    },
    { path: '**', redirectTo: '' }
];
