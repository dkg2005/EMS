// Routes configuration for the client-side application.
// Beginners: add a route here to map a URL path to a component.
import { Routes } from '@angular/router';
import { AuthGuard } from './auth/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },

  {
    path: 'login',
    loadComponent: () =>
      import('./pages/login/login.component').then((m) => m.LoginComponent),
  },

  {
    path: 'signup',
    loadComponent: () =>
      import('./pages/signUp/signUp.component').then((m) => m.SignupComponent),
  },

  {
    path: 'dashboard',
    loadComponent: () =>
      import('./pages/dashboard/dashboard.component').then(
        (m) => m.DashboardComponent
      ),
    canActivate: [AuthGuard],
  },

  {
    path: 'assets',
    loadComponent: () =>
      import('./pages/asset/asset.component').then((m) => m.AssetComponent),
    canActivate: [AuthGuard]
  },

  {
    path: 'departments',
    loadComponent: () =>
      import('./pages/department/department.component').then(
        (m) => m.DepartmentComponent
      ),
    canActivate: [AuthGuard],
  },

  {
    path: 'employees',
    loadComponent: () =>
      import('./pages/employee/employee.component').then(
        (m) => m.EmployeeComponent
      ),
    canActivate: [AuthGuard],
  },

  {
    path: 'employee-assets',
    loadComponent: () =>
      import('./pages/employeeAsset/employeeAsset.component').then(
        (m) => m.EmployeeAssetComponent
      ),
    canActivate: [AuthGuard],
  },

  {
    path: '**',
    redirectTo: 'login',
    pathMatch: 'full',
  }
];
