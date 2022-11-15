import { NullTemplateVisitor } from '@angular/compiler';
import { Component, OnInit, resolveForwardRef } from '@angular/core';
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

@Component({
  selector: 'app-add-update-rob-report',
  templateUrl: './add-update-rob-report.component.html',
  styleUrls: ['./add-update-rob-report.component.scss'],
})
export class AddUpdateRobReportComponent implements OnInit {
  robReportForm!: FormGroup;
  idForUpdate!: string;
  buttonLoading = false;
  loading = false;
  allBunkerStockReports: any[] = [];
  totalDataCount: any;
  search = '';
  searchSubject: Subject<any> = new Subject<any>();
  localUser: any;
  isAdmin: any;

  constructor(
    private fb: FormBuilder,
    private httpRequestService: HttpRequestService,
    private notificationService: NzNotificationService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private msg: NzMessageService,
    private configurationService: ConfigurationService,
    private localStorageService: LocalStorageService
  ) {
    this.idForUpdate = this.activatedRoute.snapshot.params.id;
    this.localUser = this.localStorageService.getItem('user');
    console.log('local', this.localUser);
    this.isAdmin = this.localUser.Role === 'admin';
    this.robReportForm = this.fb.group({
      IMO_No: [null],
      Report_Type: [null],
      // Measurement Data
      ROB_Report_Date: [null, [Validators.required]],
      ROB_Report_AddComments: [null],

      // Fuel Oil Tanks
      ROB_Report_Fuel_Tank_01: [
        null,
        this.rangeValidator(0, this.localUser.ROB_Report_Fuel_Tank_01_Capacity),
      ],
      ROB_Report_Fuel_Tank_01_Temp: [null, this.rangeValidator(0, 999.99)],
      ROB_Report_Fuel_Tank_01_Type: [null],
      ROB_Report_Fuel_Tank_02: [
        null,
        this.rangeValidator(0, this.localUser.ROB_Report_Fuel_Tank_02_Capacity),
      ],
      ROB_Report_Fuel_Tank_02_Temp: [null, this.rangeValidator(0, 999.99)],
      ROB_Report_Fuel_Tank_02_Type: [null],
      ROB_Report_Fuel_Tank_03: [
        null,
        this.rangeValidator(0, this.localUser.ROB_Report_Fuel_Tank_03_Capacity),
      ],
      ROB_Report_Fuel_Tank_03_Temp: [null, this.rangeValidator(0, 999.99)],
      ROB_Report_Fuel_Tank_03_Type: [null],
      ROB_Report_Fuel_Tank_04: [
        null,
        this.rangeValidator(0, this.localUser.ROB_Report_Fuel_Tank_04_Capacity),
      ],
      ROB_Report_Fuel_Tank_04_Temp: [null, this.rangeValidator(0, 999.99)],
      ROB_Report_Fuel_Tank_04_Type: [null],
      ROB_Report_Fuel_Tank_05: [
        null,
        this.rangeValidator(0, this.localUser.ROB_Report_Fuel_Tank_05_Capacity),
      ],
      ROB_Report_Fuel_Tank_05_Temp: [null, this.rangeValidator(0, 999.99)],
      ROB_Report_Fuel_Tank_05_Type: [null],
      ROB_Report_Fuel_Tank_06: [
        null,
        this.rangeValidator(0, this.localUser.ROB_Report_Fuel_Tank_06_Capacity),
      ],
      ROB_Report_Fuel_Tank_06_Temp: [null, this.rangeValidator(0, 999.99)],
      ROB_Report_Fuel_Tank_06_Type: [null],
      ROB_Report_Fuel_Tank_07: [
        null,
        this.rangeValidator(0, this.localUser.ROB_Report_Fuel_Tank_07_Capacity),
      ],
      ROB_Report_Fuel_Tank_07_Temp: [null, this.rangeValidator(0, 999.99)],
      ROB_Report_Fuel_Tank_07_Type: [null],
      ROB_Report_Fuel_Tank_08: [
        null,
        this.rangeValidator(0, this.localUser.ROB_Report_Fuel_Tank_08_Capacity),
      ],
      ROB_Report_Fuel_Tank_08_Temp: [null, this.rangeValidator(0, 999.99)],
      ROB_Report_Fuel_Tank_08_Type: [null],
      ROB_Report_Fuel_Tank_09: [
        null,
        this.rangeValidator(0, this.localUser.ROB_Report_Fuel_Tank_09_Capacity),
      ],
      ROB_Report_Fuel_Tank_09_Temp: [null, this.rangeValidator(0, 999.99)],
      ROB_Report_Fuel_Tank_09_Type: [null],
      ROB_Report_Fuel_Tank_10: [
        null,
        this.rangeValidator(0, this.localUser.ROB_Report_Fuel_Tank_10_Capacity),
      ],
      ROB_Report_Fuel_Tank_10_Temp: [null, this.rangeValidator(0, 999.99)],
      ROB_Report_Fuel_Tank_10_Type: [null],
      ROB_Report_Fuel_Tank_11: [
        null,
        this.rangeValidator(0, this.localUser.ROB_Report_Fuel_Tank_11_Capacity),
      ],
      ROB_Report_Fuel_Tank_11_Temp: [null, this.rangeValidator(0, 999.99)],
      ROB_Report_Fuel_Tank_11_Type: [null],

      // MGO / MDO Tanks
      ROB_Report_Diesel_Oil_Tank_01: [
        null,
        this.rangeValidator(
          0,
          this.localUser.ROB_Report_Diesel_Oil_Tank_01_Capacity
        ),
      ],
      ROB_Report_Diesel_Oil_Tank_01_Temp: [
        null,
        this.rangeValidator(0, 999.99),
      ],
      ROB_Report_Diesel_Oil_Tank_01_Type: [null],
      ROB_Report_Diesel_Oil_Tank_02: [
        null,
        this.rangeValidator(
          0,
          this.localUser.ROB_Report_Diesel_Oil_Tank_02_Capacity
        ),
      ],
      ROB_Report_Diesel_Oil_Tank_02_Temp: [
        null,
        this.rangeValidator(0, 999.99),
      ],
      ROB_Report_Diesel_Oil_Tank_02_Type: [null],
      ROB_Report_Diesel_Oil_Tank_03: [
        null,
        this.rangeValidator(
          0,
          this.localUser.ROB_Report_Diesel_Oil_Tank_03_Capacity
        ),
      ],
      ROB_Report_Diesel_Oil_Tank_03_Temp: [
        null,
        this.rangeValidator(0, 999.99),
      ],
      ROB_Report_Diesel_Oil_Tank_03_Type: [null],
      ROB_Report_Diesel_Oil_Tank_04: [
        null,
        this.rangeValidator(
          0,
          this.localUser.ROB_Report_Diesel_Oil_Tank_04_Capacity
        ),
      ],
      ROB_Report_Diesel_Oil_Tank_04_Temp: [
        null,
        this.rangeValidator(0, 999.99),
      ],
      ROB_Report_Diesel_Oil_Tank_04_Type: [null],

      // Misc. Fuel Tanks
      ROB_Report_Miscellaneous_Oil_Tanks_01: [
        null,
        this.rangeValidator(
          0,
          this.localUser.ROB_Report_Miscellaneous_Oil_Tanks_01_Capacity
        ),
      ],
      ROB_Report_Miscellaneous_Oil_Tanks_01_Temp: [
        null,
        this.rangeValidator(0, 999.99),
      ],
      ROB_Report_Miscellaneous_Oil_Tanks_01_Type: [null],
      ROB_Report_Miscellaneous_Oil_Tanks_02: [
        null,
        this.rangeValidator(
          0,
          this.localUser.ROB_Report_Miscellaneous_Oil_Tanks_02_Capacity
        ),
      ],
      ROB_Report_Miscellaneous_Oil_Tanks_02_Temp: [
        null,
        this.rangeValidator(0, 999.99),
      ],
      ROB_Report_Miscellaneous_Oil_Tanks_02_Type: [null],
      ROB_Report_Miscellaneous_Oil_Tanks_03: [
        null,
        this.rangeValidator(
          0,
          this.localUser.ROB_Report_Miscellaneous_Oil_Tanks_03_Capacity
        ),
      ],
      ROB_Report_Miscellaneous_Oil_Tanks_03_Temp: [
        null,
        this.rangeValidator(0, 999.99),
      ],
      ROB_Report_Miscellaneous_Oil_Tanks_03_Type: [null],
      ROB_Report_Miscellaneous_Oil_Tanks_04: [
        null,
        this.rangeValidator(
          0,
          this.localUser.ROB_Report_Miscellaneous_Oil_Tanks_04_Capacity
        ),
      ],
      ROB_Report_Miscellaneous_Oil_Tanks_04_Temp: [
        null,
        this.rangeValidator(0, 999.99),
      ],
      ROB_Report_Miscellaneous_Oil_Tanks_04_Type: [null],
      ROB_Report_Miscellaneous_Oil_Tanks_05: [
        null,
        this.rangeValidator(
          0,
          this.localUser.ROB_Report_Miscellaneous_Oil_Tanks_05_Capacity
        ),
      ],
      ROB_Report_Miscellaneous_Oil_Tanks_05_Temp: [
        null,
        this.rangeValidator(0, 999.99),
      ],
      ROB_Report_Miscellaneous_Oil_Tanks_05_Type: [null],

      // Lub. Oil ROB

      ROB_Report_Lubrication_Oil_Tanks_1: [null],
      ROB_Report_Lubrication_Oil_Tanks_2: [null],
      ROB_Report_Lubrication_Oil_Tanks_3: [null],
      ROB_Report_Lubrication_Oil_Tanks_4: [null],

      // Total fuel tank

      //fuel_tank_no_1_p: [null],
      ROB_Report_Fuel_Tank_01_Capacity: [
        this.localUser.ROB_Report_Fuel_Tank_01_Capacity,
      ],
      ROB_Report_Fuel_Tank_02_Capacity: [
        this.localUser.ROB_Report_Fuel_Tank_02_Capacity,
      ],
      ROB_Report_Fuel_Tank_03_Capacity: [
        this.localUser.ROB_Report_Fuel_Tank_03_Capacity,
      ],
      ROB_Report_Fuel_Tank_04_Capacity: [
        this.localUser.ROB_Report_Fuel_Tank_04_Capacity,
      ],
      ROB_Report_Fuel_Tank_05_Capacity: [
        this.localUser.ROB_Report_Fuel_Tank_05_Capacity,
      ],
      ROB_Report_Fuel_Tank_06_Capacity: [
        this.localUser.ROB_Report_Fuel_Tank_06_Capacity,
      ],
      ROB_Report_Fuel_Tank_07_Capacity: [
        this.localUser.ROB_Report_Fuel_Tank_07_Capacity,
      ],
      ROB_Report_Fuel_Tank_08_Capacity: [
        this.localUser.ROB_Report_Fuel_Tank_08_Capacity,
      ],
      ROB_Report_Fuel_Tank_09_Capacity: [
        this.localUser.ROB_Report_Fuel_Tank_09_Capacity,
      ],
      ROB_Report_Fuel_Tank_10_Capacity: [
        this.localUser.ROB_Report_Fuel_Tank_10_Capacity,
      ],
      ROB_Report_Fuel_Tank_11_Capacity: [
        this.localUser.ROB_Report_Fuel_Tank_11_Capacity,
      ],

      // MGO / MDO Tanks
      ROB_Report_Diesel_Oil_Tank_01_Capacity: [
        this.localUser.ROB_Report_Diesel_Oil_Tank_01_Capacity,
      ],
      ROB_Report_Diesel_Oil_Tank_02_Capacity: [
        this.localUser.ROB_Report_Diesel_Oil_Tank_02_Capacity,
      ],
      ROB_Report_Diesel_Oil_Tank_03_Capacity: [
        this.localUser.ROB_Report_Diesel_Oil_Tank_03_Capacity,
      ],
      ROB_Report_Diesel_Oil_Tank_04_Capacity: [
        this.localUser.ROB_Report_Diesel_Oil_Tank_04_Capacity,
      ],

      // misc tank total
      ROB_Report_Miscellaneous_Oil_Tanks_01_Capacity: [
        this.localUser.ROB_Report_Miscellaneous_Oil_Tanks_01_Capacity,
      ],
      ROB_Report_Miscellaneous_Oil_Tanks_02_Capacity: [
        this.localUser.ROB_Report_Miscellaneous_Oil_Tanks_02_Capacity,
      ],
      ROB_Report_Miscellaneous_Oil_Tanks_03_Capacity: [
        this.localUser.ROB_Report_Miscellaneous_Oil_Tanks_03_Capacity,
      ],
      ROB_Report_Miscellaneous_Oil_Tanks_04_Capacity: [
        this.localUser.ROB_Report_Miscellaneous_Oil_Tanks_04_Capacity,
      ],
      ROB_Report_Miscellaneous_Oil_Tanks_05_Capacity: [
        this.localUser.ROB_Report_Miscellaneous_Oil_Tanks_05_Capacity,
      ],

      // supply vessel
      ROB_Report_Supply_Vessel_Tank_01: [null],
      ROB_Report_Supply_Vessel_Tank_02: [null],
      ROB_Report_Supply_Vessel_Tank_03: [null],
      ROB_Report_Supply_Vessel_Tank_04: [null],
      ROB_Report_Supply_Vessel_Tank_05: [null],
      ROB_Report_Supply_Vessel_Tank_06: [null],

      fuel_tank_no_1_p_total: [1556.98],
      fuel_tank_no_2_p_total: [2149.13],
      fuel_tank_no_3_p_total: [2149.13],
      fuel_tank_no_4_p_total: [1145.27],
      fuel_tank_no_5_p_total: [1102.66],
      fuel_tank_no_6_p_total: [1102.66],
      fuel_tank_no_7_p_total: [93.63],
      fuel_tank_no_8_p_total: [51.35],
      fuel_tank_no_9_p_total: [91.67],
      fuel_tank_no_10_p_total: [51.25],
      fuel_tank_no_11_p_total: [14.49],

      // Total mgo  tank
      mgo_tank_no_1_total: [436.25],
      mgo_tank_no_2_total: [436.25],
      mgo_tank_no_3_total: [84.22],
      mgo_tank_no_4_total: [50.89],
      // aal brisbane
      mgo_tank_no_1_total_brisbane: [142.6],
      mgo_tank_no_2_total_brisbane: [21.7],
      mgo_tank_no_3_total_brisbane: [20.3],

      // front samera
      mgo_tank_no_1_total_samera: [322.9],
      mgo_tank_no_2_total_samera: [173.3],
      mgo_tank_no_3_total_samera: [459.3],
      mgo_tank_no_4_total_samera: [56.3],

      // Total Misc tank

      misc_tank_no_1_total: [92.3],
      misc_tank_no_2_total: [7.02],
      misc_tank_no_3_total: [7.02],
      misc_tank_no_4_total: [3.49],
      misc_tank_no_5_total: [2.47],
      fuel_tank_temp1: [80],

      // aal brisbane
      misc_tank_no_1_total_brisbane: [31.6],
      misc_tank_no_2_total_brisbane: [29.4],
      misc_tank_no_3_total_brisbane: [4.9],
      misc_tank_no_4_total_brisbane: [21],
      misc_tank_no_5_total_brisbane: [6],

      // front samera
      misc_tank_no_1_total_samera: [23.5],
      misc_tank_no_2_total_samera: [9.1],
      misc_tank_no_3_total_samera: [2.09],

      // fuel_tank_no_1_port: [null],
      // Fuel_Grade_dropdown: [null],
      // Viscosity_At_50_Degree_Celcius: [null],
      // Density_At_15_Degree_Celcius: [null],
      // Sulphur_Percentage_In_Bunkered_Fuel: [null],
      // Water_Percentage_In_Bunkered_Fuel: [null],
      // CAT_Fines_AL_Si_Percentage_In_Bunkered_Fuel: [null],
      // Grade_Of_Fuel_Bunkered: [null],
      // Quantity_Of_Fuel_Bunkered: [null],
      // Date_Of_Fuel_Bunkered: [null],
      // Start_Time_Of_Fuel_Bunkered: [null],
      // End_Time_Of_Fuel_Bunkered: [null],
      // Barge_Name_Of_Fuel_Bunkered: [null],
      // Location_Of_Fuel_Bunkered: [null],
      // Additional_Comments_Of_Fuel_Bunkered: [null],
      //fuel_type: [],
    });
  }

