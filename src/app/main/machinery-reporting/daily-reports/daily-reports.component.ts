import { DatePipe } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { Subject, Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import {
  ConfigurationService,
  HttpRequestService,
  LocalStorageService,
} from 'src/app/core/services';
import { Router } from '@angular/router';
import { LocalDatabaseService } from 'src/app/core/services/local-database.service';
import { ConnectionService } from 'ng-connection-service';

@Component({
  selector: 'app-daily-reports',
  templateUrl: './daily-reports.component.html',
  styleUrls: ['./daily-reports.component.scss'],
})
export class DailyReportsComponent implements OnInit, OnDestroy {
  allReports: any;
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
  visible = false;
  localUser: any;
  isAdmin: any;
  db: any;
  data: any[] = [];
  timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  serverBaseUrl: any;
  atSeaApiPdfUrl: any;
  fuelChangeOverApiPdfUrl: any;
  atPortApiPdfUrl: any;
  atAnchorageApiPdfUrl: any;
  driftingApiPdfUrl: any;
  manoeuvringApiPdfUrl: any;
  manoeuvringArrivalApiPdfUrl: any;
  manoeuvringDepartureApiPdfUrl: any;
  userToken: any;
  syncSubscription: Subscription;
  isOffline = 'false';
  isConnected = true;
  noInternetConnection!: boolean;

  constructor(
    private httpRequestService: HttpRequestService,
    private notificationService: NzNotificationService,
    private localStorageService: LocalStorageService,
    private datepipe: DatePipe,
    private router: Router,
    private configurationService: ConfigurationService,
    private localDbService: LocalDatabaseService,
    private connectionService: ConnectionService
  ) {
    //this.user = this.localStorageService.getItem('user');
    this.localUser = this.localStorageService.getItem('user');
    console.log('local', this.localUser);
    this.isAdmin = this.localUser.Role === 'admin';
    this.syncSubscription = this.localDbService.$syncSubject.subscribe(() => {
      this.getAllReports();
    });
  }

  ngOnInit(): void {
    this.connectionService.monitor().subscribe((isConnected: any) => {
      this.isConnected = isConnected;
      if (this.isConnected) {
        this.noInternetConnection = false;
        this.isOffline = 'false';
        console.log(' up onlineeeeeeeeee');
        this.router.navigateByUrl('/main/machinery-report/daily-report');
        console.log('back to online daily report');
      }
      if (!this.isConnected) {
        console.log(' up oflineeeeeeeeee');
        this.noInternetConnection = true;
        this.isOffline = 'true';
        this.router.navigateByUrl('/main/machinery-report/daily-report');
        console.log('back to offline daily report');
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
    console.log('at daily report');
    this.getAllReports();
    this.serverBaseUrl = this.configurationService.apiUrl;
    this.atSeaApiPdfUrl = '/api/daily-report-at-seas/pdf-export/';
    this.fuelChangeOverApiPdfUrl =
      '/api/daily-report-fuel-changeovers/pdf-export/';
    this.atPortApiPdfUrl = '/api/daily-report-at-ports/pdf-export/';
    this.atAnchorageApiPdfUrl = '/api/daily-report-at-anchorages/pdf-export/';
    this.driftingApiPdfUrl = '/api/daily-report-at-driftings/pdf-export/';
    this.manoeuvringApiPdfUrl = '/api/daily-report-manoeuvring/pdf-export/';
    this.manoeuvringArrivalApiPdfUrl =
      '/api/daily-report-manoeuvring-arrivals/pdf-export/';
    this.manoeuvringDepartureApiPdfUrl =
      '/api/daily-report-manoeuvring-departures/pdf-export/';
    this.userToken = this.localStorageService.getItem('token', false);
  }
  ngOnDestroy(): void {
    this.syncSubscription.unsubscribe();
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
    this.httpRequestService
      .request('get', 'daily-report-dashboards', params)
      .subscribe(
        (result) => {
          console.log(result);
          this.loading = false;
          this.isOffline = 'false';
          this.noInternetConnection = false;
          this.allReports = result.data;
          this.totalDataCount = result.totalCount;
        },
        (err) => {
          this.loading = false;
          this.isOffline = 'true';
          this.noInternetConnection = true;
          console.log('error dailt reportt', err);
          this.offlineAllReports();
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
  delete(url: any, id: string): void {
    console.log(url, id);
    this.httpRequestService.request('delete', `${url}${id}`).subscribe(
      (result: any) => {
        this.notificationService.success('', 'Deleted Successfully');
        this.getAllReports();
        //window.location.reload();
      },
      (err) => {
        const foundElement = this.allReports.find((x: any) => x._id === id);
        console.log('Delete', foundElement._rev);
        this.localDbService.vesselReportDb.remove(id, foundElement._rev);
        this.getAllReports();
        //window.location.reload();
      }
    );
  }

  onNavigateUrl(url: any, id: any): void {
    this.router.navigateByUrl(url + id);
  }

  offlineAllReports(): void {
    this.getAllDocs();
  }
  offlineDelete(id: any): void {
    this.removeDoc(id);
  }

  async getAllDocs(): Promise<void> {
    try {
      const result = await this.localDbService.getDataByReportType([
        'At Port',
        'At Sea',
        'Fuel Changeover',
        'At Anchorage',
        'Drifting',
        'Manoeuvring Arrival',
        'Manoeuvring Departure',
      ]);
      if (result) {
        let reports = result.docs;

        for (let item of reports) {
          this.data.push(item);
        }
        console.log('before filter', this.data);
        // const res = this.data.filter((obj) => {
        //   obj.Report_Type === 'At Sea' ||
        //     obj.Report_Type === 'Fuel Changeover' ||
        //     obj.Report_Type === 'At Port' ||
        //     obj.Report_Type === 'At Anchorage' ||
        //     obj.Report_Type === 'Drifting';

        // });
        // console.log('filter', res);
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
      await this.db.remove(doc).then(() => {
        this.notificationService.success('', 'Deleted Successfully');
        this.router.navigateByUrl('/main/machinery-report/daily-report');
      });
    } catch (err) {
      console.log(err);
    }
  }

  /* create pdf and download */
  // at sea
  createPdfForAtSea(id: any): void {
    console.log('id', id);
    window.open(
      `${
        this.configurationService.apiUrl
      }/api/daily-report-at-seas/pdf-export/${id}?token=${this.localStorageService.getItem(
        'token',
        false
      )}&timezone=${this.timeZone}`,
      '_self'
    );
  }
  // FuelChangeover
  createPdfForFuelChangeover(id: any): void {
    console.log('id', id);
    window.open(
      `${
        this.configurationService.apiUrl
      }/api/daily-report-fuel-changeovers/pdf-export/${id}?token=${this.localStorageService.getItem(
        'token',
        false
      )}&timezone=${this.timeZone}`,
      '_self'
    );
  }
  // at port
  createPdfForAtPort(id: any): void {
    console.log('id', id);
    window.open(
      `${
        this.configurationService.apiUrl
      }/api/daily-report-at-ports/pdf-export/${id}?token=${this.localStorageService.getItem(
        'token',
        false
      )}&timezone=${this.timeZone}`,
      '_self'
    );
  }
  // At Anchorage
  createPdfForAtAnchorage(id: any): void {
    console.log('id', id);
    window.open(
      `${
        this.configurationService.apiUrl
      }/api/daily-report-at-anchorages/pdf-export/${id}?token=${this.localStorageService.getItem(
        'token',
        false
      )}&timezone=${this.timeZone}`,
      '_self'
    );
  }
  // Drifting
  createPdfForDrifting(id: any): void {
    console.log('id', id);
    window.open(
      `${
        this.configurationService.apiUrl
      }/api/daily-report-at-driftings/pdf-export/${id}?token=${this.localStorageService.getItem(
        'token',
        false
      )}&timezone=${this.timeZone}`,
      '_self'
    );
  }
  // Manoeuvring Arrival
  createPdfForManoeuvringArrival(id: any): void {
    console.log('id', id);
    window.open(
      `${
        this.configurationService.apiUrl
      }/api/daily-report-manoeuvring-arrivals/pdf-export/${id}?token=${this.localStorageService.getItem(
        'token',
        false
      )}&timezone=${this.timeZone}`,
      '_self'
    );
  }
  // Manoeuvring Departure
  createPdfForManoeuvringDeparture(id: any): void {
    console.log('id', id);
    window.open(
      `${
        this.configurationService.apiUrl
      }/api/daily-report-manoeuvring-departures/pdf-export/${id}?token=${this.localStorageService.getItem(
        'token',
        false
      )}&timezone=${this.timeZone}`,
      '_self'
    );
  }
}
