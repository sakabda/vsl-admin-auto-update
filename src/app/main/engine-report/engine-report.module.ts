import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EngineReportRoutingModule } from './engine-report-routing.module';
import { AddUpdateEngineReportComponent } from './add-update-engine-report/add-update-engine-report.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { EngineReportsComponent } from './engine-reports/engine-reports.component';

@NgModule({
  declarations: [AddUpdateEngineReportComponent, EngineReportsComponent],
  imports: [CommonModule, EngineReportRoutingModule, SharedModule],
})
export class EngineReportModule {}
