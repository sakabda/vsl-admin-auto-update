import { Component, OnInit } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { HttpRequestService, LocalStorageService } from 'src/app/core/services';

@Component({
  selector: 'app-bunker-history',
  templateUrl: './bunker-history.component.html',
  styleUrls: ['./bunker-history.component.scss'],
})
export class BunkerHistoryComponent implements OnInit {
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
  isUser: any;
  db: any;
  data: any[] = [];

  constructor(
    private httpRequestService: HttpRequestService,
    private notificationService: NzNotificationService,

    private localStorageService: LocalStorageService
  ) {
    // const PouchDB = require('pouchdb').default;
    // this.db = new PouchDB('vessel_report', { size: 50 });
    // this.db.info().then(function (info: any) {
    //   console.log('db', info);
    // });
    //this.user = this.localStorageService.getItem('user');
    this.localUser = localStorageService.getItem('user');
    //console.log('local', this.localUser);
    this.isAdmin = this.localUser.role === 'admin';
    this.isUser = this.localUser.role === 'user';
  }

  ngOnInit(): void {
    this.getAllReports();
    //this.offlineAllReports();
  }
  offlineAllReports(): void {
    this.getAllDocs();
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

  cancel(): void {}

  confirm(id: string): void {
    this.httpRequestService
      .request('delete', `bunker-reports/${id}`)
      .subscribe((result: any) => {
        this.notificationService.success('', 'Deleted Successfully');
        this.getAllReports();
      });
  }
}
