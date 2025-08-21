import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { adminGuard } from './core/guards/admin.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { 
    path: 'home', 
    loadComponent: () => import('./features/homepage/homepage').then(m => m.Homepage),
    canActivate: [authGuard]
  },
  { 
    path: 'admin', 
    loadComponent: () => import('./features/admin/admin').then(m => m.Admin),
    canActivate: [authGuard, adminGuard]
  },
  { 
    path: 'login', 
    loadComponent: () => import('./features/auth/login/login').then(m => m.Login)
  },
  { path: '**', redirectTo: '/home' }
];
