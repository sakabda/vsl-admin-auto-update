import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';

import { Component, OnInit } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzDrawerService } from 'ng-zorro-antd/drawer';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { ConnectionService } from 'ng-connection-service';
import { Router } from '@angular/router';
import {
  ConfigurationService,
  HttpRequestService,
  LocalStorageService,
} from 'src/app/core/services';
import { DatePipe } from '@angular/common';

(<any>pdfMake).vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'app-rob-report',
  templateUrl: './rob-report.component.html',
  styleUrls: ['./rob-report.component.scss'],
})
export class RobReportComponent implements OnInit {
  [x: string]: any;
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
  head = [['LOCATION', 'FUEL GRADE', 'SULPHUR %', 'QUANTITY', 'DATE']];
  pdfArray: any;
  emailInfo: any;
  visible = false;
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
    private localStorageService: LocalStorageService,
    private datepipe: DatePipe,
    private drawerService: NzDrawerService,
    private connectionService: ConnectionService,
    private configurationService: ConfigurationService,
    private router: Router
  ) {
    //this.user = this.localStorageService.getItem('user');
    this.localUser = this.localStorageService.getItem('user');
    //console.log('local', this.localUser);
    this.isAdmin = this.localUser.Role === 'admin';
  }

  ngOnInit(): void {
    this.connectionService.monitor().subscribe((isConnected: any) => {
      this.isConnected = isConnected;
      if (this.isConnected) {
        this.noInternetConnection = false;
        this.isOffline = 'false';
        console.log(' up onlineeeeeeeeee');
        this.router.navigateByUrl('/main/bunker-stock-report/rob-report');
        console.log('back to online rob report');
      }
      if (!this.isConnected) {
        console.log(' up oflineeeeeeeeee');
        this.noInternetConnection = true;
        this.isOffline = 'true';
        this.router.navigateByUrl('/main/bunker-stock-report/rob-report');
        console.log('back to offline rob report');
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
    //this.search = success;
    this.getAllReports();
    this.serverBaseUrl = this.configurationService.apiUrl;
    this.apiPdfUrl = '/api/rob-reports/pdf-export/';
    this.userToken = this.localStorageService.getItem('token', false);
  }
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
    this.httpRequestService.request('get', 'rob-reports', params).subscribe(
      (result) => {
        console.log(result);
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

  /* delete*/
  delete(id: string): void {
    this.httpRequestService
      .request('delete', `rob-reports/${id}`)
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
  //     }/api/rob-reports/pdf-export/${id}?token=${this.localStorageService.getItem(
  //       'token',
  //       false
  //     )}&timezone=${this.timeZone}`,
  //     '_self'
  //   );
  // }
}
