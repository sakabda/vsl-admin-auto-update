import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthRevGuard } from './core/guards/auth-rev.guard';
import { AuthGuard } from './core/guards/auth.guard';
import { NoSidebarLayoutComponent } from './layout/no-sidebar-layout/no-sidebar-layout.component';
import { SidebarLayoutComponent } from './layout/sidebar-layout/sidebar-layout.component';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'main',
  },
  {
    path: 'main',
    canActivate: [AuthGuard],
    component: SidebarLayoutComponent,
    loadChildren: () => import('./main/main.module').then((m) => m.MainModule),
  },
  {
    path: 'auth',
    canActivate: [AuthRevGuard],
    component: NoSidebarLayoutComponent,
    loadChildren: () => import('./auth/auth.module').then((m) => m.AuthModule),
  },

  // {
  //   path: '**',
  //   component: NotFoundComponent,
  // },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
