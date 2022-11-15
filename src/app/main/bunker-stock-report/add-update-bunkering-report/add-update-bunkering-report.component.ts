import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import {
  ConfigurationService,
  HttpRequestService,
  LocalStorageService,
} from 'src/app/core/services';
import { ConnectionService } from 'ng-connection-service';
import { LocalDatabaseService } from 'src/app/core/services/local-database.service';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import { Observable, Observer } from 'rxjs';
// import { Globals } from 'src/globals';
// import { GlobalComponent } from '../../../global-component';

@Component({
  selector: 'app-add-update-bunkering-report',
  templateUrl: './add-update-bunkering-report.component.html',
  styleUrls: ['./add-update-bunkering-report.component.scss'],
})
export class AddUpdateBunkeringReportComponent implements OnInit {
  addUpdateBunkerStockReportForm!: FormGroup;
  idForUpdate!: string;
  buttonLoading = false;
  mediaUploadUrl!: string;
  time: Date | null = null;
  //defaultOpenValue = new Date(0, 0, 0, 0, 0, 0);
  reportValue: any;
  localUser: any;
  isAdmin: any;

  db: any;
  // onlineEvent!: Observable<Event>;
  // offlineEvent!: Observable<Event>;

  // subscriptions: Subscription[] = [];
  // resData: any;

  // connectionStatusMessage: string | undefined;
  // connectionStatus: string | undefined;

  isConnected = true;
  noInternetConnection!: boolean;
  imgLoading = false;
  avatarUrl = '';
  mediaPreviewUrl: any;
  fileObject: any;
  fileObject2: any;

  constructor(
    private fb: FormBuilder,
    private httpRequestService: HttpRequestService,
    private notificationService: NzNotificationService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private msg: NzMessageService,
    private configurationService: ConfigurationService,
    private localStorageService: LocalStorageService,
    private connectionService: ConnectionService,
    private localDatabaseService: LocalDatabaseService
  ) {
    this.idForUpdate = this.activatedRoute.snapshot.params.id;
    this.mediaUploadUrl = configurationService.apiUrl + '/api/media';
    this.mediaPreviewUrl = configurationService.mediaBaseUrl;
    this.localUser = this.localStorageService.getItem('user');
    console.log('localuser', this.localUser);
    this.isAdmin = this.localUser.Role === 'admin';
    this.addUpdateBunkerStockReportForm = this.fb.group({
      _id: [null],
      IMO_No: [null],
      Report_Type: [null],
      Fuel_Grade: [null],
      Fuel_Type: [null, [Validators.required]],
      Type_Of_Fuel_Bunkered: [null],
      Viscosity_At_50_Degree_Celcius: [null],
      Density_At_15_Degree_Celcius: [null],
      Sulphur_Percentage_In_Bunkered_Fuel: [null],
      Water_Percentage_In_Bunkered_Fuel: [null],
      CAT_Fines_AL_Si_Percentage_In_Bunkered_Fuel: [null],
      Grade_Of_Fuel_Bunkered: [null],
      Quantity_Of_Fuel_Bunkered: [
        null,
        [Validators.required, Validators.pattern('^[.0-9]*$')],
      ],
      //Date_Of_Fuel_Bunkered: [null],
      Start_Date_Of_Fuel_Bunkered: [null, [Validators.required]],
      End_Date_Of_Fuel_Bunkered: [null],
      Start_Time_Of_Fuel_Bunkered: [null],
      End_Time_Of_Fuel_Bunkered: [null],
      Barge_Name_Of_Fuel_Bunkered: [null],
      Location_Of_Fuel_Bunkered: [null, [Validators.required]],
      Bunker_Delivery_Note: [null],
      Fuel_Delivery_Note: [null],
      Additional_Comments_Of_Fuel_Bunkered: [null],
    });
  }

  ngOnInit(): void {
    this.connectionService.monitor().subscribe((isConnected) => {
      this.isConnected = isConnected;
      if (this.isConnected) {
        this.noInternetConnection = false;
      } else {
        this.noInternetConnection = true;
      }
    });
    // this.onlineEvent = fromEvent(window, 'online');
    // this.offlineEvent = fromEvent(window, 'offline');

    // offline

    this.addUpdateBunkerStockReportForm.patchValue({
      IMO_No: this.localUser.IMO_No,
      Report_Type: 'Bunkering report',
    });

    if (this.idForUpdate) {
      console.log('in edit mode');
      this.getBunkerStockReportById();
    }
  }

