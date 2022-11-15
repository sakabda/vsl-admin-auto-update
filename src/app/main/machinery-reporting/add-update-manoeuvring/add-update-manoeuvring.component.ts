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
import { CommonAPIService } from 'src/app/core/services/common-api.service';
import { ReportingStoreService } from 'src/app/core/services/reporting-store.service';

@Component({
  selector: 'app-add-update-manoeuvring',
  templateUrl: './add-update-manoeuvring.component.html',
  styleUrls: ['./add-update-manoeuvring.component.scss'],
})
export class AddUpdateManoeuvringComponent implements OnInit {
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
      DailyRept_ManoeuvringArrival_IMO_No: [null],
      Report_Type: [null],

      // Vessel Activity (Manoeuvring [Arrival]
      DailyRept_VslActivity_Manoeuvring_Arrival_StartDate: [
        null,
        [Validators.required],
      ],
      DailyRept_VslActivity_Manoeuvring_Arrival_StartTime: [
        null,
        [Validators.required],
      ],
      DailyRept_VslActivity_Manoeuvring_Arrival_EndDate: [
        null,
        [Validators.required],
      ],
      DailyRept_VslActivity_Manoeuvring_Arrival_EndTime: [
        null,
        [Validators.required],
      ],

      // Manoeuvring [Arrival] (Voyage Details)
      DailyRept_ManoeuvringArrival_VoyDetails_VoyNo: [
        null,
        Validators.pattern('^[a-zA-Z0-9]*$'),
      ],
      DailyRept_ManoeuvringArrival_VoyDetails_DistOverSea: [
        null,
        this.rangeValidator(0, 250),
      ],
      DailyRept_ManoeuvringArrival_VoyDetails_DistOverGrnd: [
        null,
        this.rangeValidator(0, 250),
      ],
      DailyRept_ManoeuvringArrival_VoyDetails_AvgSpeed: [
        null,
        this.rangeValidator(0, 250),
      ],

      // Manoeuvring [Arrival] (Weather Info.)
      DailyRept_ManoeuvringArrival_WeatherInfo_SeaWaterTemp: [null],
      DailyRept_ManoeuvringArrival_WeatherInfo_ERTemp: [null],
      DailyRept_ManoeuvringArrival_WeatherInfo_OutsideTemp: [null],
      DailyRept_ManoeuvringArrival_WeatherInfo_OutsideHumidity: [null],

      // Manoeuvring [Arrival] (Main Engine Info)
      DailyRept_ManoeuvringArrival_MEInfo_MEAvgLoad: [null],
      DailyRept_ManoeuvringArrival_MEInfo_MEAvgRPM: [null],
      DailyRept_ManoeuvringArrival_MEInfo_MEAvgLoadPercent: [null],
      DailyRept_ManoeuvringArrival_MEInfo_MERhrs: [null],

      // Manoeuvring [Arrival] (Main Engine – Consumption)

      DailyRept_ManoeuvringArrival_MECons_FuelCons: [null],
      DailyRept_ManoeuvringArrival_MECons_Fuelinuse: [null],
      DailyRept_ManoeuvringArrival_MECons_CylOilCons: [null],
      DailyRept_ManoeuvringArrival_MECons_CylLOBN: [null],
      DailyRept_ManoeuvringArrival_MECons_SysOilConsLtrs: [null],

      DailyRept_ManoeuvringArrival_MECons_ME1RHRS: [null],
      DailyRept_ManoeuvringArrival_MECons_LOCons1: [
        null,
        this.rangeValidator(0, 9999),
      ],
      DailyRept_ManoeuvringArrival_MECons_ME2RHRS: [null],
      DailyRept_ManoeuvringArrival_MECons_LOCons2: [
        null,
        this.rangeValidator(0, 9999),
      ],
      DailyRept_ManoeuvringArrival_MECons_ME3RHRS: [null],
      DailyRept_ManoeuvringArrival_MECons_LOCons3: [
        null,
        this.rangeValidator(0, 9999),
      ],
      DailyRept_ManoeuvringArrival_MECons_ME4RHRS: [null],
      DailyRept_ManoeuvringArrival_MECons_LOCons4: [
        null,
        this.rangeValidator(0, 9999),
      ],
      DailyRept_ManoeuvringArrival_MECons_AddComments: [null],

      // Manoeuvring [Arrival] (Aux. Engine - Consumption (After C/O))
      DailyRept_ManoeuvringArrival_AECons_AE1RHRS: [null],
      DailyRept_ManoeuvringArrival_AECons_LOCons1: [
        null,
        this.rangeValidator(0, 9999),
      ],
      DailyRept_ManoeuvringArrival_AECons_AE2RHRS: [null],
      DailyRept_ManoeuvringArrival_AECons_LOCons2: [
        null,
        this.rangeValidator(0, 9999),
      ],
      DailyRept_ManoeuvringArrival_AECons_AE3RHRS: [null],
      DailyRept_ManoeuvringArrival_AECons_LOCons3: [
        null,
        this.rangeValidator(0, 9999),
      ],
      DailyRept_ManoeuvringArrival_AECons_AE4RHRS: [null],
      DailyRept_ManoeuvringArrival_AECons_LOCons4: [
        null,
        this.rangeValidator(0, 9999),
      ],
      DailyRept_ManoeuvringArrival_AECons_TotalAELoad: [null],
      DailyRept_ManoeuvringArrival_AECons_ReeferCons: [null],
      DailyRept_ManoeuvringArrival_AECons_TotalAEFuelCons: [null],
      DailyRept_ManoeuvringArrival_AECons_FuelInUse: [null],
      DailyRept_ManoeuvringArrival_AECons_AddComments: [null],

