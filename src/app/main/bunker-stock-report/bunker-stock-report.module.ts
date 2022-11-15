import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BunkerStockReportRoutingModule } from './bunker-stock-report-routing.module';
import { AddUpdateBunkeringReportComponent } from './add-update-bunkering-report/add-update-bunkering-report.component';
import { BunkeringReportsComponent } from './bunkering-reports/bunkering-reports.component';
import { BunkerStockReportingDashboardComponent } from './bunker-stock-reporting-dashboard/bunker-stock-reporting-dashboard.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { BunkerHistoryComponent } from './bunker-history/bunker-history.component';
import { RobReportComponent } from './rob-report/rob-report.component';
import { EmailDetailsComponent } from './email-details/email-details.component';
import { AddUpdateRobReportComponent } from './add-update-rob-report/add-update-rob-report.component';

@NgModule({
  declarations: [
    AddUpdateBunkeringReportComponent,
    BunkeringReportsComponent,
    BunkerStockReportingDashboardComponent,
    BunkerHistoryComponent,
    RobReportComponent,
    EmailDetailsComponent,
    AddUpdateRobReportComponent,
  ],
  imports: [CommonModule, BunkerStockReportRoutingModule, SharedModule],
})
export class BunkerStockReportModule {}
