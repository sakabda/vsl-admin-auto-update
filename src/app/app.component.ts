import { Component, OnInit } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzDrawerService } from 'ng-zorro-antd/drawer';
import {
  ConfigurationService,
  HttpRequestService,
  LocalStorageService,
} from 'src/app/core/services';

import { ConnectionService } from 'ng-connection-service';
import { Router } from '@angular/router';
import { ElectronService } from 'ngx-electron';
import { IpcService } from './ipc.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  isCollapsed = false;
  localUser: any;
  version: number = 0;
  isVisible = false;
  downloadUrl = '';
  selectedSource: string = '';
  constructor(
    private httpRequestService: HttpRequestService,
    private localStorageService: LocalStorageService,
    private configurationService: ConfigurationService
  ) {
    this.localUser = this.localStorageService.getItem('user');
    this.version = this.configurationService.appVersion;
    console.log(this.version);

  }

  ngOnInit(): void {
    this.httpRequestService
      .request('get', 'settings/reporting-version')
      .subscribe(
        (result) => {
          console.log('off response', result, this.version);
          if (result.data.version > this.version) {
            this.downloadUrl = result.data.url;
            this.isVisible = true;

            console.log('dowlod url', this.downloadUrl, this.version);
          }
        },
        (err) => {
          console.log('in off', err);
        }
      );
  }

  download(): void {
    window.open(this.downloadUrl, '_blank');
  }
}
