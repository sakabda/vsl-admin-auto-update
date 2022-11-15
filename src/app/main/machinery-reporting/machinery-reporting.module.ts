import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MachineryReportingRoutingModule } from './machinery-reporting-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { MachineryReportingDashboardComponent } from './machinery-reporting-dashboard/machinery-reporting-dashboard.component';
import { DailyReportsComponent } from './daily-reports/daily-reports.component';
import { WeeklyReportsComponent } from './weekly-reports/weekly-reports.component';
import { HalfYearlyReportsComponent } from './half-yearly-reports/half-yearly-reports.component';
import { AnnuallyReportsComponent } from './annually-reports/annually-reports.component';
import { MonthlyReportComponent } from './monthly-report/monthly-report.component';
import { AddUpdateDailyReportComponent } from './add-update-daily-report/add-update-daily-report.component';
import { AddUpdateDailyReportAtSeaComponent } from './add-update-daily-report-at-sea/add-update-daily-report-at-sea.component';
import { DailyReportAtSeaComponent } from './daily-report-at-sea/daily-report-at-sea.component';
import { DailyReportFuelChangeoverComponent } from './daily-report-fuel-changeover/daily-report-fuel-changeover.component';
import { AddUpdateDailyReportFuelChangeoverComponent } from './add-update-daily-report-fuel-changeover/add-update-daily-report-fuel-changeover.component';
import { DailyReportAtPortComponent } from './daily-report-at-port/daily-report-at-port.component';
import { AddUpdateDailyReportAtPortComponent } from './add-update-daily-report-at-port/add-update-daily-report-at-port.component';
import { DailyReportAtAnchorageComponent } from './daily-report-at-anchorage/daily-report-at-anchorage.component';
import { AddUpdateDailyReportAtAnchorageComponent } from './add-update-daily-report-at-anchorage/add-update-daily-report-at-anchorage.component';
import { DailyReportDriftingComponent } from './daily-report-drifting/daily-report-drifting.component';
import { AddUpdateDailyReportDriftingComponent } from './add-update-daily-report-drifting/add-update-daily-report-drifting.component';
import { DailyReportManoeArrivalComponent } from './daily-report-manoe-arrival/daily-report-manoe-arrival.component';
import { AddUpdateDailyReportManoeArrivalComponent } from './add-update-daily-report-manoe-arrival/add-update-daily-report-manoe-arrival.component';
import { DailyReportManoeDepartureComponent } from './daily-report-manoe-departure/daily-report-manoe-departure.component';
import { AddUpdateDailyReportManoeDepartureComponent } from './add-update-daily-report-manoe-departure/add-update-daily-report-manoe-departure.component';
import { DailyReportDashboardComponent } from './daily-report-dashboard/daily-report-dashboard.component';
import { ScavengerReportComponent } from './monthly-report/scavenger-report/scavenger-report.component';
import { AddUpdateManoeuvringComponent } from './add-update-manoeuvring/add-update-manoeuvring.component';

@NgModule({
  declarations: [
    MachineryReportingDashboardComponent,
    DailyReportsComponent,
    WeeklyReportsComponent,
    HalfYearlyReportsComponent,
    AnnuallyReportsComponent,
    MonthlyReportComponent,
    AddUpdateDailyReportComponent,
    AddUpdateDailyReportAtSeaComponent,
    DailyReportAtSeaComponent,
    DailyReportFuelChangeoverComponent,
    AddUpdateDailyReportFuelChangeoverComponent,
    DailyReportAtPortComponent,
    AddUpdateDailyReportAtPortComponent,
    DailyReportAtAnchorageComponent,
    AddUpdateDailyReportAtAnchorageComponent,
    DailyReportDriftingComponent,
    AddUpdateDailyReportDriftingComponent,
    DailyReportManoeArrivalComponent,
    AddUpdateDailyReportManoeArrivalComponent,
    DailyReportManoeDepartureComponent,
    AddUpdateDailyReportManoeDepartureComponent,
    DailyReportDashboardComponent,
    ScavengerReportComponent,
    AddUpdateManoeuvringComponent
  ],
  imports: [CommonModule, MachineryReportingRoutingModule, SharedModule],
})
export class MachineryReportingModule {}
