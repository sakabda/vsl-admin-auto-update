import { NullTemplateVisitor } from '@angular/compiler';
import { Component, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  ValidatorFn,
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
  LocalStorageService,
} from 'src/app/core/services';
//import { timeZoneData } from './timezone.data';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { timeZoneData } from '../add-update-daily-report-at-sea/timezone.data';
import { LocalDatabaseService } from 'src/app/core/services/local-database.service';
import { ReportingStoreService } from 'src/app/core/services/reporting-store.service';
import { CommonAPIService } from 'src/app/core/services/common-api.service';

@Component({
  selector: 'app-add-update-daily-report-fuel-changeover',
  templateUrl: './add-update-daily-report-fuel-changeover.component.html',
  styleUrls: ['./add-update-daily-report-fuel-changeover.component.scss'],
})
export class AddUpdateDailyReportFuelChangeoverComponent implements OnInit {
  addUpdateDailyReportReportForm!: FormGroup;
  idForUpdate!: string;
  buttonLoading = false;
  mediaUploadUrl!: string;
  time: Date | null = null;
  time1: Date | null = null;
  timeZones: any[] = timeZoneData || [];
  defaultOpenValue = new Date(0, 0, 0, 0, 0, 0);
  reportValue: any;
  isCheckedButton = false;
  isFuelCheckedButton = false;
  isPortCheckedButton = false;
  isAncCheckedButton = false;
  isDriftingCheckedButton = false;
  isManArrCheckedButton = false;
  isManDepCheckedButton = false;
  confirmModal?: NzModalRef; // For testing by now
  borderColor = 'false';
  uniqueId: any;
  snycVal: any;
  seaSatisfied = false;
  fuelSatisfied = false;
  portSatisfied = false;
  ancSatisfied = false;
  driffSatisfied = false;
  manArrSatisfied = false;
  manDepSatisfied = false;
  allBunkerStockReports: any;
  localUser: any;

