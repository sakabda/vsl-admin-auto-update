import { NullTemplateVisitor } from '@angular/compiler';
import { Component, Input, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import { NzButtonSize } from 'ng-zorro-antd/button';
import { NzDrawerService } from 'ng-zorro-antd/drawer';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import { from, Observable, Observer, Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import {
  ConfigurationService,
  HttpRequestService,
} from 'src/app/core/services';

@Component({
  selector: 'app-email-details',
  templateUrl: './email-details.component.html',
  styleUrls: ['./email-details.component.scss'],
})
export class EmailDetailsComponent implements OnInit {
  emailForm!: FormGroup;
  @Input() bunkerStockData: any;
  bunkerStockInfo: any = {};
  size: NzButtonSize = 'small';
  file: any;
  buttonLoading = false;
  sendFinalData: any;
  showCcContent: Boolean = true;
  showBccContent: Boolean = true;

  constructor(
    private fb: FormBuilder,
    private httpRequestService: HttpRequestService,
    private notificationService: NzNotificationService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private msg: NzMessageService,
    private configurationService: ConfigurationService
  ) {
    this.emailForm = this.fb.group({
      toEmail: [null],
      ccEmail: [null],
      bccEmail: [null],
    });
  }

  ngOnInit(): void {
    this.bunkerStockInfo = this.bunkerStockData;
  }

  send(): void {
    this.sendFinalData = {
      emailInfo: this.emailForm.value,
      bunkerStockInfo: this.bunkerStockInfo,
    };
    console.log('final', this.sendFinalData);
    this.sendEmailReport(
      'post',
      'bunker-reports/send-email',
      'Bunker Report Sent Successfully'
    );
  }

  sendEmailReport(
    requestMethod: string,
    requestURL: string,
    successMessage: string
  ): void {
    this.buttonLoading = true;
    this.httpRequestService
      .request(requestMethod, requestURL, this.sendFinalData)
      .subscribe(
        (result: any) => {
          this.notificationService.success('', successMessage);
          this.router.navigateByUrl('/main/bunker-stock-report/bunker-stock');
          this.buttonLoading = false;
        },
        (error: any) => {
          if (error.error.errors) {
            const allErrors: string[] = Object.values(error.error.errors);
            for (const err of allErrors) {
              this.notificationService.error('', err);
            }
          } else {
            this.notificationService.error('', error.error.message);
          }
          this.buttonLoading = false;
        }
      );
  }

  showHideCcInput(): void {
    this.showCcContent = !this.showCcContent;
  }
  showHideBccInput(): void {
    this.showBccContent = !this.showBccContent;
  }
}
