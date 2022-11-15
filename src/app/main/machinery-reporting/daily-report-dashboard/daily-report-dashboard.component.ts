import { Component, OnInit } from '@angular/core';
import { LocalStorageService } from 'src/app/core/services/local-storage.service';

@Component({
  selector: 'app-daily-report-dashboard',
  templateUrl: './daily-report-dashboard.component.html',
  styleUrls: ['./daily-report-dashboard.component.scss'],
})
export class DailyReportDashboardComponent implements OnInit {
  localUser: any;

  constructor(private localStorageService: LocalStorageService) {
    this.localUser = this.localStorageService.getItem('user');
  }

  ngOnInit(): void {}
}
