import { NullTemplateVisitor } from '@angular/compiler';
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
import * as moment from 'moment';
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
import { timeZoneData } from './timezone.data';

@Component({
  selector: 'app-add-update-noon-report',
  templateUrl: './add-update-noon-report.component.html',
  styleUrls: ['./add-update-noon-report.component.scss'],
})
export class AddUpdateNoonReportComponent implements OnInit {
  addUpdateNoonReportForm: FormGroup;
  idForUpdate: string;
  buttonLoading = false;
  mediaUploadUrl: string;
  time: Date | null = null;
  defaultOpenValue = new Date(0, 0, 0, 0, 0, 0);
  timeZones: any[] = timeZoneData || [];
  reportValue: any;

  constructor(
    private fb: FormBuilder,
    private httpRequestService: HttpRequestService,
    private notificationService: NzNotificationService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private msg: NzMessageService,
    private configurationService: ConfigurationService
  ) {
    this.reportValue = 'Noon Report';
    this.idForUpdate = this.activatedRoute.snapshot.params.id;
    this.addUpdateNoonReportForm = this.fb.group({
      formType: ['Noon Report'],
      vesselDetails: this.fb.group({
        reportType: [null, [Validators.required]],
        vesselName: [null, [Validators.required]],
        imo: [null, [Validators.required, Validators.pattern(/^\d{7}$/)]],
      }),
      crewOnboard: this.fb.group({
        masterName: [null],
        coName: [null],
        ceName: [null],
        aeName: [null],
      }),
      voyageDetails: this.fb.group({
        voyageName: [null],
        voyageCpDate: [null],
        messageDate: [null],
        messageTime: [null],
        timeZone: [null],
        voyageChartererListed: [null],
        voyageChartererNotListed: [null],
        agentListed: [null],
        agentNotListed: [null],
        agentPic: [null],
        agentTel: [null],
      }),
      portDetails: this.fb.group({
        noonPortListed: [null],
        noonPortNotListed: [null],
        portActivity1Listed: [null],
        portActivity1NotListed: [null],
        portActivity2Listed: [null],
        portActivity2NotListed: [null],
        anchor: [null],
        coverDistance: [
          null,
          [Validators.pattern('^[+]?([0-9]+.?[0-9]*|.[0-9]+)$')],
        ],
      }),
      etcAndEtd: this.fb.group({
        etcDate: [null],
        etcTime: [null],
        etdDate: [null],
        etdTime: [null],
      }),
      bunkerReport: this.fb.group({
        bunkerDetails: this.fb.array([]),
        activityReason: [null],
        boilerReason: [null],
      }),
      rob: this.fb.group({
        fo: [null, [Validators.pattern('^[+]?([0-9]+.?[0-9]*|.[0-9]+)$')]],
        vlsfo: [null, [Validators.pattern('^[+]?([0-9]+.?[0-9]*|.[0-9]+)$')]],
        ulsfo: [null, [Validators.pattern('^[+]?([0-9]+.?[0-9]*|.[0-9]+)$')]],
        go: [null, [Validators.pattern('^[+]?([0-9]+.?[0-9]*|.[0-9]+)$')]],
        lsgo: [null, [Validators.pattern('^[+]?([0-9]+.?[0-9]*|.[0-9]+)$')]],
        fw: [null, [Validators.pattern('^[+]?([0-9]+.?[0-9]*|.[0-9]+)$')]],
      }),
      lubOilRob: this.fb.group({
        meSystemOil: [
          null,
          [Validators.pattern('^[+]?([0-9]+.?[0-9]*|.[0-9]+)$')],
        ],
        oilHs: [null, [Validators.pattern('^[+]?([0-9]+.?[0-9]*|.[0-9]+)$')]],
        oilLs: [null, [Validators.pattern('^[+]?([0-9]+.?[0-9]*|.[0-9]+)$')]],
        aeOil: [null, [Validators.pattern('^[+]?([0-9]+.?[0-9]*|.[0-9]+)$')]],
      }),
      enginesRunningHours: this.fb.group({
        me1: [null, [Validators.pattern('^[+]?([0-9]+.?[0-9]*|.[0-9]+)$')]],
        me2: [null, [Validators.pattern('^[+]?([0-9]+.?[0-9]*|.[0-9]+)$')]],
        me3: [null, [Validators.pattern('^[+]?([0-9]+.?[0-9]*|.[0-9]+)$')]],
        me4: [null, [Validators.pattern('^[+]?([0-9]+.?[0-9]*|.[0-9]+)$')]],
        ae1: [null, [Validators.pattern('^[+]?([0-9]+.?[0-9]*|.[0-9]+)$')]],
        ae2: [null, [Validators.pattern('^[+]?([0-9]+.?[0-9]*|.[0-9]+)$')]],
        ae3: [null, [Validators.pattern('^[+]?([0-9]+.?[0-9]*|.[0-9]+)$')]],
        ae4: [null, [Validators.pattern('^[+]?([0-9]+.?[0-9]*|.[0-9]+)$')]],
      }),
      cargoOperations: this.fb.group({
        cargo1GradeName: [null],
        cargo2GradeName: [null],
        cargo3GradeName: [null],
        cargo4GradeName: [null],
        cargo1Qty: [
          null,
          [Validators.pattern('^[+]?([0-9]+.?[0-9]*|.[0-9]+)$')],
        ],
        cargo2Qty: [
          null,
          [Validators.pattern('^[+]?([0-9]+.?[0-9]*|.[0-9]+)$')],
        ],
        cargo3Qty: [
          null,
          [Validators.pattern('^[+]?([0-9]+.?[0-9]*|.[0-9]+)$')],
        ],
        cargo4Qty: [
          null,
          [Validators.pattern('^[+]?([0-9]+.?[0-9]*|.[0-9]+)$')],
        ],
      }),
      delay: this.fb.group({
        reasonDelay: [null],
      }),
      timeSheet: this.fb.group({
        briefTime: [null],
      }),
      remarks: this.fb.group({
        remarksDes: [null],
      }),
    });
    this.mediaUploadUrl = configurationService.apiUrl + '/api/media';
  }

