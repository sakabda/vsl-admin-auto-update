import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { HttpRequestService, LocalStorageService } from 'src/app/core/services';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  dashboardData: any = {};
  constructor(
    private httpRequestService: HttpRequestService,
    private localStorageService: LocalStorageService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const user = this.localStorageService.getItem('user');
    console.log(`user${user}`);
    if (user.role === 'content-writer') {
      this.router.navigateByUrl('main/questions');
    } else {
      //this.getAllGistData();
    }
  }

  getAllGistData(): void {
    this.httpRequestService.request('get', 'dashboard').subscribe(
      (values) => {
        this.dashboardData = values.data;
      },
      (err) => {}
    );
  }
}
