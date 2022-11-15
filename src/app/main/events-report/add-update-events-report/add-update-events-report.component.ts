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
  selector: 'app-add-update-events-report',
  templateUrl: './add-update-events-report.component.html',
  styleUrls: ['./add-update-events-report.component.scss'],
})
export class AddUpdateEventsReportComponent implements OnInit {
  addUpdateEventsReportForm: FormGroup;
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
    this.addUpdateEventsReportForm = this.fb.group({
      vesselDetails: this.fb.group({
        vesselName: [null, [Validators.required]],
        imo: [null, [Validators.required, Validators.pattern(/^\d{7}$/)]],
      }),
      events: this.fb.group({
        reportDate: [null],
        reportTime: [null],
        eventDetails: this.fb.array([]),
      }),
    });
    this.mediaUploadUrl = configurationService.apiUrl + '/api/media';
  }

  ngOnInit(): void {
    if (this.idForUpdate) {
      console.log('in edit mode');
    } else {
      // by default create eventDetailsFormArray  one element
      this.addEventDetails();
    }
  }

  /* Submit  form */
  submit(): void {
    if (!this.addUpdateEventsReportForm.valid) {
      this.markFormGroupTouched(this.addUpdateEventsReportForm);
    } else {
      if (this.idForUpdate) {
        //     //     // this.addOrUpdateQuestion(
        //     //     //   'put',
        //     //     //   `question-banks/${this.idForUpdate}`,
        //     //     //   'Question Successfully Updated'
        //     //     // );
      } else {
        console.log(this.addUpdateEventsReportForm.value);
        this.addOrUpdateEventsReport(
          'post',
          'events-reports',
          'Events Report Added Successfully '
        );
      }
    }
  }

  /* Add Or Edit Events Report */
  addOrUpdateEventsReport(
    requestMethod: string,
    requestURL: string,
    successMessage: string
  ): void {
    this.buttonLoading = true;
    this.httpRequestService
      .request(requestMethod, requestURL, this.addUpdateEventsReportForm.value)
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

  // ------------ Event Details Form Array----
  createEvent(item?: any): FormGroup {
    //console.log('item', item);
    if (item) {
      return this.fb.group({
        event1: [item.event1, [null]],
        event2: [item.event2, [null]],
        event3: [item.event3, [null]],
        comment: [item.comment, [null]],
        startTime: [item.startTime, [null]],
        endTime: [item.endTime, [null]],
        longitude: [item.longitude, [null]],
        latitude: [item.latitude, [null]],
        port: [item.port, [null]],
        otherPort: [item.otherPort, [null]],
      });
    }
    return this.fb.group({
      event1: [null],
      event2: [null],
      event3: [null],
      comment: [null],
      startTime: [null],
      endTime: [null],
      longitude: [null],
      latitude: [null],
      port: [null],
      otherPort: [null],
    });
  }

  //for bunker form array
  get eventDetailsFormArray(): FormArray {
    return this.addUpdateEventsReportForm.controls.events.get(
      'eventDetails'
    ) as FormArray;
  }
  addEventDetails(): void {
    this.eventDetailsFormArray.push(this.createEvent());
  }
  removeEventDetails(index: number): void {
    this.eventDetailsFormArray.removeAt(index);
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

    this.eventDetailsFormArray.controls.forEach((group: any) => {
      for (const i in group.controls) {
        if (group.controls.hasOwnProperty(i)) {
          group.controls[i].markAsDirty();
          group.controls[i].updateValueAndValidity();
        }
      }
    });
  }
}
