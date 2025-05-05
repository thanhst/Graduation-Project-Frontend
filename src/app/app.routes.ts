import { Routes } from '@angular/router';
import { BaseLayoutComponent } from './layout/base-layout/base-layout.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { CreateSchedulerComponent } from './pages/scheduler/create-schedule/create-scheduler.component';
import { EditScheduleComponent } from './pages/scheduler/edit-schedule/edit-schedule.component';
import { SchedulerComponent } from './pages/scheduler/home/scheduler.component';
import { ListSchedulerUserComponent } from './pages/scheduler/list-scheduler-user/list-scheduler-user.component';
import { ViewScheduleComponent } from './pages/scheduler/view-schedule/view-schedule.component';
export const routes: Routes = [
    { path: 'login', loadComponent: () => import('../app/pages/auth/user-login/user-login.component').then(m => m.UserLoginComponent) },
    { path: 'register', loadComponent: () => import('../app/pages/auth/user-register/user-register.component').then(m => m.UserRegisterComponent) },
    {
        path: 'admin', children: [
            { path: 'login', loadComponent: () => import('../app/pages/auth/admin-login/admin-login.component').then(m => m.AdminLoginComponent) }
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
            { path: 'dashboard', component: DashboardComponent },
            {
                path: 'scheduler', component: SchedulerComponent,
            },
            { path: 'scheduler/create', component: CreateSchedulerComponent },
            { path: 'scheduler/list-your', component: ListSchedulerUserComponent },
            { path: 'scheduler/view', component: ViewScheduleComponent },
            { path: 'scheduler/edit', component: EditScheduleComponent },
            { path: '**', redirectTo: 'dashboard' }
        ]
    },
    { path: '**', redirectTo: '' }
];