  /* get by id */
  getBunkerStockReportById(): void {
    this.httpRequestService
      .request('get', `bunker-reports/${this.idForUpdate}`)
      .subscribe(
        (result: any) => {
          // this.addUpdateBunkerStockReportForm.patchValue({
          //   Fuel_Grade: result.data.Fuel_Grade,
          //   Fuel_Type: result.data.Fuel_Type,
          //   Type_Of_Fuel_Bunkered: result.data.Type_Of_Fuel_Bunkered,
          //   Viscosity_At_50_Degree_Celcius:
          //     result.data.Viscosity_At_50_Degree_Celcius,
          //   Density_At_15_Degree_Celcius:
          //     result.data.Density_At_15_Degree_Celcius,
          //   Sulphur_Percentage_In_Bunkered_Fuel:
          //     result.data.Sulphur_Percentage_In_Bunkered_Fuel,
          //   Water_Percentage_In_Bunkered_Fuel:
          //     result.data.Water_Percentage_In_Bunkered_Fuel,
          //   CAT_Fines_AL_Si_Percentage_In_Bunkered_Fuel:
          //     result.data.CAT_Fines_AL_Si_Percentage_In_Bunkered_Fuel,
          //   Grade_Of_Fuel_Bunkered: result.data.Grade_Of_Fuel_Bunkered,
          //   Quantity_Of_Fuel_Bunkered: result.data.Quantity_Of_Fuel_Bunkered,
          //   Start_Date_Of_Fuel_Bunkered:
          //     result.data.Start_Date_Of_Fuel_Bunkered,
          //   End_Date_Of_Fuel_Bunkered: result.data.End_Date_Of_Fuel_Bunkered,
          //   Start_Time_Of_Fuel_Bunkered:
          //     result.data.Start_Time_Of_Fuel_Bunkered,
          //   End_Time_Of_Fuel_Bunkered: result.data.End_Time_Of_Fuel_Bunkered,
          //   Barge_Name_Of_Fuel_Bunkered:
          //     result.data.Barge_Name_Of_Fuel_Bunkered,
          //   Location_Of_Fuel_Bunkered: result.data.Location_Of_Fuel_Bunkered,

          //   Additional_Comments_Of_Fuel_Bunkered:
          //     result.data.Additional_Comments_Of_Fuel_Bunkered,
          // });
          this.addUpdateBunkerStockReportForm.patchValue(result.data);
          if (result.data.Bunker_Delivery_Note) {
            this.fileObject = result.data.Bunker_Delivery_Note;
          }
          if (result.data.Fuel_Delivery_Note) {
            this.fileObject2 = result.data.Fuel_Delivery_Note;
          }
        },
        (error: any) => {}
      );
  }

  /* Submit  form */
  submit(): void {
    console.log('online submit');

    if (!this.addUpdateBunkerStockReportForm.valid) {
      this.markFormGroupTouched(this.addUpdateBunkerStockReportForm);
      console.log('not valid');
    } else {
      if (this.idForUpdate) {
        this.addOrUpdateBunkerStockReport(
          'put',
          `bunker-reports/${this.idForUpdate}`,
          'Bunker Report Successfully Updated'
        );
      } else {
        this.addOrUpdateBunkerStockReport(
          'post',
          'bunker-reports',
          'Bunker Report Added Successfully '
        );
        // this.localDatabaseService.add({
        //   ...this.addUpdateBunkerStockReportForm.value,
        // });
        //.then(() => {
        // this.notificationService.success(
        //   '',
        //   'Bunker Report Added Successfully '
        // );
        // this.buttonLoading = false;
        // this.router.navigateByUrl(
        //   '/main/bunker-stock-report/bunker-report'
        // );
        //     //throw new Error('oh, no!');
        //});
        // .catch(function (e) {
        //   console.error('add error', e.message); // "oh, no!"
        // });
      }
    }
  }

