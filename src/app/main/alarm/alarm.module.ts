import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AlarmRoutingModule } from './alarm-routing.module';
import { AddDeleteAlarmComponent } from './add-delete-alarm/add-delete-alarm.component';
import { AlarmListComponent } from './alarm-list/alarm-list.component';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [AddDeleteAlarmComponent, AlarmListComponent],
  imports: [CommonModule, AlarmRoutingModule, SharedModule],
})
export class AlarmModule {}
