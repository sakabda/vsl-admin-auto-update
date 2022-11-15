import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ExtraordinaryReportRoutingModule } from './extraordinary-report-routing.module';
import { AddUpdateExtraordinaryReportComponent } from './add-update-extraordinary-report/add-update-extraordinary-report.component';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [AddUpdateExtraordinaryReportComponent],
  imports: [CommonModule, ExtraordinaryReportRoutingModule, SharedModule],
})
export class ExtraordinaryReportModule {}
