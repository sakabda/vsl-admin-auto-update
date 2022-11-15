import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';

import { Component, OnInit } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzDrawerService } from 'ng-zorro-antd/drawer';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import {
  ConfigurationService,
  HttpRequestService,
  LocalStorageService,
} from 'src/app/core/services';
import { DatePipe } from '@angular/common';

(<any>pdfMake).vfs = pdfFonts.pdfMake.vfs;
import { EmailDetailsComponent } from '../email-details/email-details.component';
import { ConnectionService } from 'ng-connection-service';
import { promise } from 'protractor';
import { Router } from '@angular/router';
import { LogService } from 'src/app/core/services/log.service';
// import { Globals } from 'src/globals';
import log from 'electron-log';

@Component({
  selector: 'app-bunkering-reports',
  templateUrl: './bunkering-reports.component.html',
  styleUrls: ['./bunkering-reports.component.scss'],
})
export class BunkeringReportsComponent implements OnInit {
  // private elog: typeof log;
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
  isConnected = true;
  noInternetConnection!: boolean;
  isOffline = 'false';
  db: any;
  allLocalReports: any[] = [];
  data: any[] = [];

  pdfUrl: any;

  timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  serverBaseUrl: any;
  apiPdfUrl: any;
  userToken: any;

  constructor(
    private httpRequestService: HttpRequestService,
    private notificationService: NzNotificationService,
    private localStorageService: LocalStorageService,
    private datepipe: DatePipe,
    private router: Router,
    private drawerService: NzDrawerService,
    private connectionService: ConnectionService,
    private configurationService: ConfigurationService
  ) {
    // const PouchDB = require('pouchdb').default;
    // this.db = new PouchDB('vessel_report', { size: 50 });
    // this.db.info().then(function (info: any) {
    //   console.log('db', info);
    // });
    this.localUser = this.localStorageService.getItem('user');
    //console.log('local', this.localUser);
    this.isAdmin = this.localUser.Role === 'admin';
    // this.elog = window.require('electron-log');
    // this.elog.info('Hello, log');
  }

  ngOnInit(): void {
    this.connectionService.monitor().subscribe((isConnected: any) => {
      this.isConnected = isConnected;
      if (this.isConnected) {
        this.noInternetConnection = false;
        this.isOffline = 'false';
        console.log(' up onlineeeeeeeeee');
        this.router.navigateByUrl('/main/bunker-stock-report/bunker-report');
        console.log('back to online bunker report');
      }
      if (!this.isConnected) {
        console.log(' up oflineeeeeeeeee');
        this.noInternetConnection = true;
        this.isOffline = 'true';
        this.router.navigateByUrl('/main/bunker-stock-report/bunker-report');
        console.log('back to offline bunker report');
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
    //this.offlineAllReports();
    this.serverBaseUrl = this.configurationService.apiUrl;
    this.apiPdfUrl = '/api/bunker-reports/pdf-export/';
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
    this.httpRequestService.request('get', 'bunker-reports', params).subscribe(
      (result) => {
        console.log('off response', result);
        this.loading = false;
        this.allReports = result.data;
        this.totalDataCount = result.totalCount;
      },
      (err) => {
        this.loading = false;
        this.isOffline = 'true';
        this.noInternetConnection = true;
        console.log('in off', err);
        //this.offlineAllReports();
      }
    );
  }
  offlineAllReports(): void {
    this.getAllDocs();
  }
  offlineDelete(id: any): void {
    this.removeDoc(id);
  }

  async getAllDocs(): Promise<void> {
    try {
      const result = await this.db.allDocs({
        include_docs: true,
        attachments: true,
      });
      if (result) {
        let reports = result.rows;

        for (let item of reports) {
          this.data.push(item.doc);
        }
        this.allReports = this.data;

        JSON.parse(JSON.stringify(this.allReports));
        console.log('loop', this.allReports);
      }
    } catch (err) {
      console.log(err);
    }
  }

  async removeDoc(id: any): Promise<void> {
    try {
      const doc = await this.db.get(id);
      const response = await this.db.remove(doc);
      this.notificationService.success('', 'Deleted Successfully');
      this.router.navigateByUrl('/main/bunker-stock-report/bunker-stock');
    } catch (err) {
      console.log(err);
    }
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

  cancel(): void {}

  confirm(): void {
    //this.notificationService.info('click confirm');
  }

  // create pdf and download
  createPdf(id: any): void {
    const pdfUrl = `${
      this.configurationService.apiUrl
    }/api/bunker-reports/pdf-export/${id}?token=${this.localStorageService.getItem(
      'token',
      false
    )}&timezone=${this.timeZone}`;
    console.log('pdf url', pdfUrl);
    // window.open(
    //   `${
    //     this.configurationService.apiUrl
    //   }/api/bunker-reports/pdf-export/${id}?token=${this.localStorageService.getItem(
    //     'token',
    //     false
    //   )}&timezone=${this.timeZone}`,
    //   '_self'
    // );
  }

  // view email details
  viewEmailDetails(data: any): void {
    this.emailInfo = data;

    const drawerRef = this.drawerService.create({
      nzTitle: `Send Email`,
      nzContent: EmailDetailsComponent,
      nzWidth: 1200,
      nzContentParams: {
        bunkerStockData: this.emailInfo,
      },
    });
  }

  close(): void {
    this.visible = false;
  }
  /* delete*/
  delete(id: string): void {
    this.httpRequestService
      .request('delete', `bunker-reports/${id}`)
      .subscribe((result: any) => {
        this.notificationService.success('', 'Deleted Successfully');
        this.getAllReports();
      });
  }
}