  ngOnInit(): void {
    this.getBunkerStcokDetails();
    if (this.idForUpdate) {
      console.log('in edit mode');
      this.getRobReportById();
    }
  }

  /* get bunker stock details */
  getBunkerStcokDetails(): void {
    this.httpRequestService.request('get', 'bunker-reports').subscribe(
      (result) => {
        console.log(result);

        this.allBunkerStockReports = result.data;
        this.totalDataCount = result.totalCount;
      },
      (err) => {
        this.loading = false;
      }
    );
  }
  /* get by id */
  getRobReportById(): void {
    this.httpRequestService
      .request('get', `rob-reports/${this.idForUpdate}`)
      .subscribe(
        (result: any) => {
          this.robReportForm.patchValue(result.data);

          if (result.data.ROB_Report_Fuel_Tank_01_Type) {
            this.robReportForm.patchValue({
              ROB_Report_Fuel_Tank_01_Type:
                result.data.ROB_Report_Fuel_Tank_01_Type._id,
            });
          }
          if (result.data.ROB_Report_Fuel_Tank_02_Type) {
            this.robReportForm.patchValue({
              ROB_Report_Fuel_Tank_02_Type:
                result.data.ROB_Report_Fuel_Tank_02_Type._id,
            });
          }
          if (result.data.ROB_Report_Fuel_Tank_03_Type) {
            this.robReportForm.patchValue({
              ROB_Report_Fuel_Tank_03_Type:
                result.data.ROB_Report_Fuel_Tank_03_Type._id,
            });
          }
          if (result.data.ROB_Report_Fuel_Tank_04_Type) {
            this.robReportForm.patchValue({
              ROB_Report_Fuel_Tank_04_Type:
                result.data.ROB_Report_Fuel_Tank_04_Type._id,
            });
          }
          if (result.data.ROB_Report_Fuel_Tank_05_Type) {
            this.robReportForm.patchValue({
              ROB_Report_Fuel_Tank_05_Type:
                result.data.ROB_Report_Fuel_Tank_05_Type._id,
            });
          }
          if (result.data.ROB_Report_Fuel_Tank_06_Type) {
            this.robReportForm.patchValue({
              ROB_Report_Fuel_Tank_06_Type:
                result.data.ROB_Report_Fuel_Tank_06_Type._id,
            });
          }
          if (result.data.ROB_Report_Fuel_Tank_07_Type) {
            this.robReportForm.patchValue({
              ROB_Report_Fuel_Tank_07_Type:
                result.data.ROB_Report_Fuel_Tank_07_Type._id,
            });
          }
          if (result.data.ROB_Report_Fuel_Tank_08_Type) {
            this.robReportForm.patchValue({
              ROB_Report_Fuel_Tank_08_Type:
                result.data.ROB_Report_Fuel_Tank_08_Type._id,
            });
          }
          if (result.data.ROB_Report_Fuel_Tank_09_Type) {
            this.robReportForm.patchValue({
              ROB_Report_Fuel_Tank_09_Type:
                result.data.ROB_Report_Fuel_Tank_09_Type._id,
            });
          }
          if (result.data.ROB_Report_Fuel_Tank_10_Type) {
            this.robReportForm.patchValue({
              ROB_Report_Fuel_Tank_10_Type:
                result.data.ROB_Report_Fuel_Tank_10_Type._id,
            });
          }
          if (result.data.ROB_Report_Fuel_Tank_11_Type) {
            this.robReportForm.patchValue({
              ROB_Report_Fuel_Tank_11_Type:
                result.data.ROB_Report_Fuel_Tank_11_Type._id,
            });
          }

          if (result.data.ROB_Report_Diesel_Oil_Tank_01_Type) {
            this.robReportForm.patchValue({
              ROB_Report_Diesel_Oil_Tank_01_Type:
                result.data.ROB_Report_Diesel_Oil_Tank_01_Type._id,
            });
          }
          if (result.data.ROB_Report_Diesel_Oil_Tank_02_Type) {
            this.robReportForm.patchValue({
              ROB_Report_Diesel_Oil_Tank_02_Type:
                result.data.ROB_Report_Diesel_Oil_Tank_02_Type._id,
            });
          }
          if (result.data.ROB_Report_Diesel_Oil_Tank_03_Type) {
            this.robReportForm.patchValue({
              ROB_Report_Diesel_Oil_Tank_03_Type:
                result.data.ROB_Report_Diesel_Oil_Tank_03_Type._id,
            });
          }
          if (result.data.ROB_Report_Diesel_Oil_Tank_04_Type) {
            this.robReportForm.patchValue({
              ROB_Report_Diesel_Oil_Tank_04_Type:
                result.data.ROB_Report_Diesel_Oil_Tank_04_Type._id,
            });
          }

          if (result.data.ROB_Report_Miscellaneous_Oil_Tanks_01_Type) {
            this.robReportForm.patchValue({
              ROB_Report_Miscellaneous_Oil_Tanks_01_Type:
                result.data.ROB_Report_Miscellaneous_Oil_Tanks_01_Type._id,
            });
          }
          if (result.data.ROB_Report_Miscellaneous_Oil_Tanks_02_Type) {
            this.robReportForm.patchValue({
              ROB_Report_Miscellaneous_Oil_Tanks_02_Type:
                result.data.ROB_Report_Miscellaneous_Oil_Tanks_02_Type._id,
            });
          }
          if (result.data.ROB_Report_Miscellaneous_Oil_Tanks_03_Type) {
            this.robReportForm.patchValue({
              ROB_Report_Miscellaneous_Oil_Tanks_03_Type:
                result.data.ROB_Report_Miscellaneous_Oil_Tanks_03_Type._id,
            });
          }
          if (result.data.ROB_Report_Miscellaneous_Oil_Tanks_04_Type) {
            this.robReportForm.patchValue({
              ROB_Report_Miscellaneous_Oil_Tanks_04_Type:
                result.data.ROB_Report_Miscellaneous_Oil_Tanks_04_Type._id,
            });
          }
          if (result.data.ROB_Report_Miscellaneous_Oil_Tanks_05_Type) {
            this.robReportForm.patchValue({
              ROB_Report_Miscellaneous_Oil_Tanks_05_Type:
                result.data.ROB_Report_Miscellaneous_Oil_Tanks_05_Type._id,
            });
          }
        },
        (error: any) => {}
      );
  }

  /* Submit  form */
  submit(): void {
    this.robReportForm.patchValue({
      IMO_No: this.localUser.IMO_No,
      Report_Type: 'ROB report',
    });
    if (!this.robReportForm.valid) {
      this.markFormGroupTouched(this.robReportForm);
    } else {
      if (this.idForUpdate) {
        this.addOrUpdateRobReport(
          'put',
          `rob-reports/${this.idForUpdate}`,
          'ROB Report Successfully Updated'
        );
      } else {
        console.log(this.robReportForm.value);
        this.addOrUpdateRobReport(
          'post',
          'rob-reports',
          'ROB Report Added Successfully '
        );
      }
    }
  }

  /* Add Or Edit Bunker stock Report */
  addOrUpdateRobReport(
    requestMethod: string,
    requestURL: string,
    successMessage: string
  ): void {
    this.buttonLoading = true;
    this.httpRequestService
      .request(requestMethod, requestURL, this.robReportForm.value)
      .subscribe(
        (result: any) => {
          this.notificationService.success('', successMessage);
          this.router.navigateByUrl('/main/bunker-stock-report/rob-report');
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

  // seach Examination
  searchSubjectForDropdown(event: any): void {
    this.searchSubject.next(event);
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