      // Manoeuvring [Arrival] (Boiler – Consumption (After C/O))
      DailyRept_ManoeuvringArrival_BLRCons_TotalFuelCons: [null],
      DailyRept_ManoeuvringArrival_BLRCons_FuelInUse: [null],

      // at Manoeuvring Arrival (Misc. rob)
      DailyRept_ManoeuvringArrival_MiscROB_TotalSludgeROB: [null],
      DailyRept_ManoeuvringArrival_MiscROB_SludgeLanded: [null],
      DailyRept_ManoeuvringArrival_MiscROB_ERBilgeROB: [null],
      DailyRept_ManoeuvringArrival_MiscROB_ERBilgeDischarge: [null],
      DailyRept_ManoeuvringArrival_MiscROB_MESYSOil: [null],
      DailyRept_ManoeuvringArrival_MiscROB_FreshWaterROB: [null],

      // at Manoeuvring Arrival (additional comments)
      DailyRept_ManoeuvringArrival_Gen_Comments: [null],
      _rev: [null],
      createdAt: [null],
    });
  }

  ngOnInit(): void {
    this.addUpdateDailyReportReportForm.patchValue({
      DailyRept_ManoeuvringArrival_IMO_No: this.localUser.IMO_No,
      Report_Type: 'Manoeuvring Arrival',
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

  /* get by id for local */
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

        if (data.DailyRept_ManoeuvringArrival_MECons_Fuelinuse) {
          this.addUpdateDailyReportReportForm.patchValue({
            DailyRept_ManoeuvringArrival_MECons_Fuelinuse:
              data.DailyRept_ManoeuvringArrival_MECons_Fuelinuse,
          });
        }
        if (data.DailyRept_ManoeuvringArrival_AECons_FuelInUse) {
          this.addUpdateDailyReportReportForm.patchValue({
            DailyRept_ManoeuvringArrival_AECons_FuelInUse:
              data.DailyRept_ManoeuvringArrival_AECons_FuelInUse,
          });
        }
        if (data.DailyRept_ManoeuvringArrival_BLRCons_FuelInUse) {
          this.addUpdateDailyReportReportForm.patchValue({
            DailyRept_ManoeuvringArrival_BLRCons_FuelInUse:
              data.DailyRept_ManoeuvringArrival_BLRCons_FuelInUse,
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
      .request('get', `daily-report-manoeuvring-arrivals/${this.idForUpdate}`)
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

          if (result.data.DailyRept_ManoeuvringArrival_MECons_Fuelinuse) {
            this.addUpdateDailyReportReportForm.patchValue({
              DailyRept_ManoeuvringArrival_MECons_Fuelinuse:
                result.data.DailyRept_ManoeuvringArrival_MECons_Fuelinuse._id,
            });
          }
          if (result.data.DailyRept_ManoeuvringArrival_AECons_FuelInUse) {
            this.addUpdateDailyReportReportForm.patchValue({
              DailyRept_ManoeuvringArrival_AECons_FuelInUse:
                result.data.DailyRept_ManoeuvringArrival_AECons_FuelInUse._id,
            });
          }
          if (result.data.DailyRept_ManoeuvringArrival_BLRCons_FuelInUse) {
            this.addUpdateDailyReportReportForm.patchValue({
              DailyRept_ManoeuvringArrival_BLRCons_FuelInUse:
                result.data.DailyRept_ManoeuvringArrival_BLRCons_FuelInUse._id,
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
        // this.addOrUpdateDailyReport(
        //   'put',
        //   `daily-report-manoeuvring-arrivals/${this.idForUpdate}`,
        //   'Daily Report Successfully Updated'
        // );
        //this.checkEditFields();
      } else {
        this.reportingStore
          .storeAtDb(this.addUpdateDailyReportReportForm.value)
          .then((response) => {
            console.log('Success!!');
            this.notificationService.success(
              '',
              'Daily Report Added Successfully '
            );
            //this.router.navigateByUrl('/main/machinery-report/daily-report');
          })
          .catch((err: any) => {
            console.error(err);
          });
        //console.log(this.addUpdateDailyReportReportForm.value);
        //this.checkFields();
        // this.addOrUpdateDailyReport(
        //   'post',
        //   `daily-report-manoeuvring-arrivals`,
        //   'Daily Report Successfully Added'
        // );
        // this.localDatabaseService
        //   .add({
        //     ...this.addUpdateDailyReportReportForm.value,
        //   })
        //   .then(() => {
        //     this.notificationService.success(
        //       '',
        //       'Daily Report Added Successfully '
        //     );
        //     this.buttonLoading = false;
        //     this.router.navigateByUrl('/main/machinery-report/daily-report');
        //   });
      }
    }
  }

  /* Add Or Edit Daily Report man arrival*/
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
