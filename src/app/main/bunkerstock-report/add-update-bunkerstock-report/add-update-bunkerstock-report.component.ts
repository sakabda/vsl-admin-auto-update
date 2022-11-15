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
  selector: 'app-add-update-bunkerstock-report',
  templateUrl: './add-update-bunkerstock-report.component.html',
  styleUrls: ['./add-update-bunkerstock-report.component.scss'],
})
export class AddUpdateBunkerstockReportComponent implements OnInit {
  addUpdateBunkerstockReportForm: FormGroup;
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
    this.addUpdateBunkerstockReportForm = this.fb.group({
      vesselDetails: this.fb.group({
        vesselName: [null, [Validators.required]],
        imo: [null, [Validators.required, Validators.pattern(/^\d{7}$/)]],
      }),
      bunkerStock: this.fb.group({
        reportDate: [null],
        reportTime: [null],
        bunkerDetails: this.fb.array([]),
      }),
      clearing: this.fb.group({
        currentFuelType: [null],
        newFuelType: [null],
        accessToTank: [null],
        chemicals: [null],
        brand: [null],
        amount: [null],
        cost: [null],
        startDosing: [null],
        endDosing: [null],
        startOfGasFree: [null],
        endOfGasFree: [null],
        manual: [null],
        ra: [null],
        comments: [null],
      }),
      compliantFuel: this.fb.group({
        compliantFuelDetails: this.fb.array([]),
      }),
      totals: this.fb.group({
        totalm3Fo: [
          null,
          [Validators.pattern('^[+]?([0-9]+.?[0-9]*|.[0-9]+)$')],
        ],
        totalmtFo: [
          null,
          [Validators.pattern('^[+]?([0-9]+.?[0-9]*|.[0-9]+)$')],
        ],
        totalm3Vlsfo: [
          null,
          [Validators.pattern('^[+]?([0-9]+.?[0-9]*|.[0-9]+)$')],
        ],
        totalmtVlsfo: [
          null,
          [Validators.pattern('^[+]?([0-9]+.?[0-9]*|.[0-9]+)$')],
        ],
        totalm3Ulsfo: [
          null,
          [Validators.pattern('^[+]?([0-9]+.?[0-9]*|.[0-9]+)$')],
        ],
        totalmtUlsfo: [
          null,
          [Validators.pattern('^[+]?([0-9]+.?[0-9]*|.[0-9]+)$')],
        ],
        totalm3Go: [
          null,
          [Validators.pattern('^[+]?([0-9]+.?[0-9]*|.[0-9]+)$')],
        ],
        totalmtGo: [
          null,
          [Validators.pattern('^[+]?([0-9]+.?[0-9]*|.[0-9]+)$')],
        ],
        totalm3Lsgo: [
          null,
          [Validators.pattern('^[+]?([0-9]+.?[0-9]*|.[0-9]+)$')],
        ],
        totalmtLsgo: [
          null,
          [Validators.pattern('^[+]?([0-9]+.?[0-9]*|.[0-9]+)$')],
        ],
        totalm3Cyl: [
          null,
          [Validators.pattern('^[+]?([0-9]+.?[0-9]*|.[0-9]+)$')],
        ],
        totalmtCyl: [
          null,
          [Validators.pattern('^[+]?([0-9]+.?[0-9]*|.[0-9]+)$')],
        ],
        totalm3Lo: [
          null,
          [Validators.pattern('^[+]?([0-9]+.?[0-9]*|.[0-9]+)$')],
        ],
        totalmtLo: [
          null,
          [Validators.pattern('^[+]?([0-9]+.?[0-9]*|.[0-9]+)$')],
        ],
      }),
    });
    this.mediaUploadUrl = configurationService.apiUrl + '/api/media';
  }

  ngOnInit(): void {
    if (this.idForUpdate) {
      console.log('in edit mode');
    } else {
      // by default create bunkerDetailsFormArray  one element
      this.addBunkerDetails();
      this.addCompliantFuelDetails();
    }
  }

  /* Submit  form */
  submit(): void {
    if (!this.addUpdateBunkerstockReportForm.valid) {
      this.markFormGroupTouched(this.addUpdateBunkerstockReportForm);
    } else {
      if (this.idForUpdate) {
        //     //     // this.addOrUpdateQuestion(
        //     //     //   'put',
        //     //     //   `question-banks/${this.idForUpdate}`,
        //     //     //   'Question Successfully Updated'
        //     //     // );
      } else {
        console.log(this.addUpdateBunkerstockReportForm.value);
        this.addOrUpdateBunkerStockReport(
          'post',
          'bunker-stock-reports',
          'Bunker Stock Added Successfully '
        );
      }
    }
  }
  /* Add Or Edit Noon Report */
  addOrUpdateBunkerStockReport(
    requestMethod: string,
    requestURL: string,
    successMessage: string
  ): void {
    this.buttonLoading = true;
    this.httpRequestService
      .request(
        requestMethod,
        requestURL,
        this.addUpdateBunkerstockReportForm.value
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

  // ------------ Bunker Details Form Array----
  createBunker(item?: any): FormGroup {
    //console.log('item', item);
    if (item) {
      return this.fb.group({
        slNo: [item.bunkerActivity, [null]],
        side: [item.bunkerActivity, [null]],
        fuel: [item.bunkerActivity, [null]],
        grade: [item.bunkerActivity, [null]],
        capacity: [
          item.bunkerActivity,
          [null, [Validators.pattern('^[+]?([0-9]+.?[0-9]*|.[0-9]+)$')]],
        ],
        presentM3: [
          item.bunkerActivity,
          [null, [Validators.pattern('^[+]?([0-9]+.?[0-9]*|.[0-9]+)$')]],
        ],
        presentMt: [
          item.bunkerActivity,
          [null, [Validators.pattern('^[+]?([0-9]+.?[0-9]*|.[0-9]+)$')]],
        ],
        soundingCm: [
          item.bunkerActivity,
          [null, [Validators.pattern('^[+]?([0-9]+.?[0-9]*|.[0-9]+)$')]],
        ],
        remarks: [item.bunkerActivity, [null]],
        clearing: [item.bunkerActivity, [null]],
      });
    }
    return this.fb.group({
      slNo: [null],
      side: [null],
      fuel: [null],
      grade: [null],
      capacity: [null, [Validators.pattern('^[+]?([0-9]+.?[0-9]*|.[0-9]+)$')]],
      presentM3: [null, [Validators.pattern('^[+]?([0-9]+.?[0-9]*|.[0-9]+)$')]],
      presentMt: [null, [Validators.pattern('^[+]?([0-9]+.?[0-9]*|.[0-9]+)$')]],
      soundingCm: [
        null,
        [Validators.pattern('^[+]?([0-9]+.?[0-9]*|.[0-9]+)$')],
      ],
      remarks: [null],
      clearing: [null],
    });
  }

  //for bunker form array
  get bunkerDetailsFormArray(): FormArray {
    return this.addUpdateBunkerstockReportForm.controls.bunkerStock.get(
      'bunkerDetails'
    ) as FormArray;
  }
  addBunkerDetails(): void {
    this.bunkerDetailsFormArray.push(this.createBunker());
  }
  removeBunkerDetails(index: number): void {
    this.bunkerDetailsFormArray.removeAt(index);
  }

  // ------ Compliant Fuel Details Form Array---- //
  createCompliantFuel(item?: any): FormGroup {
    //console.log('item', item);
    if (item) {
      return this.fb.group({
        date: [item.date, [null]],
        fuelType: [item.fuelType, [null]],
        port: [item.port, [null]],
        remarks: [item.remarks, [null]],
      });
    }
    return this.fb.group({
      date: [null],
      fuelType: [null],
      port: [null],
      remarks: [null],
    });
  }

  //for Compliant Fuel form array
  get compliantFuelDetailsFormArray(): FormArray {
    return this.addUpdateBunkerstockReportForm.controls.compliantFuel.get(
      'compliantFuelDetails'
    ) as FormArray;
  }
  addCompliantFuelDetails(): void {
    this.compliantFuelDetailsFormArray.push(this.createCompliantFuel());
  }
  removeCompliantFuelDetails(index: number): void {
    this.compliantFuelDetailsFormArray.removeAt(index);
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
