import { Routes } from '@angular/router';

import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [

  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  },

  {
    path: 'login',
    loadComponent: () =>
      import('./features/login/login.component')
        .then(m => m.LoginComponent)
  },

  {
    path: 'register',
    loadComponent: () =>
      import('./features/register/register.component')
        .then(m => m.RegisterComponent)
  },

  {
    path: 'dashboard',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/dashboard/dashboard.component')
        .then(m => m.DashboardComponent)
  },

  {
    path: 'transactions',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/transactions-list/transactions-list.component')
        .then(m => m.TransactionsListComponent)
  },

  {
    path: 'transactions/add',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/transaction-form/transaction-form.component')
        .then(m => m.TransactionFormComponent)
  },

  {
    path: 'transactions/edit/:id',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/transaction-form/transaction-form.component')
        .then(m => m.TransactionFormComponent)
  },

  {
    path: 'profile',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/profile/profile.component')
        .then(m => m.ProfileComponent)
  },

  {
    path: '**',
    redirectTo: 'dashboard'
  }

];