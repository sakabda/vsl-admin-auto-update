import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddUpdateAuxEngPerformanceReportComponent } from './add-update-aux-eng-performance-report/add-update-aux-eng-performance-report.component';
import { AddUpdateMainEngPerformanceReportComponent } from './add-update-main-eng-performance-report/add-update-main-eng-performance-report.component';
import { AuxEngPerformanceReportsComponent } from './aux-eng-performance-reports/aux-eng-performance-reports.component';
import { MainEngPerformanceReportsComponent } from './main-eng-performance-reports/main-eng-performance-reports.component';
import { PerformanceReportDashboardComponent } from './performance-report-dashboard/performance-report-dashboard.component';

const routes: Routes = [
  {
    path: '',
    component: PerformanceReportDashboardComponent,
  },
  {
    path: 'dashboard',
    component: PerformanceReportDashboardComponent,
  },
  {
    path: 'main-engine-performance-reports',
    component: MainEngPerformanceReportsComponent,
  },
  {
    path: 'main-engine-performance-reports/add',
    component: AddUpdateMainEngPerformanceReportComponent,
  },
  {
    path: 'main-engine-performance-reports/update/:id',
    component: AddUpdateMainEngPerformanceReportComponent,
  },
  {
    path: 'aux-engine-performance-reports',
    component: AuxEngPerformanceReportsComponent,
  },
  {
    path: 'aux-engine-performance-reports/add',
    component: AddUpdateAuxEngPerformanceReportComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PerformanceReportRoutingModule {}
