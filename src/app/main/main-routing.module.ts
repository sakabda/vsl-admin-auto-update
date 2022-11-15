import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../core/guards/auth.guard';
import { AddUpdateVesselLogComponent } from './add-update-vessel-log/add-update-vessel-log.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { VesselLogsComponent } from './vessel-logs/vessel-logs.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full',
  },
  {
    path: 'dashboard',
    // canActivate: [AuthGuard],
    component: DashboardComponent,
  },
  {
    path: 'machinery-report',
    canActivate: [AuthGuard],
    loadChildren: () =>
      import('./machinery-reporting/machinery-reporting.module').then(
        (m) => m.MachineryReportingModule
      ),
  },
  {
    path: 'bunker-stock-report',
    canActivate: [AuthGuard],
    loadChildren: () =>
      import('./bunker-stock-report/bunker-stock-report.module').then(
        (m) => m.BunkerStockReportModule
      ),
  },
  {
    path: 'performance-report',
    canActivate: [AuthGuard],
    loadChildren: () =>
      import('./performance-report/performance-report.module').then(
        (m) => m.PerformanceReportModule
      ),
  },
  {
    path: 'alarm-report',
    canActivate: [AuthGuard],
    loadChildren: () =>
      import('./alarm/alarm.module').then((m) => m.AlarmModule),
  },
  {
    path: 'vessel-logs',
    // canActivate: [AuthGuard],
    component: VesselLogsComponent,
  },
  {
    path: 'vessel-logs/add',
    // canActivate: [AuthGuard],
    component: AddUpdateVesselLogComponent,
  },
  {
    path: 'vessel-logs/update/:id',
    // canActivate: [AuthGuard],
    component: AddUpdateVesselLogComponent,
  },

  // {
  //   path: 'vessel-log',
  //   canActivate: [AuthGuard],
  //   loadChildren: () =>
  //     import('./vessel-log/vessel-log.module').then((m) => m.VesselLogModule),
  // },

  // {
  //   path: 'noon-report',
  //   loadChildren: () =>
  //     import('./noon-report/noon-report.module').then(
  //       (m) => m.NoonReportModule
  //     ),
  // },
  // {
  //   path: 'engine-report',
  //   loadChildren: () =>
  //     import('./engine-report/engine-report.module').then(
  //       (m) => m.EngineReportModule
  //     ),
  // },
  // {
  //   path: 'extraordinary-report',
  //   loadChildren: () =>
  //     import('./extraordinary-report/extraordinary-report.module').then(
  //       (m) => m.ExtraordinaryReportModule
  //     ),
  // },
  // {
  //   path: 'bunkerstock-report',
  //   loadChildren: () =>
  //     import('./bunkerstock-report/bunkerstock-report.module').then(
  //       (m) => m.BunkerstockReportModule
  //     ),
  // },
  // {
  //   path: 'events-report',
  //   loadChildren: () =>
  //     import('./events-report/events-report.module').then(
  //       (m) => m.EventsReportModule
  //     ),
  // },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MainRoutingModule {}
