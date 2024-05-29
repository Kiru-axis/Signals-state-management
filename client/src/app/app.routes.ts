import { Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { AboutComponent } from './components/about/about.component';
import { ProjectsComponent } from './components/projects/projects.component';
import { loggedGuard } from './core/guards/logged.guard';
import { LoginComponent } from './auth/login/login.component';
import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'auth/login', pathMatch: 'full' },
  {
    path: '',
    canActivate: [loggedGuard], // prevents logged in users from going to these pages
    children: [
      {
        path: 'auth/register',
        loadComponent: () =>
          import('./auth/register/register.component').then(
            (C) => C.RegisterComponent
          ),
      },
      { path: 'auth/login', component: LoginComponent },
    ],
  },
  {
    path: '',
    canActivate: [authGuard, roleGuard],
    data: { requiredRole: 'ADMIN' },
    children: [
      { path: 'dashboard', component: DashboardComponent },

      { path: 'projects', component: ProjectsComponent },
    ],
  },

  { path: 'about', component: AboutComponent },
];
