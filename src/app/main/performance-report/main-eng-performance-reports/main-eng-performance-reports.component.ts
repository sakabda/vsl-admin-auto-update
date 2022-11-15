import { Component, OnInit } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzDrawerService } from 'ng-zorro-antd/drawer';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { ConnectionService } from 'ng-connection-service';
import {
  ConfigurationService,
  HttpRequestService,
  LocalStorageService,
} from 'src/app/core/services';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-main-eng-performance-reports',
  templateUrl: './main-eng-performance-reports.component.html',
  styleUrls: ['./main-eng-performance-reports.component.scss'],
})
export class MainEngPerformanceReportsComponent implements OnInit {
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
  localUser: any;
  isAdmin: any;
  timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  serverBaseUrl: any;
  apiPdfUrl: any;
  userToken: any;
  isConnected = true;
  noInternetConnection!: boolean;
  isOffline = 'false';

  constructor(
    private httpRequestService: HttpRequestService,
    private notificationService: NzNotificationService,
    private configurationService: ConfigurationService,
    private localStorageService: LocalStorageService,
    private connectionService: ConnectionService,
    private router: Router
  ) {
    //this.user = this.localStorageService.getItem('user');
    this.localUser = this.localStorageService.getItem('user');
    console.log('local', this.localUser);
    this.isAdmin = this.localUser.Role === 'admin';
  }

  ngOnInit(): void {
    this.connectionService.monitor().subscribe((isConnected: any) => {
      this.isConnected = isConnected;
      if (this.isConnected) {
        this.noInternetConnection = false;
        this.isOffline = 'false';
        console.log(' up onlineeeeeeeeee');
        this.router.navigateByUrl(
          '/main/performance-report/main-engine-performance-reports'
        );
        console.log('back to online main eng report');
      }
      if (!this.isConnected) {
        console.log(' up oflineeeeeeeeee');
        this.noInternetConnection = true;
        this.isOffline = 'true';
        this.router.navigateByUrl(
          '/main/performance-report/main-engine-performance-reports'
        );
        console.log('back to offline main eng report');
      }
      if (navigator.onLine) {
        console.log('onlineeeeeeeeee');
        this.noInternetConnection = false;
      }
      if (!navigator.onLine) {
        console.log('oflineeeeeeeeee');
        this.noInternetConnection = true;
      }
    });
    this.getAllReports();
    this.serverBaseUrl = this.configurationService.apiUrl;
    this.apiPdfUrl = '/api/main-engine-perfomance-reports/pdf-export/';
    this.userToken = this.localStorageService.getItem('token', false);
  }

  /* Get all reports */
  getAllReports(skip = 0, sortBy?: any): void {
    let params: any;
    params = { skip, limit: this.pageSize };
    if (this.search) {
      params.search = this.search;
    }
    if (sortBy) {
      params.sortBy = JSON.stringify(sortBy);
    }
    this.loading = true;
    this.httpRequestService
      .request('get', 'main-engine-perfomance-reports', params)
      .subscribe(
        (result) => {
          console.log(result.data);
          this.loading = false;
          this.allReports = result.data;
          this.totalDataCount = result.totalCount;
        },
        (err) => {
          this.loading = false;
          this.isOffline = 'true';
          this.noInternetConnection = true;
        }
      );
  }

  /* For Pagination / Sending skip */
  onQueryParamsChange(params: NzTableQueryParams): void {
    const { pageSize, pageIndex } = params;
    // let sortBy: any = {};
    // sortBy[sort[0].key] = sort[0].value === 'ascend' ? 1 : -1;

    // if (!sort[0].value) {
    //   sortBy = null;
    // }
    this.getAllReports(pageSize * (pageIndex - 1));
  }

  // seach branch
  searchBranches(event: any): void {
    this.searchBranch.next(event);
  }

  /* delete*/
  delete(id: string): void {
    this.httpRequestService
      .request('delete', `main-engine-perfomance-reports/${id}`)
      .subscribe((result: any) => {
        this.notificationService.success('', 'Deleted Successfully');
        this.getAllReports();
      });
  }

  // create pdf and download
  // createPdf(id: any): void {
  //   window.open(
  //     `${
  //       this.configurationService.apiUrl
  //     }/api/main-engine-perfomance-reports/pdf-export/${id}?token=${this.localStorageService.getItem(
  //       'token',
  //       false
  //     )}&timezone=${this.timeZone}`,
  //     '_self'
  //   );
  // }
}