  constructor(
    private fb: FormBuilder,
    private localStorageService: LocalStorageService,
    private httpRequestService: HttpRequestService,
    private notificationService: NzNotificationService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private msg: NzMessageService,
    private configurationService: ConfigurationService,
    private nzModalService: NzModalService,
    private localDatabaseService: LocalDatabaseService,
    private reportingStore: ReportingStoreService,
    private commonApiService: CommonAPIService
  ) {
    this.localUser = this.localStorageService.getItem('user');
    this.idForUpdate = this.activatedRoute.snapshot.params.id;
    this.addUpdateDailyReportReportForm = this.fb.group({
      DailyRept_FuelChangeover_IMO_No: [null],
      Report_Type: [null],

      // Vessel Activity (Fuel Changeover)
      DailyRept_VslActivity_Fuel_Changeover_StartDate: [
        null,
        [Validators.required],
      ],
      DailyRept_VslActivity_Fuel_Changeover_StartTime: [
        null,
        [Validators.required],
      ],
      DailyRept_VslActivity_Fuel_Changeover_EndDate: [
        null,
        [Validators.required],
      ],
      DailyRept_VslActivity_Fuel_Changeover_EndTime: [
        null,
        [Validators.required],
      ],

      // Fuel Changeover Main Engine Info
      DailyRept_FuelChangeover_MECons_MEAvgLoad: [
        null,
        [Validators.required, this.rangeValidator(0, 99999)],
      ],
      DailyRept_FuelChangeover_MECons_MEAvgRPM: [
        null,
        [Validators.required, this.rangeValidator(0, 999)],
      ],
      DailyRept_FuelChangeover_MECons_MEAvgLoadPercent: [
        null,
        [Validators.required, this.rangeValidator(0, 100)],
      ],
      DailyRept_FuelChangeover_MECons_MERhrs:[null,[Validators.required,Validators.pattern('^[.0-9]*$'),this.rangeValidator(0,26)]],  
      DailyRept_FuelChangeover_MECons_MERhrs_TotalCounter:[null,[Validators.required,Validators.pattern('^[.0-9]*$'),this.rangeValidator(0,200000)]],
 
     


      // Fuel Changeover (Main Engine – Consumption (From C/O Start))
      DailyRept_FuelChangeover_MECons_FuelCons: [
        null,
        [Validators.required, this.rangeValidator(0, 999)],
      ],
      DailyRept_FuelChangeover_MECons_Fuelinuse: [null],
      DailyRept_FuelChangeover_MECons_CylOilCons: [
        null,
        [Validators.required, this.rangeValidator(0, 9999)],
      ],
      DailyRept_FuelChangeover_MECons_CylLOBN: [
        null,
        [this.rangeValidator(0, 999)],
      ],
      DailyRept_FuelChangeover_MECons_SysOilConsLtrs: [
        null,
        this.rangeValidator(0, 9999),
      ],

      // Fuel Changeover (Aux. Engine - Consumption (From C/O Start))
      DailyRept_FuelChangeover_AECons_AE1RHRS:[null,[Validators.pattern('^[.0-9]*$'),this.rangeValidator(0,26)]],
      DailyRept_FuelChangeover_AECons_AE1RHRS_TotalCounter:[null,[Validators.pattern('^[.0-9]*$'),this.rangeValidator(0,200000)]],
  
      DailyRept_FuelChangeover_AECons_LOCons1: [
        null,
        this.rangeValidator(0, 9999),
      ],
      DailyRept_FuelChangeover_AECons_AE2RHRS:[null,[Validators.pattern('^[.0-9]*$'),this.rangeValidator(0,200000)]],
      DailyRept_FuelChangeover_AECons_AE2RHRS_TotalCounter:[null,[Validators.pattern('^[.0-9]*$'),this.rangeValidator(0,200000)]],
  
      DailyRept_FuelChangeover_AECons_LOCons2: [
        null,
        this.rangeValidator(0, 9999),
      ],
      DailyRept_FuelChangeover_AECons_AE3RHRS:[null,[Validators.pattern('^[.0-9]*$'),this.rangeValidator(0,200000)]],
      DailyRept_FuelChangeover_AECons_AE3RHRS_TotalCounter:[null,[Validators.pattern('^[.0-9]*$'),this.rangeValidator(0,200000)]],
  
      DailyRept_FuelChangeover_AECons_LOCons3: [
        null,
        this.rangeValidator(0, 9999),
      ],
      DailyRept_FuelChangeover_AECons_AE4RHRS:[null,[Validators.pattern('^[.0-9]*$'),this.rangeValidator(0,200000)]],
      DailyRept_FuelChangeover_AECons_AE4RHRS_TotalCounter:[null,[Validators.pattern('^[.0-9]*$'),this.rangeValidator(0,200000)]],
  
      DailyRept_FuelChangeover_AECons_LOCons4: [
        null,
        this.rangeValidator(0, 9999),
      ],
      DailyRept_FuelChangeover_AECons_TotalAELoad: [
        null,
        [Validators.required],
      ],
      DailyRept_FuelChangeover_AECons_ReeferCons: [null],
      DailyRept_FuelChangeover_AECons_TotalAEFuelCons: [
        null,
        [Validators.required],
      ],
      DailyRept_FuelChangeover_AECons_FuelInUse: [null],
      DailyRept_FuelChangeover_AECons_AddComments: [null],

      // Fuel Changeover (Boiler – Consumption (From C/O Start))
      DailyRept_FuelChangeover_BLRCons_TotalFuelCons: [
        null,
        [Validators.required],
      ],
      DailyRept_FuelChangeover_BLRCons_FuelInUse: [null],

      // at FuelChangeover (additional comments)
      DailyRept_FuelChangeover_Gen_Comments: [null],
      Fuel_Grade: [null],
      Fuel_Grade1: [null],
      _rev: [null],
      createdAt: [null],
    });
  }

