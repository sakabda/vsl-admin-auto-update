import { Component, OnInit } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { HttpRequestService, LocalStorageService } from 'src/app/core/services';

@Component({
  selector: 'app-aux-eng-performance-reports',
  templateUrl: './aux-eng-performance-reports.component.html',
  styleUrls: ['./aux-eng-performance-reports.component.scss'],
})
export class AuxEngPerformanceReportsComponent implements OnInit {
  allReports: any[] = [];
  totalDataCount = 0;
  pageSize = 10;
  pageIndex = 1;
  loading = false;
  searchBranch: Subject<any> = new Subject<any>();
  search = '';
  sortDirections = ['ascend', 'descend', null];
  // sortOrder: null;
  checkAddPermission = false;
  checkUpdatePermission = false;
  user: any = {};
  constructor(
    private httpRequestService: HttpRequestService,
    private notificationService: NzNotificationService,

    private localStorageService: LocalStorageService
  ) {
    this.user = this.localStorageService.getItem('user');
  }

  ngOnInit(): void {
    this.allReports = [
      {
        eqipment: 'Aux. engine',
        manufacturer: 'Sulzer 10RTA 96C-B',
        runningHrs: '51,000 hrs',
        date: '22-Dec-2021',
      },
      {
        eqipment: 'Aux. engine',
        manufacturer: 'Sulzer 10RTA 96C-B',
        runningHrs: '48,500 hrs',
        date: '21-Nov-2021',
      },
      {
        eqipment: 'Aux. engine',
        manufacturer: 'Sulzer 10RTA 96C-B',
        runningHrs: '45,010 hrs',
        date: '23-Oct-2021',
      },
      {
        eqipment: 'Main engine',
        manufacturer: 'Sulzer 10RTA 96C-B',
        runningHrs: '51000 hrs',
        date: '12-Sep-2021',
      },
    ];
  }
}
