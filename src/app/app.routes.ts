import { Routes } from '@angular/router';
import { BaseLayoutComponent } from './layout/base-layout/base-layout.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { CreateSchedulerComponent } from './pages/scheduler/create-schedule/create-scheduler.component';
import { EditScheduleComponent } from './pages/scheduler/edit-schedule/edit-schedule.component';
import { SchedulerComponent } from './pages/scheduler/home/scheduler.component';
import { ListSchedulerUserComponent } from './pages/scheduler/list-scheduler-user/list-scheduler-user.component';
import { ViewScheduleComponent } from './pages/scheduler/view-schedule/view-schedule.component';
import { ProfileComponent } from './pages/settings/profile/profile.component';
import { StatisticalComponent } from './pages/statistical/home/statistical.component';
import { ViewStatisticalComponent } from './pages/statistical/view-statistical/view-statistical.component';
import { AllWorkComponent } from './pages/work/all-work/all-work.component';
import { AllMemberComponent } from './pages/work/classroom/all-member/all-member.component';
import { HomeClassComponent } from './pages/work/classroom/home-class/home-class.component';
import { LayoutComponent } from './pages/work/classroom/layout/layout.component';
import { RequestRoomComponent } from './pages/work/classroom/request-room/request-room.component';
import { SettingsComponent } from './pages/work/classroom/settings/settings.component';
import { CreateWorkComponent } from './pages/work/create-work/create-work.component';
import { WorkComponent } from './pages/work/home/work.component';
import { JoinWorkComponent } from './pages/work/join-work/join-work.component';
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
            { path: 'dashboard/:id', component: DashboardComponent },


            { path: 'scheduler/create', component: CreateSchedulerComponent },
            { path: 'scheduler/all', component: ListSchedulerUserComponent },
            { path: 'scheduler/:id/view', component: ViewScheduleComponent },
            { path: 'scheduler/:id/edit', component: EditScheduleComponent },
            { path: 'scheduler', component: SchedulerComponent },

            { path: 'setting', component: ProfileComponent },

            { path: 'statistical/:id/chart', component: ViewStatisticalComponent },
            { path: 'statistical', component: StatisticalComponent },

            {path:'work/join',component:JoinWorkComponent},
            {path:'work/:id/class',component:LayoutComponent,children:[
                {path:'home',component:HomeClassComponent},
                {path:'all-members',component:AllMemberComponent},
                {path:'all-members/request',component:RequestRoomComponent},
                {path:'settings',component:SettingsComponent},
                {path:'**',redirectTo:'home'}
            ]},
            {path:'work/create',component:CreateWorkComponent},
            {path:'work/all',component:AllWorkComponent},
            {path:'work',component:WorkComponent},
            { path: '**', redirectTo: 'dashboard' }
        ]
    },
    { path: '**', redirectTo: '' }
];