  ngOnInit(): void {
    this.addUpdateDailyReportReportForm.patchValue({
      DailyRept_FuelChangeover_IMO_No: this.localUser.IMO_No,
      Report_Type: 'Fuel Changeover',
      createdAt: new Date(),
    });
    this.getBunkerStcokDetails();
    if (this.idForUpdate) {
      // Check if the id is an UUID
      const iid = this.idForUpdate.match(/^[0-9a-fA-F]{24}$/);
      console.log('match id', iid?.input);

      if (this.idForUpdate.match(/^[0-9a-fA-F]{24}$/)) {
        console.log('in edit mode');
        this.getDailyReportById();
      } else {
        console.log('FETCH FROM LOCAL');

        this.getDailyReportByIdLocal();
      }
    }
  }

  /* get bunker stock details */
  // getBunkerStcokDetails(): void {
  //   this.httpRequestService.request('get', 'bunker-reports').subscribe(
  //     (result) => {
  //       console.log(result);

  //       this.allBunkerStockReports = result.data;
  //     },
  //     (err) => {}
  //   );
  // }

  /* get bunker stock details */
  async getBunkerStcokDetails(): Promise<void> {
    try {
      const result = await this.commonApiService.getBunkerStockDetails();
      this.allBunkerStockReports = result;
    } catch (err) {
      console.error(err);
    }
  }

  getDailyReportByIdLocal(): void {
    this.localDatabaseService
      .getById(this.idForUpdate)
      .then((data) => {
        console.log('FOUND', data);
        this.addUpdateDailyReportReportForm.patchValue(data);

        this.isCheckedButton = data.isCheckedButton;
        this.isFuelCheckedButton = data.isFuelCheckedButton;
        this.isPortCheckedButton = data.isPortCheckedButton;
        this.isAncCheckedButton = data.isAncCheckedButton;
        this.isDriftingCheckedButton = data.isDriftingCheckedButton;
        this.isManArrCheckedButton = data.isManArrCheckedButton;
        this.isManDepCheckedButton = data.isManDepCheckedButton;

        if (data.DailyRept_FuelChangeover_MECons_Fuelinuse) {
          this.addUpdateDailyReportReportForm.patchValue({
            DailyRept_FuelChangeover_MECons_Fuelinuse:
              data.DailyRept_FuelChangeover_MECons_Fuelinuse,
          });
        }
        if (data.DailyRept_FuelChangeover_AECons_FuelInUse) {
          this.addUpdateDailyReportReportForm.patchValue({
            DailyRept_FuelChangeover_AECons_FuelInUse:
              data.DailyRept_FuelChangeover_AECons_FuelInUse,
          });
        }
        if (data.DailyRept_FuelChangeover_BLRCons_FuelInUse) {
          this.addUpdateDailyReportReportForm.patchValue({
            DailyRept_FuelChangeover_BLRCons_FuelInUse:
              data.DailyRept_FuelChangeover_BLRCons_FuelInUse,
          });
        }
      })
      .catch((err) => {
        console.error(err);
      });
    //this.onChanges();
  }

  // /* get by id */
  getDailyReportById(): void {
    this.httpRequestService
      .request('get', `daily-report-fuel-changeovers/${this.idForUpdate}`)
      .subscribe(
        (result) => {
          this.addUpdateDailyReportReportForm.patchValue(result.data);

          this.isCheckedButton = result.data.isCheckedButton;
          this.isFuelCheckedButton = result.data.isFuelCheckedButton;
          this.isPortCheckedButton = result.data.isPortCheckedButton;
          this.isAncCheckedButton = result.data.isAncCheckedButton;
          this.isDriftingCheckedButton = result.data.isDriftingCheckedButton;
          this.isManArrCheckedButton = result.data.isManArrCheckedButton;
          this.isManDepCheckedButton = result.data.isManDepCheckedButton;

          if (result.data.DailyRept_FuelChangeover_MECons_Fuelinuse) {
            this.addUpdateDailyReportReportForm.patchValue({
              DailyRept_FuelChangeover_MECons_Fuelinuse:
                result.data.DailyRept_FuelChangeover_MECons_Fuelinuse._id,
            });
          }
          if (result.data.DailyRept_FuelChangeover_AECons_FuelInUse) {
            this.addUpdateDailyReportReportForm.patchValue({
              DailyRept_FuelChangeover_AECons_FuelInUse:
                result.data.DailyRept_FuelChangeover_AECons_FuelInUse._id,
            });
          }
          if (result.data.DailyRept_FuelChangeover_BLRCons_FuelInUse) {
            this.addUpdateDailyReportReportForm.patchValue({
              DailyRept_FuelChangeover_BLRCons_FuelInUse:
                result.data.DailyRept_FuelChangeover_BLRCons_FuelInUse._id,
            });
          }
        },
        (error) => {}
      );
    //this.onChanges();
  }

