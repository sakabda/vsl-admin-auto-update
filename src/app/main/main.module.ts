import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainRoutingModule } from './main-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';

import { SharedModule } from '../shared/shared.module';
import { VesselLogsComponent } from './vessel-logs/vessel-logs.component';
import { AddUpdateVesselLogComponent } from './add-update-vessel-log/add-update-vessel-log.component';

// import { NzModalRef } from 'ng-zorro-antd/modal';

@NgModule({
  declarations: [DashboardComponent, VesselLogsComponent, AddUpdateVesselLogComponent],
  imports: [CommonModule, MainRoutingModule, SharedModule],
})
export class MainModule {}
