import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EventsReportRoutingModule } from './events-report-routing.module';
import { AddUpdateEventsReportComponent } from './add-update-events-report/add-update-events-report.component';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [AddUpdateEventsReportComponent],
  imports: [CommonModule, EventsReportRoutingModule, SharedModule],
})
export class EventsReportModule {}
