import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddUpdateEngineReportComponent } from './add-update-engine-report/add-update-engine-report.component';
import { EngineReportsComponent } from './engine-reports/engine-reports.component';

const routes: Routes = [
  {
    path: '',
    component: EngineReportsComponent,
  },
  {
    path: 'add',
    component: AddUpdateEngineReportComponent,
  },
  {
    path: 'update/:id',
    component: AddUpdateEngineReportComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EngineReportRoutingModule {}
