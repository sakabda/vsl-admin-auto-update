import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ConnectionService } from 'ng-connection-service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzNotificationService } from 'ng-zorro-antd/notification';

import {
  HttpRequestService,
  ConfigurationService,
  LocalStorageService,
} from 'src/app/core/services';
import { LocalDatabaseService } from 'src/app/core/services/local-database.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
})
export class FooterComponent implements OnInit {
  isConnected = true;
  noInternetConnection!: boolean;
  allReports: any[] = [];
  db: any;
  data: any[] = [];
  constructor(
    private httpRequestService: HttpRequestService,
    private notificationService: NzNotificationService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private msg: NzMessageService,
    private configurationService: ConfigurationService,
    private localStorageService: LocalStorageService,
    private connectionService: ConnectionService,
    private localDatabaseService: LocalDatabaseService
  ) {
    //this.db = this.localDatabaseService.createDatabase('vessel_report', 50);
    // if (navigator.onLine) {
    //   console.log('online');
    //   this.localDatabaseService.syncWithServer();
    // } else {
    //   console.log('offline');
    // }
  }

  ngOnInit(): void {
    this.connectionService.monitor().subscribe((isConnected: any) => {
      this.isConnected = isConnected;
      if (this.isConnected) {
        this.noInternetConnection = false;
        console.log('back to online');
        setTimeout(() => {
          this.localDatabaseService.syncWithServer();
        }, 5000);
      }
    });
  }
}
