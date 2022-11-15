import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddUpdateBunkerstockReportComponent } from './add-update-bunkerstock-report/add-update-bunkerstock-report.component';

const routes: Routes = [
  {
    path: '',
    component: AddUpdateBunkerstockReportComponent,
  },
  {
    path: 'add',
    component: AddUpdateBunkerstockReportComponent,
  },
  {
    path: 'update/:id',
    component: AddUpdateBunkerstockReportComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BunkerstockReportRoutingModule {}
