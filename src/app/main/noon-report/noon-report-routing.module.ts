import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddUpdateNoonReportComponent } from './add-update-noon-report/add-update-noon-report.component';
import { NoonReportsComponent } from './noon-reports/noon-reports.component';

const routes: Routes = [
  {
    path: '',
    component: NoonReportsComponent,
  },
  {
    path: 'add',
    component: AddUpdateNoonReportComponent,
  },
  {
    path: 'update/:id',
    component: AddUpdateNoonReportComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NoonReportRoutingModule {}
