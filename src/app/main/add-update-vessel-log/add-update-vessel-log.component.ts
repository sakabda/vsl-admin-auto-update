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
import { timeZoneData } from '../machinery-reporting/add-update-daily-report-at-sea/timezone.data';
import { LocalDatabaseService } from 'src/app/core/services/local-database.service';
import { ReportingStoreService } from 'src/app/core/services/reporting-store.service';
import { CommonAPIService } from 'src/app/core/services/common-api.service';

@Component({
  selector: 'app-add-update-vessel-log',
  templateUrl: './add-update-vessel-log.component.html',
  styleUrls: ['./add-update-vessel-log.component.scss'],
})
export class AddUpdateVesselLogComponent implements OnInit {
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
  fileObject: any;
  imgLoading = false;
  avatarUrl = '';
  mediaPreviewUrl: any;
  extraForService: any[] = [];
  launchService: any = [];

  // new
  extraForDeckDept: any[] = [];
  extraForEngineDept: any[] = [];
  extraForAddInfo: any[] = [];

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
      DailyRept_AtPort_IMO_No: [null],
      Report_Type: [null],

      // Vessel logs (Time Period)
      DailyLogs_VslActivity_StartDate: [null, [Validators.required]],
      DailyLogs_VslActivity_StartTime: [null, [Validators.required]],
      DailyLogs_VslActivity_EndDate: [null, [Validators.required]],
      DailyLogs_VslActivity_EndTime: [null, [Validators.required]],

      // Vessel logs (vessel status )
      DailyLogs_VslActivity_VesselStatus_Time: [null],
      DailyLogs_VslActivity_VesselStatus_Activity: [
        null,
        [Validators.required],
      ],
      DailyLogs_VslActivity_VesselStatus_AddComments: [null],

      // Vessel logs (Deck Dept.)
      //DailyLogs_VslActivity_LaunchService: this.fb.array([]),

      DailyLogs_VslActivity_DeckDept: this.fb.array([]),
      // Vessel logs (Engine Dept.)
      DailyLogs_VslActivity_EngineDept: this.fb.array([]),
      // Vessel logs (Add. Info)
      DailyLogs_VslActivity_AddInfo: this.fb.array([]),

