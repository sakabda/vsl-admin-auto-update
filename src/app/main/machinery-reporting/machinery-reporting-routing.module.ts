import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddUpdateDailyReportAtAnchorageComponent } from './add-update-daily-report-at-anchorage/add-update-daily-report-at-anchorage.component';
import { AddUpdateDailyReportAtPortComponent } from './add-update-daily-report-at-port/add-update-daily-report-at-port.component';
import { AddUpdateDailyReportAtSeaComponent } from './add-update-daily-report-at-sea/add-update-daily-report-at-sea.component';
import { AddUpdateDailyReportDriftingComponent } from './add-update-daily-report-drifting/add-update-daily-report-drifting.component';
import { AddUpdateDailyReportFuelChangeoverComponent } from './add-update-daily-report-fuel-changeover/add-update-daily-report-fuel-changeover.component';
import { AddUpdateDailyReportManoeArrivalComponent } from './add-update-daily-report-manoe-arrival/add-update-daily-report-manoe-arrival.component';
import { AddUpdateDailyReportManoeDepartureComponent } from './add-update-daily-report-manoe-departure/add-update-daily-report-manoe-departure.component';
import { AddUpdateDailyReportComponent } from './add-update-daily-report/add-update-daily-report.component';
import { AddUpdateManoeuvringComponent } from './add-update-manoeuvring/add-update-manoeuvring.component';
import { AnnuallyReportsComponent } from './annually-reports/annually-reports.component';
import { DailyReportAtAnchorageComponent } from './daily-report-at-anchorage/daily-report-at-anchorage.component';
import { DailyReportAtPortComponent } from './daily-report-at-port/daily-report-at-port.component';
import { DailyReportAtSeaComponent } from './daily-report-at-sea/daily-report-at-sea.component';
import { DailyReportDashboardComponent } from './daily-report-dashboard/daily-report-dashboard.component';
import { DailyReportDriftingComponent } from './daily-report-drifting/daily-report-drifting.component';
import { DailyReportFuelChangeoverComponent } from './daily-report-fuel-changeover/daily-report-fuel-changeover.component';
import { DailyReportManoeArrivalComponent } from './daily-report-manoe-arrival/daily-report-manoe-arrival.component';
import { DailyReportManoeDepartureComponent } from './daily-report-manoe-departure/daily-report-manoe-departure.component';
import { DailyReportsComponent } from './daily-reports/daily-reports.component';
import { HalfYearlyReportsComponent } from './half-yearly-reports/half-yearly-reports.component';
import { MachineryReportingDashboardComponent } from './machinery-reporting-dashboard/machinery-reporting-dashboard.component';
import { MonthlyReportComponent } from './monthly-report/monthly-report.component';
import { ScavengerReportComponent } from './monthly-report/scavenger-report/scavenger-report.component';
import { WeeklyReportsComponent } from './weekly-reports/weekly-reports.component';

const routes: Routes = [
  {
    path: '',
    component: MachineryReportingDashboardComponent,
  },
  {
    path: 'dashboard',
    component: MachineryReportingDashboardComponent,
  },
  {
    path: 'daily-report',
    component: DailyReportsComponent,
  },
  {
    path: 'daily-report-dashboard',
    component: DailyReportDashboardComponent,
  },
  // {
  //   path: 'daily-report/add',
  //   component: AddUpdateDailyReportComponent,
  // },
  {
    path: 'daily-report-at-sea',
    component: DailyReportAtSeaComponent,
  },
  {
    path: 'daily-report-at-sea/add',
    component: AddUpdateDailyReportAtSeaComponent,
  },
  {
    path: 'daily-report-at-sea/update/:id',
    component: AddUpdateDailyReportAtSeaComponent,
  },
  {
    path: 'daily-report-fuel-changeover',
    component: DailyReportFuelChangeoverComponent,
  },
  {
    path: 'daily-report-fuel-changeover/add',
    component: AddUpdateDailyReportFuelChangeoverComponent,
  },
  {
    path: 'daily-report-fuel-changeover/update/:id',
    component: AddUpdateDailyReportFuelChangeoverComponent,
  },
  {
    path: 'daily-report-at-port',
    component: DailyReportAtPortComponent,
  },
  {
    path: 'daily-report-at-port/add',
    component: AddUpdateDailyReportAtPortComponent,
  },
  {
    path: 'daily-report-at-port/update/:id',
    component: AddUpdateDailyReportAtPortComponent,
  },
  {
    path: 'daily-report-at-anchorage',
    component: DailyReportAtAnchorageComponent,
  },
  {
    path: 'daily-report-at-anchorage/add',
    component: AddUpdateDailyReportAtAnchorageComponent,
  },
  {
    path: 'daily-report-at-anchorage/update/:id',
    component: AddUpdateDailyReportAtAnchorageComponent,
  },
  {
    path: 'daily-report-drifting',
    component: DailyReportDriftingComponent,
  },
  {
    path: 'daily-report-drifting/add',
    component: AddUpdateDailyReportDriftingComponent,
  },
  {
    path: 'daily-report-drifting/update/:id',
    component: AddUpdateDailyReportDriftingComponent,
  },
  {
    path: 'daily-report-manoeuvring-arrivals',
    component: DailyReportManoeArrivalComponent,
  },
  {
    path: 'daily-report-manoeuvring-arrivals/add',
    component: AddUpdateDailyReportManoeArrivalComponent,
  },
  {
    path: 'daily-report-manoeuvring-arrivals/update/:id',
    component: AddUpdateDailyReportManoeArrivalComponent,
  },
  {
    path: 'daily-report-manoeuvring/add',
    component: AddUpdateManoeuvringComponent,
  },
  {
    path: 'daily-report-manoeuvring/update/:id',
    component: AddUpdateManoeuvringComponent,
  },
  {
    path: 'daily-report-manoeuvring-departure',
    component: DailyReportManoeDepartureComponent,
  },
  {
    path: 'daily-report-manoeuvring-departure/add',
    component: AddUpdateDailyReportManoeDepartureComponent,
  },
  {
    path: 'daily-report-manoeuvring-departure/update/:id',
    component: AddUpdateDailyReportManoeDepartureComponent,
  },

  // {
  //   path: 'daily-report/update/:id',
  //   component: AddUpdateDailyReportComponent,
  // },
  {
    path: 'weekly-report',
    component: WeeklyReportsComponent,
  },
  {
    path: 'monthly-report',
    component: MonthlyReportComponent,
  },
  {
    path: 'scavenger-report',
    component: ScavengerReportComponent,
  },

  {
    path: 'half-yearly-report',
    component: HalfYearlyReportsComponent,
  },
  {
    path: 'annually-report',
    component: AnnuallyReportsComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MachineryReportingRoutingModule {}