  /* Add Or Edit Bunker stock Report */
  addOrUpdateBunkerStockReport(
    requestMethod: string,
    requestURL: string,
    successMessage: string
  ): void {
    console.log('STORE DATA');
    console.log(this.addUpdateBunkerStockReportForm.value);
    //this.localDatabaseService.add({ ...this.addUpdateBunkerStockReportForm.value});
    //return;
    this.buttonLoading = true;
    this.httpRequestService
      .request(
        requestMethod,
        requestURL,
        this.addUpdateBunkerStockReportForm.value
      )
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

  /* Make All Form Controls Dirty */
  private markFormGroupTouched(formGroup: FormGroup): void {
    for (const i in formGroup.controls) {
      if (formGroup.controls.hasOwnProperty(i)) {
        formGroup.controls[i].markAsDirty();
        formGroup.controls[i].updateValueAndValidity();
      }
    }
  }

  private getBase64(img: File, callback: (img: string) => void): void {
    const reader = new FileReader();
    reader.addEventListener('load', () =>
      callback(reader.result ? reader.result.toString() : '')
    );
    reader.readAsDataURL(img);
  }

  // Before media Bunker Delivery Note
  beforeUpload = (
    file: NzUploadFile,
    fileList: NzUploadFile[]
  ): Observable<any> => {
    return new Observable((observer: Observer<boolean>) => {
      const isJpgOrPng =
        file.type === 'image/jpeg' ||
        file.type === 'image/png' ||
        file.type === 'image/jpg' ||
        file.type === 'image/JPEG' ||
        file.type === 'image/PNG' ||
        file.type === 'image/JPG' ||
        file.type === 'application/pdf';
      // if (!isJpgOrPng) {
      //   this.msg.error('You can only upload Image file!');
      //   observer.complete();
      //   return;
      // }
      // const isLt2M = file.size ? file.size / 1024 / 1024 < 2 : false;
      // if (!isLt2M) {
      //   this.msg.error('Image must smaller than 2MB!');
      //   observer.complete();
      //   return;
      // }
      observer.next(isJpgOrPng);
      observer.complete();
    });
  };

  // On media upload Bunker Delivery Note
  handleUpload(info: { file: NzUploadFile }): void {
    console.log('file', info.file.status);
    switch (info.file.status) {
      case 'uploading':
        this.imgLoading = true;
        console.log('case', info);
        break;
      case 'done':
        this.addUpdateBunkerStockReportForm.patchValue({
          Bunker_Delivery_Note: info.file.response.data._id,
        });

        // Get this url from response in real world.
        if (info.file && info.file.originFileObj) {
          console.log('info', info.file);

          this.getBase64(info.file.originFileObj, (img: string) => {
            this.imgLoading = false;
            this.avatarUrl = img;
            //console.log()
            this.fileObject = info.file.response.data;
            console.log('fileobj', this.fileObject);
          });
        }

        break;
      case 'error':
        this.msg.error('Network error');
        this.imgLoading = false;
        break;
    }
  }

  // Before media Fuel Analysis Report
  beforeUpload2 = (
    file: NzUploadFile,
    fileList: NzUploadFile[]
  ): Observable<any> => {
    return new Observable((observer: Observer<boolean>) => {
      const isJpgOrPng =
        file.type === 'image/jpeg' ||
        file.type === 'image/png' ||
        file.type === 'image/jpg' ||
        file.type === 'image/JPEG' ||
        file.type === 'image/PNG' ||
        file.type === 'image/JPG' ||
        file.type === 'application/pdf';
      // if (!isJpgOrPng) {
      //   this.msg.error('You can only upload Image file!');
      //   observer.complete();
      //   return;
      // }
      // const isLt2M = file.size ? file.size / 1024 / 1024 < 2 : false;
      // if (!isLt2M) {
      //   this.msg.error('Image must smaller than 2MB!');
      //   observer.complete();
      //   return;
      // }
      observer.next(isJpgOrPng);
      observer.complete();
    });
  };

  // On media upload Fuel Analysis Report
  handleUpload2(info: { file: NzUploadFile }): void {
    console.log('file', info.file.status);
    switch (info.file.status) {
      case 'uploading':
        this.imgLoading = true;
        console.log('case', info);
        break;
      case 'done':
        this.addUpdateBunkerStockReportForm.patchValue({
          Fuel_Delivery_Note: info.file.response.data._id,
        });

        // Get this url from response in real world.
        if (info.file && info.file.originFileObj) {
          console.log('info', info.file);

          this.getBase64(info.file.originFileObj, (img: string) => {
            this.imgLoading = false;
            this.avatarUrl = img;
            //console.log()
            this.fileObject2 = info.file.response.data;
            console.log('fileobj2', this.fileObject2);
          });
        }

        break;
      case 'error':
        this.msg.error('Network error');
        this.imgLoading = false;
        break;
    }
  }
}