      _rev: [null],
      createdAt: [null],
    });
    this.mediaUploadUrl = configurationService.apiUrl + '/api/media';
  }

  ngOnInit(): void {
    this.addUpdateDailyReportReportForm.patchValue({
      // DailyRept_AtPort_IMO_No: this.localUser.IMO_No,
      Report_Type: 'Vessel Log',
      createdAt: new Date(),
    });

    if (this.idForUpdate) {
      this.getDailyReportById();
    } else {
      //this.addService();
      // deck dept
      this.addDeckDept();
      // eng dept
      this.addEngineDept();
      // add info
      this.addInfo();
    }
  }

  // /* get by id */
  getDailyReportById(): void {
    this.httpRequestService
      .request('get', `vessel-logs/${this.idForUpdate}`)
      .subscribe(
        (result) => {
          //this.launchService = result.data;

          // this.launchService.DailyLogs_VslActivity_LaunchService?.forEach(
          //   (element: any) => {
          //     console.log('element', element);
          //     this.optionsFormArray.push(this.createOption(element));
          //     this.extraForService.push({
          //       imgLoading: false,
          //       fileUrl:
          //         this.configurationService.mediaBaseUrl +
          //         element.DailyLogs_VslActivity_LaunchService_Attachment?.path,
          //       originalname:
          //         element.DailyLogs_VslActivity_LaunchService_Attachment
          //           ?.originalname,
          //     });
          //   }
          // );
          // deck dept
          result.data.DailyLogs_VslActivity_DeckDept?.forEach(
            (element: any) => {
              console.log('element', element);
              this.optionsDeckDeptFormArray.push(
                this.createDeckDeptOption(element)
              );
              this.extraForDeckDept.push({
                imgLoading: false,
                fileUrl:
                  this.configurationService.mediaBaseUrl +
                  element.DailyLogs_VslActivity_DeckDept_Upload?.path,
                originalname:
                  element.DailyLogs_VslActivity_DeckDept_Upload?.originalname,
              });
            }
          );
          // eng dept
          result.data.DailyLogs_VslActivity_EngineDept?.forEach(
            (element: any) => {
              console.log('element', element);
              this.optionsEngineDeptFormArray.push(
                this.createEngineDeptOption(element)
              );
              this.extraForEngineDept.push({
                imgLoading: false,
                fileUrl:
                  this.configurationService.mediaBaseUrl +
                  element.DailyLogs_VslActivity_EngineDept_Upload?.path,
                originalname:
                  element.DailyLogs_VslActivity_EngineDept_Upload?.originalname,
              });
            }
          );
          // add info
          result.data.DailyLogs_VslActivity_AddInfo?.forEach((element: any) => {
            console.log('element', element);
            this.optionsAddInfoFormArray.push(
              this.createAddInfoOption(element)
            );
            this.extraForAddInfo.push({
              imgLoading: false,
              fileUrl:
                this.configurationService.mediaBaseUrl +
                element.DailyLogs_VslActivity_AddInfo_Upload?.path,
              originalname:
                element.DailyLogs_VslActivity_AddInfo_Upload?.originalname,
            });
          });

          this.addUpdateDailyReportReportForm.patchValue({
            // Vessel logs (Time Period)
            DailyLogs_VslActivity_StartDate:
              result.data.DailyLogs_VslActivity_StartDate,
            DailyLogs_VslActivity_StartTime:
              result.data.DailyLogs_VslActivity_StartTime,
            DailyLogs_VslActivity_EndDate:
              result.data.DailyLogs_VslActivity_EndDate,
            DailyLogs_VslActivity_EndTime:
              result.data.DailyLogs_VslActivity_EndTime,

            // Vessel logs (Launch status )
            DailyLogs_VslActivity_VesselStatus_Time:
              result.data.DailyLogs_VslActivity_VesselStatus_Time,
            DailyLogs_VslActivity_VesselStatus_Activity:
              result.data.DailyLogs_VslActivity_VesselStatus_Activity,
            DailyLogs_VslActivity_VesselStatus_AddComments:
              result.data.DailyLogs_VslActivity_VesselStatus_AddComments,
          });
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
        this.addOrUpdateDailyReport(
          'put',
          `vessel-logs/${this.idForUpdate}`,
          ' Log Successfully Updated'
        );
      } else {
        console.log('submit form', this.addUpdateDailyReportReportForm.value);

        this.addOrUpdateDailyReport(
          'post',
          `vessel-logs`,
          'Daily Log Successfully Added'
        );
      }
    }
  }

  /* Add Or Edit Daily Log Report */
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
          this.router.navigateByUrl('/main/vessel-logs');
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

  // ------------  Form Array---- //

  createOption(item?: any): FormGroup {
    console.log('item file', item);
    if (item) {
      return this.fb.group({
        DailyLogs_VslActivity_LaunchService_Time: [
          item.DailyLogs_VslActivity_LaunchService_Time,
        ],
        DailyLogs_VslActivity_LaunchService_Service: [
          item.DailyLogs_VslActivity_LaunchService_Service,
        ],
        DailyLogs_VslActivity_LaunchService_AddComments: [
          item.DailyLogs_VslActivity_LaunchService_AddComments,
        ],
        DailyLogs_VslActivity_LaunchService_Attachment: [
          item.DailyLogs_VslActivity_LaunchService_Attachment?._id,
        ],
      });
    }
    return this.fb.group({
      DailyLogs_VslActivity_LaunchService_Time: [null],
      DailyLogs_VslActivity_LaunchService_Service: [null],
      DailyLogs_VslActivity_LaunchService_AddComments: [null],
      DailyLogs_VslActivity_LaunchService_Attachment: [null],
      // title: ['', [Validators.required]],
      file: [null],
    });
  }

  // for service group form array
  get optionsFormArray(): FormArray {
    return this.addUpdateDailyReportReportForm.get(
      'DailyLogs_VslActivity_LaunchService'
    ) as FormArray;
  }

  addService(): void {
    this.optionsFormArray.push(this.createOption());
    this.addExtraService();
  }

  // Add extra service
  addExtraService(): void {
    this.extraForService.push({
      imgLoading: false,
      fileUrl: '',
      originalname: '',
    });
  }

  /** Media */
  customRequestHeaders = () => {
    return { Authorization: `Bearer ${localStorage.getItem('token')}` };
  };

  private getBase64(img: File, callback: (img: string) => void): void {
    const reader = new FileReader();
    reader.addEventListener('load', () =>
      callback(reader.result ? reader.result.toString() : '')
    );
    reader.readAsDataURL(img);
  }

  // Before media upload
  beforeServiceUpload = (
    file: NzUploadFile,
    fileList: NzUploadFile[]
  ): Observable<any> => {
    return new Observable((observer: Observer<boolean>) => {
      // const isVideo = file.type === 'video/mp4';
      // if (!isVideo) {
      //   this.msg.error('You can only upload mp4 file!');
      //   observer.complete();
      //   return;
      // }
      const isLt2M = file.size ? file.size / 1024 / 1024 < 100 : false;
      if (!isLt2M) {
        this.msg.error('File must smaller than 100MB!');
        observer.complete();
        return;
      }
      observer.next(isLt2M);
      observer.complete();
    });
  };

  // Media upload function
  handleUploadExplainService(
    info: { file: NzUploadFile },
    index: number
  ): void {
    switch (info.file.status) {
      case 'uploading':
        this.extraForService[index].imgLoading = true;
        break;
      case 'done':
        this.optionsFormArray.at(index).patchValue({
          DailyLogs_VslActivity_LaunchService_Attachment:
            info.file.response.data._id,
        });
        console.log('extra servise', this.extraForService);
        // Get this url from response in real world.
        if (info.file && info.file.originFileObj) {
          this.getBase64(info.file.originFileObj, (file: string) => {
            this.extraForService[index].imgLoading = false;
            this.extraForService[index].fileUrl =
              this.configurationService.mediaBaseUrl +
              info.file.response.data.path;
            this.extraForService[index].originalname =
              info.file.response.data.originalname;
          });
        }
        break;
      case 'error':
        this.msg.error('Network error');
        this.extraForService[index].imgLoading = false;
        break;
    }
  }

  // ------------ End Form Array---- //

  // ------------  Deck Dept Form Array---- //

  createDeckDeptOption(item?: any): FormGroup {
    console.log('item file', item);
    if (item) {
      return this.fb.group({
        DailyLogs_VslActivity_DeckDept_Time: [
          item.DailyLogs_VslActivity_DeckDept_Time,
        ],
        DailyLogs_VslActivity_DeckDept_Activity: [
          item.DailyLogs_VslActivity_DeckDept_Activity,
        ],

        DailyLogs_VslActivity_DeckDept_Upload: [
          item.DailyLogs_VslActivity_DeckDept_Upload?._id,
        ],
      });
    }
    return this.fb.group({
      DailyLogs_VslActivity_DeckDept_Time: [null],
      DailyLogs_VslActivity_DeckDept_Activity: [null],
      DailyLogs_VslActivity_DeckDept_Upload: [null],
      // title: ['', [Validators.required]],
      file: [null],
    });
  }

  // for deck dept group form array
  get optionsDeckDeptFormArray(): FormArray {
    return this.addUpdateDailyReportReportForm.get(
      'DailyLogs_VslActivity_DeckDept'
    ) as FormArray;
  }

  addDeckDept(): void {
    this.optionsDeckDeptFormArray.push(this.createDeckDeptOption());
    this.addExtraDeckDept();
  }

  // Add extra deck dept
  addExtraDeckDept(): void {
    this.extraForDeckDept.push({
      imgLoading: false,
      fileUrl: '',
      originalname: '',
    });
  }

  // Before deck dept media upload
  beforeDeckDeptUpload = (
    file: NzUploadFile,
    fileList: NzUploadFile[]
  ): Observable<any> => {
    return new Observable((observer: Observer<boolean>) => {
      // const isVideo = file.type === 'video/mp4';
      // if (!isVideo) {
      //   this.msg.error('You can only upload mp4 file!');
      //   observer.complete();
      //   return;
      // }
      const isLt2M = file.size ? file.size / 1024 / 1024 < 100 : false;
      if (!isLt2M) {
        this.msg.error('File must smaller than 100MB!');
        observer.complete();
        return;
      }
      observer.next(isLt2M);
      observer.complete();
    });
  };

  // Media deck dept upload function
  handleUploadExplainDeckDept(
    info: { file: NzUploadFile },
    index: number
  ): void {
    switch (info.file.status) {
      case 'uploading':
        this.extraForDeckDept[index].imgLoading = true;
        break;
      case 'done':
        this.optionsDeckDeptFormArray.at(index).patchValue({
          DailyLogs_VslActivity_DeckDept_Upload: info.file.response.data._id,
        });
        console.log('extra deck dept', this.extraForDeckDept);
        // Get this url from response in real world.
        if (info.file && info.file.originFileObj) {
          this.getBase64(info.file.originFileObj, (file: string) => {
            this.extraForDeckDept[index].imgLoading = false;
            this.extraForDeckDept[index].fileUrl =
              this.configurationService.mediaBaseUrl +
              info.file.response.data.path;
            this.extraForDeckDept[index].originalname =
              info.file.response.data.originalname;
          });
        }
        break;
      case 'error':
        this.msg.error('Network error');
        this.extraForDeckDept[index].imgLoading = false;
        break;
    }
  }

  // ------------ End Deck Dept Form Array---- //

  // ------------  Engine Dept Form Array---- //

  createEngineDeptOption(item?: any): FormGroup {
    console.log('item file', item);
    if (item) {
      return this.fb.group({
        DailyLogs_VslActivity_EngineDept_Time: [
          item.DailyLogs_VslActivity_EngineDept_Time,
        ],
        DailyLogs_VslActivity_EngineDept_Activity: [
          item.DailyLogs_VslActivity_EngineDept_Activity,
        ],

        DailyLogs_VslActivity_EngineDept_Upload: [
          item.DailyLogs_VslActivity_EngineDept_Upload?._id,
        ],
      });
    }
    return this.fb.group({
      DailyLogs_VslActivity_EngineDept_Time: [null],
      DailyLogs_VslActivity_EngineDept_Activity: [null],
      DailyLogs_VslActivity_EngineDept_Upload: [null],
      // title: ['', [Validators.required]],
      file: [null],
    });
  }

  // for eng dept group form array
  get optionsEngineDeptFormArray(): FormArray {
    return this.addUpdateDailyReportReportForm.get(
      'DailyLogs_VslActivity_EngineDept'
    ) as FormArray;
  }

  addEngineDept(): void {
    this.optionsEngineDeptFormArray.push(this.createEngineDeptOption());
    this.addExtraEngineDept();
  }

  // Add extra eng dept
  addExtraEngineDept(): void {
    this.extraForEngineDept.push({
      imgLoading: false,
      fileUrl: '',
      originalname: '',
    });
  }

  // Before eng dept media upload
  beforeEngineDeptUpload = (
    file: NzUploadFile,
    fileList: NzUploadFile[]
  ): Observable<any> => {
    return new Observable((observer: Observer<boolean>) => {
      // const isVideo = file.type === 'video/mp4';
      // if (!isVideo) {
      //   this.msg.error('You can only upload mp4 file!');
      //   observer.complete();
      //   return;
      // }
      const isLt2M = file.size ? file.size / 1024 / 1024 < 100 : false;
      if (!isLt2M) {
        this.msg.error('File must smaller than 100MB!');
        observer.complete();
        return;
      }
      observer.next(isLt2M);
      observer.complete();
    });
  };

  // Media eng dept upload function
  handleUploadExplainEngineDept(
    info: { file: NzUploadFile },
    index: number
  ): void {
    switch (info.file.status) {
      case 'uploading':
        this.extraForEngineDept[index].imgLoading = true;
        break;
      case 'done':
        this.optionsEngineDeptFormArray.at(index).patchValue({
          DailyLogs_VslActivity_EngineDept_Upload: info.file.response.data._id,
        });
        console.log('extra eng dept', this.extraForEngineDept);
        // Get this url from response in real world.
        if (info.file && info.file.originFileObj) {
          this.getBase64(info.file.originFileObj, (file: string) => {
            this.extraForEngineDept[index].imgLoading = false;
            this.extraForEngineDept[index].fileUrl =
              this.configurationService.mediaBaseUrl +
              info.file.response.data.path;
            this.extraForEngineDept[index].originalname =
              info.file.response.data.originalname;
          });
        }
        break;
      case 'error':
        this.msg.error('Network error');
        this.extraForEngineDept[index].imgLoading = false;
        break;
    }
  }

  // ------------ End Engine Dept Form Array---- //

  // ------------  Add Info Form Array---- //

  createAddInfoOption(item?: any): FormGroup {
    console.log('item file', item);
    if (item) {
      return this.fb.group({
        DailyLogs_VslActivity_AddInfo_Time: [
          item.DailyLogs_VslActivity_AddInfo_Time,
        ],
        DailyLogs_VslActivity_AddInfo_Activity: [
          item.DailyLogs_VslActivity_AddInfo_Activity,
        ],

        DailyLogs_VslActivity_AddInfo_Upload: [
          item.DailyLogs_VslActivity_AddInfo_Upload?._id,
        ],
      });
    }
    return this.fb.group({
      DailyLogs_VslActivity_AddInfo_Time: [null],
      DailyLogs_VslActivity_AddInfo_Activity: [null],
      DailyLogs_VslActivity_AddInfo_Upload: [null],
      // title: ['', [Validators.required]],
      file: [null],
    });
  }

  // for add info group form array
  get optionsAddInfoFormArray(): FormArray {
    return this.addUpdateDailyReportReportForm.get(
      'DailyLogs_VslActivity_AddInfo'
    ) as FormArray;
  }

  addInfo(): void {
    this.optionsAddInfoFormArray.push(this.createAddInfoOption());
    this.addExtraAddInfo();
  }

  // Add extra add info
  addExtraAddInfo(): void {
    this.extraForAddInfo.push({
      imgLoading: false,
      fileUrl: '',
      originalname: '',
    });
  }

  // Before add info media upload
  beforeAddInfoUpload = (
    file: NzUploadFile,
    fileList: NzUploadFile[]
  ): Observable<any> => {
    return new Observable((observer: Observer<boolean>) => {
      // const isVideo = file.type === 'video/mp4';
      // if (!isVideo) {
      //   this.msg.error('You can only upload mp4 file!');
      //   observer.complete();
      //   return;
      // }
      const isLt2M = file.size ? file.size / 1024 / 1024 < 100 : false;
      if (!isLt2M) {
        this.msg.error('File must smaller than 100MB!');
        observer.complete();
        return;
      }
      observer.next(isLt2M);
      observer.complete();
    });
  };

  // Media add info upload function
  handleUploadExplainAddInfo(
    info: { file: NzUploadFile },
    index: number
  ): void {
    switch (info.file.status) {
      case 'uploading':
        this.extraForAddInfo[index].imgLoading = true;
        break;
      case 'done':
        this.optionsAddInfoFormArray.at(index).patchValue({
          DailyLogs_VslActivity_AddInfo_Upload: info.file.response.data._id,
        });
        console.log('extra add info', this.extraForAddInfo);
        // Get this url from response in real world.
        if (info.file && info.file.originFileObj) {
          this.getBase64(info.file.originFileObj, (file: string) => {
            this.extraForAddInfo[index].imgLoading = false;
            this.extraForAddInfo[index].fileUrl =
              this.configurationService.mediaBaseUrl +
              info.file.response.data.path;
            this.extraForAddInfo[index].originalname =
              info.file.response.data.originalname;
          });
        }
        break;
      case 'error':
        this.msg.error('Network error');
        this.extraForAddInfo[index].imgLoading = false;
        break;
    }
  }

  // ------------ End Add Info Form Array---- //
}