  ngOnInit(): void {
    if (this.idForUpdate) {
      console.log('in edit mode');
      this.getNoonReportById();
    } else {
      // by default create bunkerDetailsFormArray  one element
      this.addBunkerDetails();
    }
  }

  /* Get single noon report by Id */
  getNoonReportById(): void {
    this.httpRequestService
      .request('get', `main-reports/${this.idForUpdate}`)
      .subscribe(
        (result: any) => {
          console.log(result.data.bunkerReport.bunkerDetails);
          if (
            result.data.voyageDetails &&
            result.data.voyageDetails.messageTime
          ) {
            result.data.voyageDetails.messageTime = moment(
              result.data.voyageDetails.messageTime,
              'hh:mm'
            ).toISOString();
          }

          if (result.data.voyageDetails && result.data.voyageDetails.timeZone) {
            const foundTimeZone = this.timeZones.find(
              (x) => x.text === result.data.voyageDetails.timeZone
            );
            if (!foundTimeZone) {
              this.timeZones.unshift({
                text: result.data.voyageDetails.timeZone,
              });
            }
          }

          if (result.data.etcAndEtd && result.data.etcAndEtd.etcTime) {
            result.data.etcAndEtd.etcTime = moment(
              result.data.etcAndEtd.etcTime,
              'hh:mm'
            ).toISOString();
          }
          if (result.data.etcAndEtd && result.data.etcAndEtd.etdTime) {
            result.data.etcAndEtd.etdTime = moment(
              result.data.etcAndEtd.etdTime,
              'hh:mm'
            ).toISOString();
          }
          this.addUpdateNoonReportForm.patchValue({
            vesselDetails: result.data.vesselDetails,
            crewOnboard: result.data.crewOnboard,
            voyageDetails: result.data.voyageDetails,
            portDetails: result.data.portDetails,
            etcAndEtd: result.data.etcAndEtd,
            rob: result.data.rob,
            lubOilRob: result.data.lubOilRob,
            enginesRunningHours: result.data.enginesRunningHours,
            cargoOperations: result.data.cargoOperations,
            delay: result.data.delay,
            timeSheet: result.data.timeSheet,
            remarks: result.data.remarks,
            bunkerReport: result.data.bunkerReport,
          });
          if (result.data.bunkerReport.bunkerDetails) {
            result.data.bunkerReport.bunkerDetails.forEach((element: any) => {
              this.bunkerDetailsFormArray.push(this.createBunker(element));
            });
          }
        },
        (error: any) => {}
      );
  }

  /* Submit  form */
  submit(): void {
    if (!this.addUpdateNoonReportForm.valid) {
      this.markFormGroupTouched(this.addUpdateNoonReportForm);
    } else {
      if (this.idForUpdate) {
        this.addOrUpdateNoonReport(
          'put',
          `main-reports/${this.idForUpdate}`,
          'Noon Report Successfully Updated'
        );
      } else {
        console.log(this.addUpdateNoonReportForm.value);
        this.addOrUpdateNoonReport(
          'post',
          'main-reports',
          'Noon Report Added Successfully '
        );
      }
    }
  }

  /* Add Or Edit Noon Report */
  addOrUpdateNoonReport(
    requestMethod: string,
    requestURL: string,
    successMessage: string
  ): void {
    this.buttonLoading = true;
    this.httpRequestService
      .request(requestMethod, requestURL, this.addUpdateNoonReportForm.value)
      .subscribe(
        (result: any) => {
          this.notificationService.success('', successMessage);
          this.router.navigateByUrl('/main/noon-report');
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

  // ------------ Bunker Details Form Array----
  createBunker(item?: any): FormGroup {
    //console.log('item', item);
    if (item) {
      return this.fb.group({
        bunkerActivity: [item.bunkerActivity],
        engineType: [item.engineType],
        fuelType: [item.fuelType],
        bunkerInput: [item.bunkerInput],
        bunkerDate1: [item.bunkerDate1],
        bunkerDate2: [item.bunkerDate2],
      });
    }
    return this.fb.group({
      bunkerActivity: [null],
      engineType: [null],
      fuelType: [null],
      bunkerInput: [null],
      bunkerDate1: [null],
      bunkerDate2: [null],
    });
  }

  //for bunker form array
  get bunkerDetailsFormArray(): FormArray {
    return this.addUpdateNoonReportForm.controls.bunkerReport.get(
      'bunkerDetails'
    ) as FormArray;
  }
  addBunkerDetails(): void {
    //console.log('arrya', this.bunkerDetailsFormArray);
    this.bunkerDetailsFormArray.push(this.createBunker());
  }
  removeBunkerDetails(index: number): void {
    this.bunkerDetailsFormArray.removeAt(index);
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

    this.bunkerDetailsFormArray.controls.forEach((group: any) => {
      for (const i in group.controls) {
        if (group.controls.hasOwnProperty(i)) {
          group.controls[i].markAsDirty();
          group.controls[i].updateValueAndValidity();
        }
      }
    });
  }
}
