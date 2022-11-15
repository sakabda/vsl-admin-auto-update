import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BunkerstockReportRoutingModule } from './bunkerstock-report-routing.module';
import { AddUpdateBunkerstockReportComponent } from './add-update-bunkerstock-report/add-update-bunkerstock-report.component';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [AddUpdateBunkerstockReportComponent],
  imports: [CommonModule, BunkerstockReportRoutingModule, SharedModule],
})
export class BunkerstockReportModule {}
