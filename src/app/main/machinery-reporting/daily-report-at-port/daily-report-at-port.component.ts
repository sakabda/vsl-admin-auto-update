import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import {
  ConfigurationService,
  HttpRequestService,
  LocalStorageService,
} from 'src/app/core/services';

@Component({
  selector: 'app-daily-report-at-port',
  templateUrl: './daily-report-at-port.component.html',
  styleUrls: ['./daily-report-at-port.component.scss'],
})
export class DailyReportAtPortComponent implements OnInit {
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

  constructor(
    private httpRequestService: HttpRequestService,
    private notificationService: NzNotificationService,
    private localStorageService: LocalStorageService,
    private datepipe: DatePipe,
    private configurationService: ConfigurationService
  ) {
    //this.user = this.localStorageService.getItem('user');
    this.localUser = this.localStorageService.getItem('user');
    console.log('local', this.localUser);
    this.isAdmin = this.localUser.Role === 'admin';
  }

  ngOnInit(): void {
    this.getAllReports();
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
      .request('get', 'daily-report-at-ports', params)
      .subscribe(
        (result) => {
          console.log(result);
          this.loading = false;
          this.allReports = result.data;
          this.totalDataCount = result.totalCount;
        },
        (err) => {
          this.loading = false;
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
      .request('delete', `daily-report-at-ports/${id}`)
      .subscribe((result: any) => {
        this.notificationService.success('', 'Deleted Successfully');
        this.getAllReports();
      });
  }

  // create pdf and download
  createPdf(id: any): void {
    console.log('id', id);
    window.open(
      `${
        this.configurationService.apiUrl
      }/api/daily-report-at-ports/${id}?token=${this.localStorageService.getItem(
        'token',
        false
      )}`,
      '_blank'
    );
  }
}
