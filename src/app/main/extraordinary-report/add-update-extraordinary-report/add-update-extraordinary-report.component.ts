import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
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
  selector: 'app-add-update-extraordinary-report',
  templateUrl: './add-update-extraordinary-report.component.html',
  styleUrls: ['./add-update-extraordinary-report.component.scss'],
})
export class AddUpdateExtraordinaryReportComponent implements OnInit {
  addUpdateExtraOrdinaryReportForm: FormGroup;
  idForUpdate: string;
  buttonLoading = false;
  mediaUploadUrl: string;
  time: Date | null = null;
  defaultOpenValue = new Date(0, 0, 0, 0, 0, 0);

  constructor(
    private fb: FormBuilder,
    private httpRequestService: HttpRequestService,
    private notificationService: NzNotificationService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private msg: NzMessageService,
    private configurationService: ConfigurationService
  ) {
    this.idForUpdate = this.activatedRoute.snapshot.params.id;
    this.addUpdateExtraOrdinaryReportForm = this.fb.group({
      reportDetails: this.fb.group({
        reportType: [null, [Validators.required]],
        reportDate: [null, [Validators.required]],
      }),
    });
    this.mediaUploadUrl = configurationService.apiUrl + '/api/media';
  }

  ngOnInit(): void {
    if (this.idForUpdate) {
      console.log('in edit mode');
    } else {
      // by default create bunkerDetailsFormArray  one element
    }
  }

  /* Submit  form */
  submit(): void {
    if (!this.addUpdateExtraOrdinaryReportForm.valid) {
      this.markFormGroupTouched(this.addUpdateExtraOrdinaryReportForm);
    } else {
      if (this.idForUpdate) {
        //     //     // this.addOrUpdateQuestion(
        //     //     //   'put',
        //     //     //   `question-banks/${this.idForUpdate}`,
        //     //     //   'Question Successfully Updated'
        //     //     // );
      } else {
        console.log(this.addUpdateExtraOrdinaryReportForm.value);
        this.addOrUpdateExtraOrdinaryReport(
          'post',
          'extraordinary-reports',
          'Exteordinary Report Added Successfully '
        );
      }
    }
  }
  /* Add Or Edit Exteordinary Report */
  addOrUpdateExtraOrdinaryReport(
    requestMethod: string,
    requestURL: string,
    successMessage: string
  ): void {
    this.buttonLoading = true;
    this.httpRequestService
      .request(
        requestMethod,
        requestURL,
        this.addUpdateExtraOrdinaryReportForm.value
      )
      .subscribe(
        (result: any) => {
          this.notificationService.success('', successMessage);
          this.router.navigateByUrl('/main/dashboard');
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

  /* Make All Form Controls Dirty */
  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach((key: string) => {
      const abstractControl = formGroup.get(key);
      if (abstractControl instanceof FormGroup) {
        this.markFormGroupTouched(abstractControl);
      } else {
        //console.log('key = ' + key + 'value = ' + abstractControl?.value);
        abstractControl?.markAsDirty();
        abstractControl?.updateValueAndValidity();
      }
    });
  }
}
