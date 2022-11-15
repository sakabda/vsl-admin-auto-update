import { Component, OnInit } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { HttpRequestService, LocalStorageService } from 'src/app/core/services';

@Component({
  selector: 'app-noon-reports',
  templateUrl: './noon-reports.component.html',
  styleUrls: ['./noon-reports.component.scss'],
})
export class NoonReportsComponent implements OnInit {
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
    this.searchBranch.pipe(debounceTime(1000)).subscribe((success: any) => {
      this.search = success;
      this.getAllReports();
    });
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
    this.httpRequestService.request('get', 'main-reports', params).subscribe(
      (result) => {
        console.log(result.data);
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

  // seach branch
  searchBranches(event: any): void {
    this.searchBranch.next(event);
  }
}
