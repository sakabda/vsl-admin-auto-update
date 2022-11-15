import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddUpdateEventsReportComponent } from './add-update-events-report/add-update-events-report.component';

const routes: Routes = [
  {
    path: '',
    component: AddUpdateEventsReportComponent,
  },
  {
    path: 'add',
    component: AddUpdateEventsReportComponent,
  },
  {
    path: 'update/:id',
    component: AddUpdateEventsReportComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EventsReportRoutingModule {}
