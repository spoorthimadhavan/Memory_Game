// LOCAL ONLY — paste into frontend/src/app/admin.routes.ts (do not commit filled version)

import { Routes } from '@angular/router';

import { adminAuthGuard } from './core/guards/admin-auth.guard';
import { AdminLayoutComponent } from './features/admin/admin-layout.component';
import { AdminLoginPageComponent } from './features/admin/admin-login-page.component';
import { AdminForgotPasswordPageComponent } from './features/admin/admin-forgot-password-page.component';
import { AdminResetPasswordPageComponent } from './features/admin/admin-reset-password-page.component';
import { AdminContactsPageComponent } from './features/admin/admin-contacts-page.component';
import { AdminSuggestionsPageComponent } from './features/admin/admin-suggestions-page.component';

export const ADMIN_ROUTES: Routes = [
  { path: 'admin/login', component: AdminLoginPageComponent },
  { path: 'admin/forgot-password', component: AdminForgotPasswordPageComponent },
  { path: 'admin/reset-password', component: AdminResetPasswordPageComponent },
  {
    path: 'admin',
    component: AdminLayoutComponent,
    canActivate: [adminAuthGuard],
    children: [
      { path: '', redirectTo: 'contacts', pathMatch: 'full' },
      { path: 'contacts', component: AdminContactsPageComponent },
      { path: 'suggestions', component: AdminSuggestionsPageComponent },
    ],
  },
];
