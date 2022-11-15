import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PerformanceReportRoutingModule } from './performance-report-routing.module';
import { PerformanceReportDashboardComponent } from './performance-report-dashboard/performance-report-dashboard.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { MainEngPerformanceReportsComponent } from './main-eng-performance-reports/main-eng-performance-reports.component';
import { AddUpdateMainEngPerformanceReportComponent } from './add-update-main-eng-performance-report/add-update-main-eng-performance-report.component';
import { AuxEngPerformanceReportsComponent } from './aux-eng-performance-reports/aux-eng-performance-reports.component';
import { AddUpdateAuxEngPerformanceReportComponent } from './add-update-aux-eng-performance-report/add-update-aux-eng-performance-report.component';

@NgModule({
  declarations: [PerformanceReportDashboardComponent, MainEngPerformanceReportsComponent, AddUpdateMainEngPerformanceReportComponent, AuxEngPerformanceReportsComponent, AddUpdateAuxEngPerformanceReportComponent],
  imports: [CommonModule, PerformanceReportRoutingModule, SharedModule],
})
export class PerformanceReportModule {}
