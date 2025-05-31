import { Routes } from '@angular/router';
import { authGuard } from './core/guard/auth.guard';
import { unAuthGuard } from './core/guard/un-auth.guard';
import { welcomeGuard } from './core/guard/welcome.guard';
import { classroomResolver } from './core/resolver/classroom/classroom.resolver';
import { schedulerResolver } from './core/resolver/scheduler/scheduler.resolver';
import { userResolver } from './core/resolver/user/user.resolver';
import { BaseLayoutComponent } from './layout/base-layout/base-layout.component';
import { BaseRoomLayoutComponent } from './layout/base-room-layout/base-room-layout.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { MeetingHomeComponent } from './pages/meeting-room/meeting-home/meeting-home.component';
import { MeetingJoinComponent } from './pages/meeting-room/meeting-join/meeting-join.component';
import { MeetingRoomComponent } from './pages/meeting-room/meeting-room/meeting-room.component';
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
import { JoinComponent } from './pages/work/join/join.component';

export const routes: Routes = [
    { path: 'login', loadComponent: () => import('../app/pages/auth/user-login/user-login.component').then(m => m.UserLoginComponent), canActivate: [unAuthGuard] },
    { path: 'register', loadComponent: () => import('../app/pages/auth/user-register/user-register.component').then(m => m.UserRegisterComponent), canActivate: [unAuthGuard] },
    {
        path: 'welcome',
        loadComponent: () => import('../app/pages/welcome/welcome.component').then(m => m.WelcomeComponent),
        canActivate: [authGuard], resolve: {
            userResolver
        }
    },
    {
        path: 'meeting', component: BaseRoomLayoutComponent, children: [
            { path: '', component: MeetingHomeComponent },
            { path: 'start', component: MeetingHomeComponent },
            { path: ':id/join', component: MeetingJoinComponent },
            { path: ':id/room', component: MeetingRoomComponent },
            { path: '**', redirectTo: '' }
        ], canActivateChild: [authGuard, welcomeGuard], resolve: {
            userResolver
        }
    },
    {
        path: '',
        component: BaseLayoutComponent,
        children: [
            {
                path: 'dashboard', component: DashboardComponent, resolve: {
                    classroomResolver,
                }
            },

            { path: 'scheduler/create', component: CreateSchedulerComponent },
            {
                path: 'scheduler/all', component: ListSchedulerUserComponent, resolve: {
                    schedulerResolver,
                }
            },
            {
                path: 'scheduler/:id/view', component: ViewScheduleComponent, resolve: {
                    data: schedulerResolver,
                }, runGuardsAndResolvers: 'paramsChange'
            },
            {
                path: 'scheduler/:id/edit', component: EditScheduleComponent, resolve: {
                    data: schedulerResolver,
                }, runGuardsAndResolvers: 'paramsChange'
            },
            {
                path: 'scheduler', component: SchedulerComponent, resolve: {
                    schedulerResolver,
                }
            },

            { path: 'setting', component: ProfileComponent, },

            { path: 'statistical/:id/chart', component: ViewStatisticalComponent, },
            { path: 'statistical', component: StatisticalComponent, },

            { path: 'work/join', component: JoinWorkComponent, },
            {
                path: 'work/:id/class', component: LayoutComponent,
                children: [
                    { path: 'home', component: HomeClassComponent, resolve: { classroomResolver } },
                    { path: 'all-members', component: AllMemberComponent, resolve: { classroomResolver } },
                    { path: 'all-members/request', component: RequestRoomComponent, resolve: { classroomResolver } },
                    { path: 'settings', component: SettingsComponent, resolve: { classroomResolver } },
                    { path: 'join', component: JoinComponent, resolve: { classroomResolver } },
                    { path: '**', redirectTo: 'home' }
                ],
            },
            { path: 'work/create', component: CreateWorkComponent, },
            {
                path: 'work/all', component: AllWorkComponent, resolve: {
                    classroomResolver,
                }
            },
            { path: 'work', component: WorkComponent, },
            { path: '**', redirectTo: 'dashboard' }
        ], canActivateChild: [authGuard, welcomeGuard], resolve: {
            userResolver,
            schedulerResolver
        }
    },
    { path: '**', redirectTo: '' }
];