  /* Submit  form */
  submit(): void {
    if (!this.addUpdateDailyReportReportForm.valid) {
      this.markFormGroupTouched(this.addUpdateDailyReportReportForm);
    } else {
      if (this.idForUpdate) {
        if (this.localUser?.Role === 'reader') {
          this.tsiNotifyMsg();
        } else {
          this.reportingStore
            .storeAtDb(
              this.addUpdateDailyReportReportForm.value,
              this.idForUpdate
            )
            .then((response) => {
              console.log('Success!!');
              this.notificationService.success(
                '',
                'Daily Report Update Successfully '
              );
              //this.router.navigateByUrl('/main/machinery-report/daily-report');
            })
            .catch((err: any) => {
              console.error(err);
            });
        }

        // this.addOrUpdateDailyReport(
        //   'put',
        //   `daily-report-fuel-changeovers/${this.idForUpdate}`,
        //   'Daily Report Successfully Updated'
        // );
        //this.checkEditFields();
      } else {
        if (this.localUser?.Role === 'reader') {
          this.tsiNotifyMsg();
        } else {
          this.reportingStore
            .storeAtDb(this.addUpdateDailyReportReportForm.value)
            .then((response) => {
              console.log('Success!!');
              this.notificationService.success(
                '',
                'Daily Report Added Successfully '
              );
              // this.router.navigateByUrl('/main/machinery-report/daily-report');
            })
            .catch((err: any) => {
              console.error(err);
            });
        }

        //console.log(this.addUpdateDailyReportReportForm.value);
        //this.checkFields();
        // this.addOrUpdateDailyReport(
        //   'post',
        //   `daily-report-fuel-changeovers`,
        //   'Daily Report Successfully Added'
        // );
        // this.localDatabaseService
        //   .add({
        //     ...this.addUpdateDailyReportReportForm.value,
        //   })
        //   .then(() => {
        //     this.notificationService.success(
        //       '',
        //       'Daily Report Successfully Added '
        //     );
        //     this.buttonLoading = false;
        //     this.router.navigateByUrl('/main/machinery-report/daily-report');
        //   });
      }
    }
  }

  /*  TSI submit message */
  tsiNotifyMsg(): void {
    this.notificationService.error(
      '',
      "You don't have permission to access this resource"
    );
  }

  /* Add Or Edit Daily Report at fuel changeover */
  addOrUpdateDailyReport(
    requestMethod: string,
    requestURL: string,
    successMessage: string
  ): void {
    this.buttonLoading = true;
    this.httpRequestService
      .request(
        requestMethod,
        requestURL,
        this.addUpdateDailyReportReportForm.value
      )
      .subscribe(
        (result: any) => {
          this.notificationService.success('', successMessage);
          this.router.navigateByUrl('/main/machinery-report/daily-report');
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
    for (const i in formGroup.controls) {
      if (formGroup.controls.hasOwnProperty(i)) {
        formGroup.controls[i].markAsDirty();
        formGroup.controls[i].updateValueAndValidity();
      }
    }
  }

  /* Custom range validation */
  rangeValidator(min: any, max: any): ValidatorFn {
    return (control: AbstractControl): { [key: string]: boolean } | null => {
      if (
        control.value !== undefined &&
        (isNaN(control.value) || control.value < min || control.value > max)
      ) {
        return { range: true };
      }
      return null;
    };
  }
}
