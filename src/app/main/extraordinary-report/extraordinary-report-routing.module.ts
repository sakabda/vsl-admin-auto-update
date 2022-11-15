import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddUpdateExtraordinaryReportComponent } from './add-update-extraordinary-report/add-update-extraordinary-report.component';

const routes: Routes = [
  {
    path: '',
    component: AddUpdateExtraordinaryReportComponent,
  },
  {
    path: 'add',
    component: AddUpdateExtraordinaryReportComponent,
  },
  {
    path: 'update/:id',
    component: AddUpdateExtraordinaryReportComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ExtraordinaryReportRoutingModule {}
