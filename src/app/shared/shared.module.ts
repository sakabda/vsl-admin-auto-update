import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzTypographyModule } from 'ng-zorro-antd/typography';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzPageHeaderModule } from 'ng-zorro-antd/page-header';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';
import { NzStepsModule } from 'ng-zorro-antd/steps';
import { NzAutocompleteModule } from 'ng-zorro-antd/auto-complete';
import { NzCascaderModule } from 'ng-zorro-antd/cascader';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzTimePickerModule } from 'ng-zorro-antd/time-picker';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzUploadModule } from 'ng-zorro-antd/upload';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzBadgeModule } from 'ng-zorro-antd/badge';
import { NzCalendarModule } from 'ng-zorro-antd/calendar';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzCollapseModule } from 'ng-zorro-antd/collapse';
import { NzDescriptionsModule } from 'ng-zorro-antd/descriptions';
import { NzEmptyModule } from 'ng-zorro-antd/empty';
import { NzListModule } from 'ng-zorro-antd/list';
import { NzPopoverModule } from 'ng-zorro-antd/popover';
import { NzStatisticModule } from 'ng-zorro-antd/statistic';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { NzAlertModule } from 'ng-zorro-antd/alert';
import { NzDrawerModule } from 'ng-zorro-antd/drawer';
import { NzMessageModule } from 'ng-zorro-antd/message';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzNotificationModule } from 'ng-zorro-antd/notification';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';
import { NzResultModule } from 'ng-zorro-antd/result';
import { NzSkeletonModule } from 'ng-zorro-antd/skeleton';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzBreadCrumbModule } from 'ng-zorro-antd/breadcrumb';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { NzBackTopModule } from 'ng-zorro-antd/back-top';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { NzRateModule } from 'ng-zorro-antd/rate';
import { CKEditorModule } from 'ng2-ckeditor';
import { NzImageModule } from 'ng-zorro-antd/image';

const imports = [
  FormsModule,
  ReactiveFormsModule,
  NzResultModule,
  NzButtonModule,
  NzIconModule,
  NzTypographyModule,
  NzGridModule,
  NzLayoutModule,
  NzDropDownModule,
  NzBreadCrumbModule,
  NzMenuModule,
  NzPageHeaderModule,
  NzPaginationModule,
  NzStepsModule,
  NzAutocompleteModule,
  NzCascaderModule,
  NzCheckboxModule,
  NzDatePickerModule,
  NzTimePickerModule,
  NzFormModule,
  NzInputModule,
  NzInputNumberModule,
  NzRadioModule,
  NzSelectModule,
  NzUploadModule,
  NzAvatarModule,
  NzBadgeModule,
  NzCalendarModule,
  NzCardModule,
  NzCollapseModule,
  NzDescriptionsModule,
  NzEmptyModule,
  NzListModule,
  NzPopoverModule,
  NzStatisticModule,
  NzTableModule,
  NzTabsModule,
  NzTagModule,
  NzToolTipModule,
  NzAlertModule,
  NzDrawerModule,
  NzMessageModule,
  NzModalModule,
  NzNotificationModule,
  NzPopconfirmModule,
  NzSkeletonModule,
  NzSpinModule,
  NzDividerModule,
  NzSwitchModule,
  NzBackTopModule,
  DragDropModule,
  NzRateModule,
  NzImageModule,
];

// @NgModule({
//   declarations: [DocumentViewModalComponent, FileUploadComponent],

//   imports: [CommonModule, ...imports, CKEditorModule],
//   exports: [...imports, CKEditorModule, FileUploadComponent],
// })
// export class SharedModule {}

@NgModule({
  declarations: [],

  imports: [CommonModule, ...imports, CKEditorModule],
  exports: [...imports, CKEditorModule],
})
export class SharedModule {}
