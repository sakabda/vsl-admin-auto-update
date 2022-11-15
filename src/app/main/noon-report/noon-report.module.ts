import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { HttpClientModule } from '@angular/common/http';

import { NoonReportRoutingModule } from './noon-report-routing.module';
import { AddUpdateNoonReportComponent } from './add-update-noon-report/add-update-noon-report.component';
import { NoonReportsComponent } from './noon-reports/noon-reports.component';

@NgModule({
  declarations: [AddUpdateNoonReportComponent, NoonReportsComponent],
  imports: [
    CommonModule,
    NoonReportRoutingModule,
    SharedModule,
    HttpClientModule,
  ],
})
export class NoonReportModule {}
