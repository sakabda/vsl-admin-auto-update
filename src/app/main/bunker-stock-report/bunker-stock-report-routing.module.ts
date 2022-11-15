import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddUpdateBunkeringReportComponent } from './add-update-bunkering-report/add-update-bunkering-report.component';
import { AddUpdateRobReportComponent } from './add-update-rob-report/add-update-rob-report.component';
import { BunkerHistoryComponent } from './bunker-history/bunker-history.component';
import { BunkerStockReportingDashboardComponent } from './bunker-stock-reporting-dashboard/bunker-stock-reporting-dashboard.component';
import { BunkeringReportsComponent } from './bunkering-reports/bunkering-reports.component';
import { RobReportComponent } from './rob-report/rob-report.component';

const routes: Routes = [
  {
    path: '',
    component: BunkerStockReportingDashboardComponent,
  },
  {
    path: 'dashboard',
    component: BunkerStockReportingDashboardComponent,
  },
  {
    path: 'bunker-report',
    component: BunkeringReportsComponent,
  },
  {
    path: 'bunker-report/add',
    component: AddUpdateBunkeringReportComponent,
  },
  {
    path: 'bunker-report/update/:id',
    component: AddUpdateBunkeringReportComponent,
  },
  {
    path: 'bunker-stock',
    component: BunkerHistoryComponent,
  },
  {
    path: 'rob-report',
    component: RobReportComponent,
  },
  {
    path: 'rob-report/add',
    component: AddUpdateRobReportComponent,
  },
  {
    path: 'rob-report/update/:id',
    component: AddUpdateRobReportComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BunkerStockReportRoutingModule {}
