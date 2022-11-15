import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  AuthService,
  HttpRequestService,
  LocalStorageService,
} from 'src/app/core/services';
import { Router, ActivatedRoute } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  [x: string]: any;
  // @Input() isCollapsed = false;
  notificationSelectedClass = false;
  profileSelectedClass = false;
  currentDateTime = new Date();
  userInfo = [
    // {
    //   title: 'My profile',
    // },
    // {
    //   title: 'Settings',
    // },
    {
      title: 'Logout',
    },
  ];
  shipDetails: any;
  @Input() isCollapsed: boolean = true;
  @Output() isCollapsedChange: EventEmitter<boolean> = new EventEmitter();

  constructor(
    private localStorageService: LocalStorageService,
    private authService: AuthService,
    private httpRequestService: HttpRequestService,
    private notificationService: NzNotificationService,
    private router: Router,
    private activatedRoute: ActivatedRoute // private datepipe: DatePipe
  ) {
    // let currentDateTime = this.datepipe.transform(
    //   new Date(),
    //   'MM/dd/yyyy h:mm:ss'
    // );
    // console.log(currentDateTime);
  }

  ngOnInit(): void {
    this.shipDetails = this.localStorageService.getItem('user');
    console.log('header', this.shipDetails.Ship_Name);
    this.isCollapsed = window.innerWidth < 800;
    this.currentDateTime = this.currentDateTime;
  }
  onChangeCollapse(): void {
    this.isCollapsed = !this.isCollapsed;
    this.isCollapsedChange.emit(this.isCollapsed);
  }

  logout(): void {
    this.httpRequestService
      .request('delete', 'auth/logout')
      .subscribe((success) => {
        this.notificationService.success(
          'Success',
          'You Successfully Logged out'
        );
      });
    this.authService.logout();
  }
}
