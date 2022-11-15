import { Component, OnInit } from '@angular/core';
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
import { NzUploadChangeParam, NzUploadFile } from 'ng-zorro-antd/upload';
import { from, Observable, Observer, Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import {
  ConfigurationService,
  HttpRequestService,
  LocalStorageService,
} from 'src/app/core/services';

@Component({
  selector: 'app-add-update-main-eng-performance-report',
  templateUrl: './add-update-main-eng-performance-report.component.html',
  styleUrls: ['./add-update-main-eng-performance-report.component.scss'],
})
export class AddUpdateMainEngPerformanceReportComponent implements OnInit {
  addUpdateMainEngPermorfanceReportForm!: FormGroup;
  idForUpdate: any;
  buttonLoading = false;
  mediaUploadUrl: any;
  time: Date | null = null;
  defaultOpenValue = new Date(0, 0, 0, 0, 0, 0);
  reportValue: any;
  imgLoading = false;
  avatarUrl = '';
  mediaPreviewUrl: any;
  allBunkerReports: any;
  localUser: any;
  isAdmin: any;
  fileObject: any;
  fileObjectUnit2: any;
  fileObjectUnit3: any;
  fileObjectUnit4: any;
  fileObjectUnit5: any;
  fileObjectUnit6: any;
  fileObjectUnit7: any;
  fileObjectUnit8: any;
  fileObjectUnit9: any;
  fileObjectUnit10: any;
  fileObjectUnit11: any;
  fileObjectUnit12: any;
  disbaleSelect: any;
  min = 0;
  max = 200000;

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
    this.mediaUploadUrl = configurationService.apiUrl + '/api/media';
    this.mediaPreviewUrl = configurationService.mediaBaseUrl;
    this.localUser = this.localStorageService.getItem('user');
    console.log('local', this.localUser);
    this.isAdmin = this.localUser.Role === 'admin';

    console.log(this.idForUpdate);
  }

  ngOnInit(): void {
    this.addUpdateMainEngPermorfanceReportForm = this.fb.group({
      Report_Type: [null],
      // Service Data
      ME1_PERF_IMO_No: [null],
      ME1_PERF_Vessel_Name: [null],
      ME1_PERF_Report_Date: [null, [Validators.required]],
      ME1_PERF_Engine_Make: [null],
      ME1_PERF_Engine_Type: [null],
      ME1_PERF_MCR_Output: [null],
      ME1_PERF_MCR_Output_RPM: [null],
      ME1_PERF_CSR_Output: [null],
      ME1_PERF_CSR_Output_RPM: [null],
      ME1_PERF_Number_Of_Cylinder: [null],
      ME1_PERF_Number_Of_TC: [null],
      ME1_PERF_Cylinder_Oil_System: [null],
      ME1_PERF_TC_Cut_Out: [null],

      // Test Data
      ME1_PERF_Running_Hours: [
        null,
        [Validators.required, this.rangeValidator(0, 200000)],
      ],
      ME1_PERF_Main_Engine_RPM: [
        null,
        [Validators.required, this.rangeValidator(0, 500)],
      ],
      ME1_PERF_Loading_condition: [null, [Validators.required]],
      ME1_PERF_Main_Engine_Power: [
        null,
        [Validators.required, this.rangeValidator(0, 100000)],
      ],
      ME1_PERF_Wind_Force: [null],
      ME1_PERF_Wind_Direction: [null],
      ME1_PERF_Fuel_In_Use: [null],
      ME1_PERF_Scavenge_Pressure: [null, [this.rangeValidator(0, 5)]],
      ME1_PERF_Scavenge_Temperature: [null, [this.rangeValidator(0, 80)]],
      ME1_PERF_Fuel_Consumption: [null, [this.rangeValidator(0, 200)]],
      ME1_PERF_Main_Engine_Specific_Fuel_Oil_Consumption: [
        null,
        [Validators.required, this.rangeValidator(0, 60000)],
      ],
      ME1_PERF_Vessel_Speed: [
        null,
        [Validators.required, this.rangeValidator(0, 30)],
      ],
      ME1_PERF_Cylinder_Lube_Oil_Base_Number: [
        null,
        [this.rangeValidator(0, 200)],
      ],
      ME1_PERF_Cylinder_Lube_Oil_Consumption: [
        null,
        [this.rangeValidator(0, 6000)],
      ],
      ME1_PERF_Specific_Cylinder_Lube_Oil_Consumption: [
        null,
        [this.rangeValidator(0, 60000)],
      ],

      // Turbochargers & Air coolers
      ME1_PERF_TC1_RPM: [null, [this.rangeValidator(0, 60000)]],
      ME1_PERF_TC2_RPM: [null, [this.rangeValidator(0, 60000)]],
      ME1_PERF_TC3_RPM: [null, [this.rangeValidator(0, 60000)]],
      ME1_PERF_TC4_RPM: [null, [this.rangeValidator(0, 60000)]],
      ME1_PERF_TC1_Exht_In_Temperature: [null, [this.rangeValidator(0, 900)]],
      ME1_PERF_TC1_Exht_Out_Temperature: [null, [this.rangeValidator(0, 900)]],
      ME1_PERF_TC2_Exht_In_Temperature: [null, [this.rangeValidator(0, 900)]],
      ME1_PERF_TC2_Exht_Out_Temperature: [null, [this.rangeValidator(0, 900)]],
      ME1_PERF_TC3_Exht_In_Temperature: [null, [this.rangeValidator(0, 900)]],
      ME1_PERF_TC3_Exht_Out_Temperature: [null, [this.rangeValidator(0, 900)]],
      ME1_PERF_TC4_Exht_In_Temperature: [null, [this.rangeValidator(0, 900)]],
      ME1_PERF_TC4_Exht_Out_Temperature: [null, [this.rangeValidator(0, 900)]],
      ME1_PERF_Auxillary_Blowers_On_Off: [null],
      ME1_PERF_Air_Cooler_1_Cooling_Water_In: [
        null,
        [this.rangeValidator(0, 100)],
      ],
      ME1_PERF_Air_Cooler_1_Cooling_Water_Out: [
        null,
        [this.rangeValidator(0, 100)],
      ],
      ME1_PERF_Air_Cooler_2_Cooling_Water_In: [
        null,
        [this.rangeValidator(0, 100)],
      ],
      ME1_PERF_Air_Cooler_2_Cooling_Water_Out: [
        null,
        [this.rangeValidator(0, 100)],
      ],
      ME1_PERF_Air_Cooler_3_Cooling_Water_In: [
        null,
        [this.rangeValidator(0, 100)],
      ],
      ME1_PERF_Air_Cooler_3_Cooling_Water_Out: [
        null,
        [this.rangeValidator(0, 100)],
      ],
      ME1_PERF_Exht_Receiver_Pressure: [null, [this.rangeValidator(0, 5)]],
      ME1_PERF_Scavenge_Receiver_Pressure: [null, [this.rangeValidator(0, 5)]],

      // Air, Fuel Oil & Lubrication Oil

      ME1_PERF_Scavenge_Received_Temp: [null, [this.rangeValidator(0, 100)]],
      ME1_PERF_Air_Cooler_1_Air_In: [null, [this.rangeValidator(0, 100)]],
      ME1_PERF_Air_Cooler_1_Air_Out: [null, [this.rangeValidator(0, 100)]],
      ME1_PERF_Air_Cooling_2_Air_In: [null, [this.rangeValidator(0, 100)]],
      ME1_PERF_Air_Cooling_2_Air_Out: [null, [this.rangeValidator(0, 100)]],
      ME1_PERF_Air_Cooling_3_Air_In: [null, [this.rangeValidator(0, 100)]],
      ME1_PERF_Air_Cooling_3_Air_Out: [null, [this.rangeValidator(0, 100)]],
      ME1_PERF_Main_Lube_Oil_Tempertature: [
        null,
        [this.rangeValidator(0, 100)],
      ],
      ME1_PERF_Main_Lube_Oil_Pressure: [null, [this.rangeValidator(0, 10)]],
      ME1_PERF_Servo_Oil_Pressure: [null, [this.rangeValidator(0, 500)]],
      ME1_PERF_Differential_Pressure_Air_Filter: [
        null,
        [this.rangeValidator(0, 100)],
      ],
      ME1_PERF_TC_Lube_Oil_Inlet_Temperature: [
        null,
        [this.rangeValidator(0, 100)],
      ],
      ME1_PERF_Fuel_Oil_Temp: [null, [this.rangeValidator(0, 200)]],
      ME1_PERF_Axial_Vibration: [null, [this.rangeValidator(0, 100)]],
      ME1_PERF_Fuel_Oil_Pressure: [null, [this.rangeValidator(0, 50)]],
      ME1_PERF_Fuel_Index: [null, [this.rangeValidator(0, 50)]],
      ME1_PERF_Fuel_Oil_Rail_Pressure: [null, [this.rangeValidator(0, 2000)]],
      // unit - 1
      // Main_Engine_Performance_Unit_1: this.fb.group({
      ME1_PERF_Unit_1_Mean_Pressure: [null, [this.rangeValidator(0, 500)]],
      ME1_PERF_Unit_1_Fuel_Qulaity_Setting: [
        null,
        [this.rangeValidator(0, 100)],
      ],
      ME1_PERF_Unit_1_Exhaust_Temperature: [
        null,
        [this.rangeValidator(0, 500)],
      ],
      ME1_PERF_Unit_1_Pressure_Max: [null, [this.rangeValidator(0, 500)]],
      ME1_PERF_Unit_1_High_Load_Off_Percentage: [
        null,
        [this.rangeValidator(0, 100)],
      ],
      ME1_PERF_Unit_1_Colling_Water_Out_Temperature: [
        null,
        [this.rangeValidator(0, 100)],
      ],
      ME1_PERF_Unit_1_Pressure_compressure: [
        null,
        [this.rangeValidator(0, 500)],
      ],
      ME1_PERF_Unit_1_Low_Load_Off: [null, [this.rangeValidator(0, 100)]],
      ME1_PERF_Unit_1_Piston_Out_Temperature: [
        null,
        [this.rangeValidator(0, 100)],
      ],
      ME1_PERF_Unit_1_Output_Indicated: [null, [this.rangeValidator(0, 20000)]],
      ME1_PERF_Unit_1_Fuel_Index: [null, [this.rangeValidator(0, 100)]],
      ME1_PERF_Unit_1_Variable_Enjection_Timing_Index: [
        null,
        [this.rangeValidator(0, 100)],
      ],
      ME1_PERF_Unit_1_Indicated_Diagram_Upload: [null],
      // }),
      // unit - 2
      // Main_Engine_Performance_Unit_2: this.fb.group({
      ME1_PERF_Unit_2_Mean_Pressure: [null, [this.rangeValidator(0, 500)]],
      ME1_PERF_Unit_2_Fuel_Qulaity_Setting: [
        null,
        [this.rangeValidator(0, 100)],
      ],
      ME1_PERF_Unit_2_Exhaust_Temperature: [
        null,
        [this.rangeValidator(0, 500)],
      ],
      ME1_PERF_Unit_2_Pressure_Max: [null, [this.rangeValidator(0, 500)]],
      ME1_PERF_Unit_2_High_Load_Off_Percentage: [
        null,
        [this.rangeValidator(0, 100)],
      ],
      ME1_PERF_Unit_2_Colling_Water_Out_Temperature: [
        null,
        [this.rangeValidator(0, 100)],
      ],
      ME1_PERF_Unit_2_Pressure_compressure: [
        null,
        [this.rangeValidator(0, 500)],
      ],
      ME1_PERF_Unit_2_Low_Load_Off: [null, [this.rangeValidator(0, 100)]],
      ME1_PERF_Unit_2_Piston_Out_Temperature: [
        null,
        [this.rangeValidator(0, 100)],
      ],
      ME1_PERF_Unit_2_Output_Indicated: [null, [this.rangeValidator(0, 20000)]],
      ME1_PERF_Unit_2_Fuel_Index: [null, [this.rangeValidator(0, 100)]],
      ME1_PERF_Unit_2_Variable_Enjection_Timing_Index: [
        null,
        [this.rangeValidator(0, 100)],
      ],
      ME1_PERF_Unit_2_Indicated_Diagram_Upload: [null],
      // }),
      // unit - 3
      // Main_Engine_Performance_Unit_3: this.fb.group({
      ME1_PERF_Unit_3_Mean_Pressure: [null, [this.rangeValidator(0, 500)]],
      ME1_PERF_Unit_3_Fuel_Qulaity_Setting: [
        null,
        [this.rangeValidator(0, 100)],
      ],
      ME1_PERF_Unit_3_Exhaust_Temperature: [
        null,
        [this.rangeValidator(0, 500)],
      ],
      ME1_PERF_Unit_3_Pressure_Max: [null, [this.rangeValidator(0, 500)]],
      ME1_PERF_Unit_3_High_Load_Off_Percentage: [
        null,
        [this.rangeValidator(0, 100)],
      ],
      ME1_PERF_Unit_3_Colling_Water_Out_Temperature: [
        null,
        [this.rangeValidator(0, 100)],
      ],
      ME1_PERF_Unit_3_Pressure_compressure: [
        null,
        [this.rangeValidator(0, 500)],
      ],
      ME1_PERF_Unit_3_Low_Load_Off: [null, [this.rangeValidator(0, 100)]],
      ME1_PERF_Unit_3_Piston_Out_Temperature: [
        null,
        [this.rangeValidator(0, 100)],
      ],
      ME1_PERF_Unit_3_Output_Indicated: [null, [this.rangeValidator(0, 20000)]],
      ME1_PERF_Unit_3_Fuel_Index: [null, [this.rangeValidator(0, 100)]],
      ME1_PERF_Unit_3_Variable_Enjection_Timing_Index: [
        null,
        [this.rangeValidator(0, 100)],
      ],
      ME1_PERF_Unit_3_Indicated_Diagram_Upload: [null],
      // }),
      // unit - 4
      // Main_Engine_Performance_Unit_4: this.fb.group({
      ME1_PERF_Unit_4_Mean_Pressure: [null, [this.rangeValidator(0, 500)]],
      ME1_PERF_Unit_4_Fuel_Qulaity_Setting: [
        null,
        [this.rangeValidator(0, 100)],
      ],
      ME1_PERF_Unit_4_Exhaust_Temperature: [
        null,
        [this.rangeValidator(0, 500)],
      ],
      ME1_PERF_Unit_4_Pressure_Max: [null, [this.rangeValidator(0, 500)]],
      ME1_PERF_Unit_4_High_Load_Off_Percentage: [
        null,
        [this.rangeValidator(0, 100)],
      ],
      ME1_PERF_Unit_4_Colling_Water_Out_Temperature: [
        null,
        [this.rangeValidator(0, 100)],
      ],
      ME1_PERF_Unit_4_Pressure_compressure: [
        null,
        [this.rangeValidator(0, 500)],
      ],
      ME1_PERF_Unit_4_Low_Load_Off: [null, [this.rangeValidator(0, 100)]],
      ME1_PERF_Unit_4_Piston_Out_Temperature: [
        null,
        [this.rangeValidator(0, 100)],
      ],
      ME1_PERF_Unit_4_Output_Indicated: [null, [this.rangeValidator(0, 20000)]],
      ME1_PERF_Unit_4_Fuel_Index: [null, [this.rangeValidator(0, 100)]],
      ME1_PERF_Unit_4_Variable_Enjection_Timing_Index: [
        null,
        [this.rangeValidator(0, 100)],
      ],
      ME1_PERF_Unit_4_Indicated_Diagram_Upload: [null],
      // }),
      // unit - 5
      // Main_Engine_Performance_Unit_5: this.fb.group({
      ME1_PERF_Unit_5_Mean_Pressure: [null, [this.rangeValidator(0, 500)]],
      ME1_PERF_Unit_5_Fuel_Qulaity_Setting: [
        null,
        [this.rangeValidator(0, 100)],
      ],
      ME1_PERF_Unit_5_Exhaust_Temperature: [
        null,
        [this.rangeValidator(0, 500)],
      ],
      ME1_PERF_Unit_5_Pressure_Max: [null, [this.rangeValidator(0, 500)]],
      ME1_PERF_Unit_5_High_Load_Off_Percentage: [
        null,
        [this.rangeValidator(0, 100)],
      ],
      ME1_PERF_Unit_5_Colling_Water_Out_Temperature: [
        null,
        [this.rangeValidator(0, 100)],
      ],
      ME1_PERF_Unit_5_Pressure_compressure: [
        null,
        [this.rangeValidator(0, 500)],
      ],
      ME1_PERF_Unit_5_Low_Load_Off: [null, [this.rangeValidator(0, 100)]],
      ME1_PERF_Unit_5_Piston_Out_Temperature: [
        null,
        [this.rangeValidator(0, 100)],
      ],
      ME1_PERF_Unit_5_Output_Indicated: [null, [this.rangeValidator(0, 20000)]],
      ME1_PERF_Unit_5_Fuel_Index: [null, [this.rangeValidator(0, 100)]],
      ME1_PERF_Unit_5_Variable_Enjection_Timing_Index: [
        null,
        [this.rangeValidator(0, 100)],
      ],
      ME1_PERF_Unit_5_Indicated_Diagram_Upload: [null],
      // }),
      // unit - 6
      // Main_Engine_Performance_Unit_6: this.fb.group({
      ME1_PERF_Unit_6_Mean_Pressure: [null, [this.rangeValidator(0, 500)]],
      ME1_PERF_Unit_6_Fuel_Qulaity_Setting: [
        null,
        [this.rangeValidator(0, 100)],
      ],
      ME1_PERF_Unit_6_Exhaust_Temperature: [
        null,
        [this.rangeValidator(0, 500)],
      ],
      ME1_PERF_Unit_6_Pressure_Max: [null, [this.rangeValidator(0, 500)]],
      ME1_PERF_Unit_6_High_Load_Off_Percentage: [
        null,
        [this.rangeValidator(0, 100)],
      ],
      ME1_PERF_Unit_6_Colling_Water_Out_Temperature: [
        null,
        [this.rangeValidator(0, 100)],
      ],
      ME1_PERF_Unit_6_Pressure_compressure: [
        null,
        [this.rangeValidator(0, 500)],
      ],
      ME1_PERF_Unit_6_Low_Load_Off: [null, [this.rangeValidator(0, 100)]],
      ME1_PERF_Unit_6_Piston_Out_Temperature: [
        null,
        [this.rangeValidator(0, 100)],
      ],
      ME1_PERF_Unit_6_Output_Indicated: [null, [this.rangeValidator(0, 20000)]],
      ME1_PERF_Unit_6_Fuel_Index: [null, [this.rangeValidator(0, 100)]],
      ME1_PERF_Unit_6_Variable_Enjection_Timing_Index: [
        null,
        [this.rangeValidator(0, 100)],
      ],
      ME1_PERF_Unit_6_Indicated_Diagram_Upload: [null],
      // }),
      // unit - 7
      // Main_Engine_Performance_Unit_7: this.fb.group({
      ME1_PERF_Unit_7_Mean_Pressure: [null, [this.rangeValidator(0, 500)]],
      ME1_PERF_Unit_7_Fuel_Qulaity_Setting: [
        null,
        [this.rangeValidator(0, 100)],
      ],
      ME1_PERF_Unit_7_Exhaust_Temperature: [
        null,
        [this.rangeValidator(0, 500)],
      ],
      ME1_PERF_Unit_7_Pressure_Max: [null, [this.rangeValidator(0, 500)]],
      ME1_PERF_Unit_7_High_Load_Off_Percentage: [
        null,
        [this.rangeValidator(0, 100)],
      ],
      ME1_PERF_Unit_7_Colling_Water_Out_Temperature: [
        null,
        [this.rangeValidator(0, 100)],
      ],
      ME1_PERF_Unit_7_Pressure_compressure: [
        null,
        [this.rangeValidator(0, 500)],
      ],
      ME1_PERF_Unit_7_Low_Load_Off: [null, [this.rangeValidator(0, 100)]],
      ME1_PERF_Unit_7_Piston_Out_Temperature: [
        null,
        [this.rangeValidator(0, 100)],
      ],
      ME1_PERF_Unit_7_Output_Indicated: [null, [this.rangeValidator(0, 20000)]],
      ME1_PERF_Unit_7_Fuel_Index: [null, [this.rangeValidator(0, 100)]],
      ME1_PERF_Unit_7_Variable_Enjection_Timing_Index: [
        null,
        [this.rangeValidator(0, 100)],
      ],
      ME1_PERF_Unit_7_Indicated_Diagram_Upload: [null],
      // }),
      // unit - 8
      // Main_Engine_Performance_Unit_8: this.fb.group({
      ME1_PERF_Unit_8_Mean_Pressure: [null, [this.rangeValidator(0, 500)]],
      ME1_PERF_Unit_8_Fuel_Qulaity_Setting: [
        null,
        [this.rangeValidator(0, 100)],
      ],
      ME1_PERF_Unit_8_Exhaust_Temperature: [
        null,
        [this.rangeValidator(0, 500)],
      ],
      ME1_PERF_Unit_8_Pressure_Max: [null, [this.rangeValidator(0, 500)]],
      ME1_PERF_Unit_8_High_Load_Off_Percentage: [
        null,
        [this.rangeValidator(0, 100)],
      ],
      ME1_PERF_Unit_8_Colling_Water_Out_Temperature: [
        null,
        [this.rangeValidator(0, 100)],
      ],
      ME1_PERF_Unit_8_Pressure_compressure: [
        null,
        [this.rangeValidator(0, 500)],
      ],
      ME1_PERF_Unit_8_Low_Load_Off: [null, [this.rangeValidator(0, 100)]],
      ME1_PERF_Unit_8_Piston_Out_Temperature: [
        null,
        [this.rangeValidator(0, 100)],
      ],
      ME1_PERF_Unit_8_Output_Indicated: [null, [this.rangeValidator(0, 20000)]],
      ME1_PERF_Unit_8_Fuel_Index: [null, [this.rangeValidator(0, 100)]],
      ME1_PERF_Unit_8_Variable_Enjection_Timing_Index: [
        null,
        [this.rangeValidator(0, 100)],
      ],
      ME1_PERF_Unit_8_Indicated_Diagram_Upload: [null],
      // }),
      // unit - 9
      // Main_Engine_Performance_Unit_9: this.fb.group({
      ME1_PERF_Unit_9_Mean_Pressure: [null, [this.rangeValidator(0, 500)]],
      ME1_PERF_Unit_9_Fuel_Qulaity_Setting: [
        null,
        [this.rangeValidator(0, 100)],
      ],
      ME1_PERF_Unit_9_Exhaust_Temperature: [
        null,
        [this.rangeValidator(0, 500)],
      ],
      ME1_PERF_Unit_9_Pressure_Max: [null, [this.rangeValidator(0, 500)]],
      ME1_PERF_Unit_9_High_Load_Off_Percentage: [
        null,
        [this.rangeValidator(0, 100)],
      ],
      ME1_PERF_Unit_9_Colling_Water_Out_Temperature: [
        null,
        [this.rangeValidator(0, 100)],
      ],
      ME1_PERF_Unit_9_Pressure_compressure: [
        null,
        [this.rangeValidator(0, 500)],
      ],
      ME1_PERF_Unit_9_Low_Load_Off: [null, [this.rangeValidator(0, 100)]],
      ME1_PERF_Unit_9_Piston_Out_Temperature: [
        null,
        [this.rangeValidator(0, 100)],
      ],
      ME1_PERF_Unit_9_Output_Indicated: [null, [this.rangeValidator(0, 20000)]],
      ME1_PERF_Unit_9_Fuel_Index: [null, [this.rangeValidator(0, 100)]],
      ME1_PERF_Unit_9_Variable_Enjection_Timing_Index: [
        null,
        [this.rangeValidator(0, 100)],
      ],
      ME1_PERF_Unit_9_Indicated_Diagram_Upload: [null],
      // }),
      // unit - 10
      // Main_Engine_Performance_Unit_10: this.fb.group({
      ME1_PERF_Unit_10_Mean_Pressure: [null, [this.rangeValidator(0, 500)]],
      ME1_PERF_Unit_10_Fuel_Qulaity_Setting: [
        null,
        [this.rangeValidator(0, 100)],
      ],
      ME1_PERF_Unit_10_Exhaust_Temperature: [
        null,
        [this.rangeValidator(0, 500)],
      ],
      ME1_PERF_Unit_10_Pressure_Max: [null, [this.rangeValidator(0, 500)]],
      ME1_PERF_Unit_10_High_Load_Off_Percentage: [
        null,
        [this.rangeValidator(0, 100)],
      ],
      ME1_PERF_Unit_10_Colling_Water_Out_Temperature: [
        null,
        [this.rangeValidator(0, 100)],
      ],
      ME1_PERF_Unit_10_Pressure_compressure: [
        null,
        [this.rangeValidator(0, 500)],
      ],
      ME1_PERF_Unit_10_Low_Load_Off: [null, [this.rangeValidator(0, 100)]],
      ME1_PERF_Unit_10_Piston_Out_Temperature: [
        null,
        [this.rangeValidator(0, 100)],
      ],
      ME1_PERF_Unit_10_Output_Indicated: [
        null,
        [this.rangeValidator(0, 20000)],
      ],
      ME1_PERF_Unit_10_Fuel_Index: [null, [this.rangeValidator(0, 100)]],
      ME1_PERF_Unit_10_Variable_Enjection_Timing_Index: [
        null,
        [this.rangeValidator(0, 100)],
      ],
      ME1_PERF_Unit_10_Indicated_Diagram_Upload: [null],
      //}),
      // unit - 11
      // Main_Engine_Performance_Unit_11: this.fb.group({
      ME1_PERF_Unit_11_Mean_Pressure: [null, [this.rangeValidator(0, 500)]],
      ME1_PERF_Unit_11_Fuel_Qulaity_Setting: [
        null,
        [this.rangeValidator(0, 100)],
      ],
      ME1_PERF_Unit_11_Exhaust_Temperature: [
        null,
        [this.rangeValidator(0, 500)],
      ],
      ME1_PERF_Unit_11_Pressure_Max: [null, [this.rangeValidator(0, 500)]],
      ME1_PERF_Unit_11_High_Load_Off_Percentage: [
        null,
        [this.rangeValidator(0, 100)],
      ],
      ME1_PERF_Unit_11_Colling_Water_Out_Temperature: [
        null,
        [this.rangeValidator(0, 100)],
      ],
      ME1_PERF_Unit_11_Pressure_compressure: [
        null,
        [this.rangeValidator(0, 500)],
      ],
      ME1_PERF_Unit_11_Low_Load_Off: [null, [this.rangeValidator(0, 100)]],
      ME1_PERF_Unit_11_Piston_Out_Temperature: [
        null,
        [this.rangeValidator(0, 100)],
      ],
      ME1_PERF_Unit_11_Output_Indicated: [
        null,
        [this.rangeValidator(0, 20000)],
      ],
      ME1_PERF_Unit_11_Fuel_Index: [null, [this.rangeValidator(0, 100)]],
      ME1_PERF_Unit_11_Variable_Enjection_Timing_Index: [
        null,
        [this.rangeValidator(0, 100)],
      ],
      ME1_PERF_Unit_11_Indicated_Diagram_Upload: [null],
      // }),
      // unit - 12
      // Main_Engine_Performance_Unit_12: this.fb.group({
      ME1_PERF_Unit_12_Mean_Pressure: [null, [this.rangeValidator(0, 500)]],
      ME1_PERF_Unit_12_Fuel_Qulaity_Setting: [
        null,
        [this.rangeValidator(0, 100)],
      ],
      ME1_PERF_Unit_12_Exhaust_Temperature: [
        null,
        [this.rangeValidator(0, 500)],
      ],
      ME1_PERF_Unit_12_Pressure_Max: [null, [this.rangeValidator(0, 500)]],
      ME1_PERF_Unit_12_High_Load_Off_Percentage: [
        null,
        [this.rangeValidator(0, 100)],
      ],
      ME1_PERF_Unit_12_Colling_Water_Out_Temperature: [
        null,
        [this.rangeValidator(0, 100)],
      ],
      ME1_PERF_Unit_12_Pressure_compressure: [
        null,
        [this.rangeValidator(0, 500)],
      ],
      ME1_PERF_Unit_12_Low_Load_Off: [null, [this.rangeValidator(0, 100)]],
      ME1_PERF_Unit_12_Piston_Out_Temperature: [
        null,
        [this.rangeValidator(0, 100)],
      ],
      ME1_PERF_Unit_12_Output_Indicated: [
        null,
        [this.rangeValidator(0, 20000)],
      ],
      ME1_PERF_Unit_12_Fuel_Index: [null, [this.rangeValidator(0, 100)]],
      ME1_PERF_Unit_12_Variable_Enjection_Timing_Index: [
        null,
        [this.rangeValidator(0, 100)],
      ],
      ME1_PERF_Unit_12_Indicated_Diagram_Upload: [null],
      // }),
    });

    this.disbaleSelect = true;
    this.addUpdateMainEngPermorfanceReportForm.patchValue({
      ME1_PERF_Vessel_Name: this.localUser.Ship_Name,
      ME1_PERF_Engine_Make: this.localUser.Engine_Make,
      ME1_PERF_Engine_Type: this.localUser.Engine_Type,
      ME1_PERF_MCR_Output: this.localUser.MCR_Output,
      ME1_PERF_MCR_Output_RPM: this.localUser.MCR_Output_RPM,
      ME1_PERF_CSR_Output: this.localUser.CSR_Output,
      ME1_PERF_CSR_Output_RPM: this.localUser.CSR_Output_RPM,
      ME1_PERF_Number_Of_Cylinder: this.localUser.No_Of_Cyl,
      ME1_PERF_Number_Of_TC: this.localUser.No_of_TC,
    });

    this.getBunkerReports();
    console.log('sg');
    if (this.idForUpdate) {
      console.log('in edit mode');
      this.getMainEngPerformanceReportById();
    } else {
      console.log('gggggggggggggggggggggg');
    }
  }
  /* bunker get all */
  getBunkerReports(): void {
    this.httpRequestService.request('get', 'bunker-reports').subscribe(
      (result) => {
        console.log(result);

        this.allBunkerReports = result.data;
      },
      (err) => {}
    );
  }
  /* Get single main eng performance report by Id */
  getMainEngPerformanceReportById(): void {
    this.httpRequestService
      .request('get', `main-engine-perfomance-reports/${this.idForUpdate}`)
      .subscribe(
        (result: any) => {
          this.addUpdateMainEngPermorfanceReportForm.patchValue(
            result.data
            // Service Data
            // ME1_PERF_Vessel_Name: result.data.ME1_PERF_Vessel_Name,
            // ME1_PERF_Report_Date: result.data.ME1_PERF_Report_Date,
            // ME1_PERF_Engine_Make: result.data.ME1_PERF_Engine_Make,
            // ME1_PERF_Engine_Type: result.data.ME1_PERF_Engine_Type,
            // ME1_PERF_MCR_Output: result.data.ME1_PERF_MCR_Output,
            // ME1_PERF_MCR_Output_RPM: result.data.ME1_PERF_MCR_Output_RPM,
            // ME1_PERF_CSR_Output: result.data.ME1_PERF_CSR_Output,
            // ME1_PERF_CSR_Output_RPM: result.data.ME1_PERF_CSR_Output_RPM,
            // ME1_PERF_Number_Of_Cylinder:
            //   result.data.ME1_PERF_Number_Of_Cylinder,
            // ME1_PERF_Number_Of_TC: result.data.ME1_PERF_Number_Of_TC,
            // ME1_PERF_Cylinder_Oil_System:
            //   result.data.ME1_PERF_Cylinder_Oil_System,
            // ME1_PERF_TC_Cut_Out: result.data.ME1_PERF_TC_Cut_Out,

            // Test Data
            // ME1_PERF_Running_Hours: result.data.ME1_PERF_Running_Hours,
            // ME1_PERF_Main_Engine_RPM: result.data.ME1_PERF_Main_Engine_RPM,
            // ME1_PERF_Loading_condition: result.data.ME1_PERF_Loading_condition,
            // ME1_PERF_Main_Engine_Power: result.data.ME1_PERF_Main_Engine_Power,
            // ME1_PERF_Wind_Force: result.data.ME1_PERF_Wind_Force,
            // ME1_PERF_Wind_Direction: result.data.ME1_PERF_Wind_Direction,
            // ME1_PERF_Fuel_In_Use: result.data.ME1_PERF_Fuel_In_Use._id,
            // ME1_PERF_Scavenge_Pressure: result.data.ME1_PERF_Scavenge_Pressure,
            // ME1_PERF_Scavenge_Temperature:
            //   result.data.ME1_PERF_Scavenge_Temperature,
            // ME1_PERF_Fuel_Consumption: result.data.ME1_PERF_Fuel_Consumption,
            // ME1_PERF_Main_Engine_Specific_Fuel_Oil_Consumption:
            //   result.data.ME1_PERF_Main_Engine_Specific_Fuel_Oil_Consumption,
            // ME1_PERF_Vessel_Speed: result.data.ME1_PERF_Vessel_Speed,
            // ME1_PERF_Cylinder_Lube_Oil_Base_Number:
            //   result.data.ME1_PERF_Cylinder_Lube_Oil_Base_Number,
            // ME1_PERF_Cylinder_Lube_Oil_Consumption:
            //   result.data.ME1_PERF_Cylinder_Lube_Oil_Consumption,
            // ME1_PERF_Specific_Cylinder_Lube_Oil_Consumption:
            //   result.data.ME1_PERF_Specific_Cylinder_Lube_Oil_Consumption,

            // Turbochargers & Air coolers
            // ME1_PERF_TC1_RPM: result.data.ME1_PERF_TC1_RPM,
            // ME1_PERF_TC2_RPM: result.data.ME1_PERF_TC2_RPM,
            // ME1_PERF_TC3_RPM: result.data.ME1_PERF_TC3_RPM,
            // ME1_PERF_TC4_RPM: result.data.ME1_PERF_TC4_RPM,
            // ME1_PERF_TC1_Exht_In_Temperature:
            //   result.data.ME1_PERF_TC1_Exht_In_Temperature,
            // ME1_PERF_TC1_Exht_Out_Temperature:
            //   result.data.ME1_PERF_TC1_Exht_Out_Temperature,
            // ME1_PERF_TC2_Exht_In_Temperature:
            //   result.data.ME1_PERF_TC2_Exht_In_Temperature,
            // ME1_PERF_TC2_Exht_Out_Temperature:
            //   result.data.ME1_PERF_TC2_Exht_Out_Temperature,
            // ME1_PERF_TC3_Exht_In_Temperature:
            //   result.data.ME1_PERF_TC3_Exht_In_Temperature,
            // ME1_PERF_TC3_Exht_Out_Temperature:
            //   result.data.ME1_PERF_TC3_Exht_Out_Temperature,
            // ME1_PERF_TC4_Exht_In_Temperature:
            //   result.data.ME1_PERF_TC4_Exht_In_Temperature,
            // ME1_PERF_TC4_Exht_Out_Temperature:
            //   result.data.ME1_PERF_TC4_Exht_Out_Temperature,
            // ME1_PERF_Auxillary_Blowers_On_Off:
            //   result.data.ME1_PERF_Auxillary_Blowers_On_Off,
            // ME1_PERF_Air_Cooler_1_Cooling_Water_In:
            //   result.data.ME1_PERF_Air_Cooler_1_Cooling_Water_In,
            // ME1_PERF_Air_Cooler_1_Cooling_Water_Out:
            //   result.data.ME1_PERF_Air_Cooler_1_Cooling_Water_Out,
            // ME1_PERF_Air_Cooler_2_Cooling_Water_In:
            //   result.data.ME1_PERF_Air_Cooler_2_Cooling_Water_In,
            // ME1_PERF_Air_Cooler_2_Cooling_Water_Out:
            //   result.data.ME1_PERF_Air_Cooler_2_Cooling_Water_Out,
            // ME1_PERF_Air_Cooler_3_Cooling_Water_In:
            //   result.data.ME1_PERF_Air_Cooler_3_Cooling_Water_In,
            // ME1_PERF_Air_Cooler_3_Cooling_Water_Out:
            //   result.data.ME1_PERF_Air_Cooler_3_Cooling_Water_Out,
            // ME1_PERF_Exht_Receiver_Pressure:
            //   result.data.ME1_PERF_Exht_Receiver_Pressure,
            // ME1_PERF_Scavenge_Receiver_Pressure:
            //   result.data.ME1_PERF_Scavenge_Receiver_Pressure,

            // Air, Fuel Oil & Lubrication Oil

            // ME1_PERF_Scavenge_Received_Temp:
            //   result.data.ME1_PERF_Scavenge_Received_Temp,
            // ME1_PERF_Air_Cooler_1_Air_In:
            //   result.data.ME1_PERF_Air_Cooler_1_Air_In,
            // ME1_PERF_Air_Cooler_1_Air_Out:
            //   result.data.ME1_PERF_Air_Cooler_1_Air_Out,
            // ME1_PERF_Air_Cooling_2_Air_In:
            //   result.data.ME1_PERF_Air_Cooling_2_Air_In,
            // ME1_PERF_Air_Cooling_2_Air_Out:
            //   result.data.ME1_PERF_Air_Cooling_2_Air_Out,
            // ME1_PERF_Air_Cooling_3_Air_In:
            //   result.data.ME1_PERF_Air_Cooling_3_Air_In,
            // ME1_PERF_Air_Cooling_3_Air_Out:
            //   result.data.ME1_PERF_Air_Cooling_3_Air_Out,
            // ME1_PERF_Main_Lube_Oil_Tempertature:
            //   result.data.ME1_PERF_Main_Lube_Oil_Tempertature,
            // ME1_PERF_Main_Lube_Oil_Pressure:
            //   result.data.ME1_PERF_Main_Lube_Oil_Pressure,
            // ME1_PERF_Servo_Oil_Pressure:
            //   result.data.ME1_PERF_Servo_Oil_Pressure,
            // ME1_PERF_Differential_Pressure_Air_Filter:
            //   result.data.ME1_PERF_Differential_Pressure_Air_Filter,
            // ME1_PERF_TC_Lube_Oil_Inlet_Temperature:
            //   result.data.ME1_PERF_TC_Lube_Oil_Inlet_Temperature,
            // ME1_PERF_Fuel_Oil_Temp: result.data.ME1_PERF_Fuel_Oil_Temp,
            // ME1_PERF_Axial_Vibration: result.data.ME1_PERF_Axial_Vibration,
            // ME1_PERF_Fuel_Oil_Pressure: result.data.ME1_PERF_Fuel_Oil_Pressure,
            // ME1_PERF_Fuel_Index: result.data.ME1_PERF_Fuel_Index,
            // ME1_PERF_Fuel_Oil_Rail_Pressure:
            //   result.data.ME1_PERF_Fuel_Oil_Rail_Pressure,
            // unit -1
            // Main_Engine_Performance_Unit_1:
            //   result.data.Main_Engine_Performance_Unit_1,

            // unit -2
            // Main_Engine_Performance_Unit_2:
            //   result.data.Main_Engine_Performance_Unit_2,
            // // unit -3
            // Main_Engine_Performance_Unit_3:
            //   result.data.Main_Engine_Performance_Unit_3,
            // unit -4
            // Main_Engine_Performance_Unit_4:
            //   result.data.Main_Engine_Performance_Unit_4,
            // unit -5
            // Main_Engine_Performance_Unit_5:
            //   result.data.Main_Engine_Performance_Unit_5,
            // unit -6
            // Main_Engine_Performance_Unit_6:
            //   result.data.Main_Engine_Performance_Unit_6,
            // unit -7
            // Main_Engine_Performance_Unit_7:
            //   result.data.Main_Engine_Performance_Unit_7,
            // unit -8
            // Main_Engine_Performance_Unit_8:
            //   result.data.Main_Engine_Performance_Unit_8,
            // unit -9
            // Main_Engine_Performance_Unit_9:
            //   result.data.Main_Engine_Performance_Unit_9,
            // unit -10
            // Main_Engine_Performance_Unit_10:
            //   result.data.Main_Engine_Performance_Unit_10,
            // unit -11
            // Main_Engine_Performance_Unit_11:
            //   result.data.Main_Engine_Performance_Unit_11,
            // unit -12
            // Main_Engine_Performance_Unit_12:
            //   result.data.Main_Engine_Performance_Unit_12,
          );
          // console.log(
          //   'avt url',
          //   result.data.Main_Engine_Performance_Unit_1
          //     .ME1_PERF_Indicated_Diagram_Upload
          // );
          if (result.data.ME1_PERF_Fuel_In_Use) {
            this.addUpdateMainEngPermorfanceReportForm.patchValue({
              ME1_PERF_Fuel_In_Use: result.data.ME1_PERF_Fuel_In_Use._id,
            });
          }
          if (result.data.ME1_PERF_Unit_1_Indicated_Diagram_Upload) {
            this.fileObject =
              result.data.ME1_PERF_Unit_1_Indicated_Diagram_Upload;
          }
          if (result.data.ME1_PERF_Unit_2_Indicated_Diagram_Upload) {
            this.fileObjectUnit2 =
              result.data.ME1_PERF_Unit_2_Indicated_Diagram_Upload;
          }
          if (result.data.ME1_PERF_Unit_3_Indicated_Diagram_Upload) {
            this.fileObjectUnit3 =
              result.data.ME1_PERF_Unit_3_Indicated_Diagram_Upload;
          }
          if (result.data.ME1_PERF_Unit_4_Indicated_Diagram_Upload) {
            this.fileObjectUnit4 =
              result.data.ME1_PERF_Unit_4_Indicated_Diagram_Upload;
          }
          if (result.data.ME1_PERF_Unit_5_Indicated_Diagram_Upload) {
            this.fileObjectUnit5 =
              result.data.ME1_PERF_Unit_5_Indicated_Diagram_Upload;
          }
          if (result.data.ME1_PERF_Unit_6_Indicated_Diagram_Upload) {
            this.fileObjectUnit6 =
              result.data.ME1_PERF_Unit_6_Indicated_Diagram_Upload;
          }
          if (result.data.ME1_PERF_Unit_7_Indicated_Diagram_Upload) {
            this.fileObjectUnit7 =
              result.data.ME1_PERF_Unit_7_Indicated_Diagram_Upload;
          }
          if (result.data.ME1_PERF_Unit_8_Indicated_Diagram_Upload) {
            this.fileObjectUnit8 =
              result.data.ME1_PERF_Unit_8_Indicated_Diagram_Upload;
          }
          if (result.data.ME1_PERF_Unit_9_Indicated_Diagram_Upload) {
            this.fileObjectUnit9 =
              result.data.ME1_PERF_Unit_9_Indicated_Diagram_Upload;
          }
          if (result.data.ME1_PERF_Unit_10_Indicated_Diagram_Upload) {
            this.fileObjectUnit10 =
              result.data.ME1_PERF_Unit_10_Indicated_Diagram_Upload;
          }
          if (result.data.ME1_PERF_Unit_11_Indicated_Diagram_Upload) {
            this.fileObjectUnit11 =
              result.data.ME1_PERF_Unit_11_Indicated_Diagram_Upload;
          }
          if (result.data.ME1_PERF_Unit_12_Indicated_Diagram_Upload) {
            this.fileObjectUnit12 =
              result.data.ME1_PERF_Unit_12_Indicated_Diagram_Upload;
          }
        },
        (error: any) => {
          console.log('error', error);
        }
      );
  }

  /* Submit  form */
  submit(): void {
    this.addUpdateMainEngPermorfanceReportForm.patchValue({
      ME1_PERF_IMO_No: this.localUser.IMO_No,
      Report_Type: 'Main engine performance report',
    });
    // if (
    //   this.addUpdateMainEngPermorfanceReportForm.value.ME1_PERF_Running_Hours &&
    //   this.addUpdateMainEngPermorfanceReportForm.value.ME1_PERF_Running_Hours >
    //     200000
    // ) {
    //   this.notificationService.error(
    //     '',
    //     'Running hrs value not more than 200000.'
    //   );
    //   return;
    // }
    // if (
    //   this.addUpdateMainEngPermorfanceReportForm.value.ME1_PERF_Running_Hours &&
    //   this.addUpdateMainEngPermorfanceReportForm.value.ME1_PERF_Running_Hours <
    //     0
    // ) {
    //   this.notificationService.error('', 'Running hrs value not less than 0.');
    //   return;
    // }
    // if (
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Main_Engine_RPM &&
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Main_Engine_RPM > 500
    // ) {
    //   this.notificationService.error('', 'RPM value not more than 500.');
    //   return;
    // }

    // if (
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Main_Engine_Power &&
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Main_Engine_Power > 100000
    // ) {
    //   this.notificationService.error(
    //     '',
    //     'Power [kW] value not more than 100000.'
    //   );
    //   return;
    // }

    // if (
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Scavenge_Pressure &&
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Scavenge_Pressure > 5
    // ) {
    //   this.notificationService.error(
    //     '',
    //     'Scav. Press (bar) value not more than 5.'
    //   );
    //   return;
    // }

    // if (
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Scavenge_Pressure &&
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Scavenge_Pressure < 0
    // ) {
    //   this.notificationService.error(
    //     '',
    //     'Scav. Press (bar) value not less than 0.'
    //   );
    //   return;
    // }

    // if (
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Scavenge_Temperature &&
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Scavenge_Temperature > 80
    // ) {
    //   this.notificationService.error(
    //     '',
    //     'Scav. Temp (°C) value not more than 80.'
    //   );
    //   return;
    // }

    // if (
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Scavenge_Temperature &&
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Scavenge_Temperature < 0
    // ) {
    //   this.notificationService.error(
    //     '',
    //     'Scav. Temp (°C) value not less than 0.'
    //   );
    //   return;
    // }

    // if (
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Main_Engine_Specific_Fuel_Oil_Consumption &&
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Main_Engine_Specific_Fuel_Oil_Consumption > 60000
    // ) {
    //   this.notificationService.error(
    //     '',
    //     'Sp. Fuel Cons. (g/kWh) value not more than 60000.'
    //   );
    //   return;
    // }

    // if (
    //   this.addUpdateMainEngPermorfanceReportForm.value.ME1_PERF_Vessel_Speed &&
    //   this.addUpdateMainEngPermorfanceReportForm.value.ME1_PERF_Vessel_Speed >
    //     30
    // ) {
    //   this.notificationService.error(
    //     '',
    //     'Vessel speed (Knots) value not more than 30.'
    //   );
    //   return;
    // }

    // if (
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Cylinder_Lube_Oil_Base_Number &&
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Cylinder_Lube_Oil_Base_Number > 200
    // ) {
    //   this.notificationService.error(
    //     '',
    //     'Cyl. L.O. BN value not more than 200.'
    //   );
    //   return;
    // }

    // if (
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Cylinder_Lube_Oil_Consumption &&
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Cylinder_Lube_Oil_Consumption > 6000
    // ) {
    //   this.notificationService.error(
    //     '',
    //     'Cyl. Oil Cons. (kg/hr) value not more than 6000.'
    //   );
    //   return;
    // }

    // if (
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Specific_Cylinder_Lube_Oil_Consumption &&
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Specific_Cylinder_Lube_Oil_Consumption > 60000
    // ) {
    //   this.notificationService.error(
    //     '',
    //     'Sp. Cyl. Cons. (g/kWh) value not more than 60000.'
    //   );
    //   return;
    // }

    // if (
    //   this.addUpdateMainEngPermorfanceReportForm.value.ME1_PERF_TC1_RPM &&
    //   this.addUpdateMainEngPermorfanceReportForm.value.ME1_PERF_TC1_RPM > 60000
    // ) {
    //   this.notificationService.error(
    //     '',
    //     'T/C 1 RPM value not more than 60000.'
    //   );
    //   return;
    // }
    // if (
    //   this.addUpdateMainEngPermorfanceReportForm.value.ME1_PERF_TC2_RPM &&
    //   this.addUpdateMainEngPermorfanceReportForm.value.ME1_PERF_TC2_RPM > 60000
    // ) {
    //   this.notificationService.error(
    //     '',
    //     'T/C 2 RPM value not more than 60000.'
    //   );
    //   return;
    // }
    // if (
    //   this.addUpdateMainEngPermorfanceReportForm.value.ME1_PERF_TC3_RPM &&
    //   this.addUpdateMainEngPermorfanceReportForm.value.ME1_PERF_TC3_RPM > 60000
    // ) {
    //   this.notificationService.error(
    //     '',
    //     'T/C 3 RPM value not more than 60000.'
    //   );
    //   return;
    // }
    // if (
    //   this.addUpdateMainEngPermorfanceReportForm.value.ME1_PERF_TC4_RPM &&
    //   this.addUpdateMainEngPermorfanceReportForm.value.ME1_PERF_TC4_RPM > 60000
    // ) {
    //   this.notificationService.error(
    //     '',
    //     'T/C 4 RPM value not more than 60000.'
    //   );
    //   return;
    // }
    // if (
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_TC1_Exht_In_Temperature &&
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_TC1_Exht_In_Temperature > 900
    // ) {
    //   this.notificationService.error(
    //     '',
    //     'T/C 1 Exh. In (°C) value not more than 900.'
    //   );
    //   return;
    // }

    // if (
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_TC1_Exht_Out_Temperature &&
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_TC1_Exht_Out_Temperature > 900
    // ) {
    //   this.notificationService.error(
    //     '',
    //     'T/C 1 Exh. Out (°C) value not more than 900.'
    //   );
    //   return;
    // }
    // if (
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_TC2_Exht_In_Temperature &&
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_TC2_Exht_In_Temperature > 900
    // ) {
    //   this.notificationService.error(
    //     '',
    //     'T/C 2 Exh. In (°C) value not more than 900.'
    //   );
    //   return;
    // }
    // if (
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_TC2_Exht_Out_Temperature &&
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_TC2_Exht_Out_Temperature > 900
    // ) {
    //   this.notificationService.error(
    //     '',
    //     'T/C 2 Exh. Out (°C) value not more than 900.'
    //   );
    //   return;
    // }
    // if (
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_TC3_Exht_In_Temperature &&
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_TC3_Exht_In_Temperature > 900
    // ) {
    //   this.notificationService.error(
    //     '',
    //     'T/C 3 Exh. In (°C) value not more than 900.'
    //   );
    //   return;
    // }
    // if (
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_TC3_Exht_Out_Temperature &&
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_TC3_Exht_Out_Temperature > 900
    // ) {
    //   this.notificationService.error(
    //     '',
    //     'T/C 3 Exh. Out (°C) value not more than 900.'
    //   );
    //   return;
    // }
    // if (
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_TC4_Exht_In_Temperature &&
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_TC4_Exht_In_Temperature > 900
    // ) {
    //   this.notificationService.error(
    //     '',
    //     'T/C 4 Exh. In (°C) value not more than 900.'
    //   );
    //   return;
    // }
    // if (
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_TC4_Exht_Out_Temperature &&
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_TC4_Exht_Out_Temperature > 900
    // ) {
    //   this.notificationService.error(
    //     '',
    //     'T/C 4 Exh. Out (°C) value not more than 900.'
    //   );
    //   return;
    // }

    // if (
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Air_Cooler_1_Cooling_Water_In &&
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Air_Cooler_1_Cooling_Water_In > 100
    // ) {
    //   this.notificationService.error(
    //     '',
    //     'Air Cl. 1 C.W. In(°C) value not more than 100.'
    //   );
    //   return;
    // }
    // if (
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Air_Cooler_1_Cooling_Water_Out &&
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Air_Cooler_1_Cooling_Water_Out > 100
    // ) {
    //   this.notificationService.error(
    //     '',
    //     'Air Cl. 1 C.W. Out(°C) value not more than 100.'
    //   );
    //   return;
    // }
    // if (
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Air_Cooler_2_Cooling_Water_In &&
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Air_Cooler_2_Cooling_Water_In > 100
    // ) {
    //   this.notificationService.error(
    //     '',
    //     'Air Cl. 2 C.W. In(°C) value not more than 100.'
    //   );
    //   return;
    // }

    // if (
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Air_Cooler_2_Cooling_Water_Out &&
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Air_Cooler_2_Cooling_Water_Out > 100
    // ) {
    //   this.notificationService.error(
    //     '',
    //     'Air Cl. 2 C.W. Out(°C) value not more than 100.'
    //   );
    //   return;
    // }
    // if (
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Air_Cooler_3_Cooling_Water_In &&
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Air_Cooler_3_Cooling_Water_In > 100
    // ) {
    //   this.notificationService.error(
    //     '',
    //     'Air Cl. 3 C.W. In(°C) value not more than 100.'
    //   );
    //   return;
    // }

    // if (
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Air_Cooler_3_Cooling_Water_Out &&
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Air_Cooler_3_Cooling_Water_Out > 100
    // ) {
    //   this.notificationService.error(
    //     '',
    //     'Air Cl. 3 C.W. Out(°C) value not more than 100.'
    //   );
    //   return;
    // }

    // if (
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Exht_Receiver_Pressure &&
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Exht_Receiver_Pressure > 5
    // ) {
    //   this.notificationService.error(
    //     '',
    //     'Exh. Pr. Recv. (bar) value not more than 5.'
    //   );
    //   return;
    // }

    // Air, Fuel Oil & Lubrication Oil
    // if (
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Scavenge_Receiver_Pressure &&
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Scavenge_Receiver_Pressure > 5
    // ) {
    //   this.notificationService.error(
    //     '',
    //     'Scav. Rec. Pr (bar) value not more than 5.'
    //   );
    //   return;
    // }
    // if (
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Scavenge_Received_Temp &&
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Scavenge_Received_Temp < 0
    // ) {
    //   this.notificationService.error(
    //     '',
    //     'Scav. Rec. Temp. (°C) value not less than 0.'
    //   );
    //   return;
    // }
    // if (
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Scavenge_Received_Temp &&
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Scavenge_Received_Temp > 100
    // ) {
    //   this.notificationService.error(
    //     '',
    //     'Scav. Rec. Temp. (°C) value not more than 100.'
    //   );
    //   return;
    // }
    // if (
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Air_Cooler_1_Air_In &&
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Air_Cooler_1_Air_In < 0
    // ) {
    //   this.notificationService.error(
    //     '',
    //     'Air Cl. 1 Air In value not less than 0.'
    //   );
    //   return;
    // }
    // if (
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Air_Cooler_1_Air_In &&
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Air_Cooler_1_Air_In > 100
    // ) {
    //   this.notificationService.error(
    //     '',
    //     'Air Cl. 1 Air In value not more than 100.'
    //   );
    //   return;
    // }
    // if (
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Air_Cooler_1_Air_Out &&
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Air_Cooler_1_Air_Out < 0
    // ) {
    //   this.notificationService.error(
    //     '',
    //     'Air Cl. 1 Air Out value not less than 0.'
    //   );
    //   return;
    // }
    // if (
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Air_Cooler_2_Air_Out &&
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Air_Cooler_2_Air_Out > 100
    // ) {
    //   this.notificationService.error(
    //     '',
    //     'Air Cl. 1 Air Out value not more than 100.'
    //   );
    //   return;
    // }
    // if (
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Air_Cooler_2_Air_In &&
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Air_Cooler_2_Air_In > 100
    // ) {
    //   this.notificationService.error(
    //     '',
    //     'Air Cl. 2 Air In value not more than 100.'
    //   );
    //   return;
    // }
    // if (
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Air_Cooler_2_Air_In &&
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Air_Cooler_2_Air_In > 100
    // ) {
    //   this.notificationService.error(
    //     '',
    //     'Air Cl. 2 Air In value not more than 100.'
    //   );
    //   return;
    // }
    // if (
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Air_Cooler_2_Air_Out &&
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Air_Cooler_2_Air_Out > 100
    // ) {
    //   this.notificationService.error(
    //     '',
    //     'Air Cl. 2 Air Out value not more than 100.'
    //   );
    //   return;
    // }

    // if (
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Air_Cooling_3_Air_Out &&
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Air_Cooling_3_Air_Out > 100
    // ) {
    //   this.notificationService.error(
    //     '',
    //     'Air Cl. 3 Air Out value not more than 100.'
    //   );
    //   return;
    // }
    // if (
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Air_Cooling_3_Air_Out &&
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Air_Cooling_3_Air_Out < 0
    // ) {
    //   this.notificationService.error(
    //     '',
    //     'Air Cl. 3 Air Out value not less than 0.'
    //   );
    //   return;
    // }
    // if (
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Air_Cooling_3_Air_In &&
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Air_Cooling_3_Air_In < 0
    // ) {
    //   this.notificationService.error(
    //     '',
    //     'Air Cl. 3 Air In value not less than 0.'
    //   );
    //   return;
    // }
    // if (
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Air_Cooling_3_Air_In &&
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Air_Cooling_3_Air_In > 100
    // ) {
    //   this.notificationService.error(
    //     '',
    //     'Air Cl. 3 Air In value not more than 100.'
    //   );
    //   return;
    // }

    // if (
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Main_Lube_Oil_Tempertature &&
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Main_Lube_Oil_Tempertature < 0
    // ) {
    //   this.notificationService.error(
    //     '',
    //     'Main L.O. Temp (°C) value not less than 0.'
    //   );
    //   return;
    // }

    // if (
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Main_Lube_Oil_Tempertature &&
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Main_Lube_Oil_Tempertature > 100
    // ) {
    //   this.notificationService.error(
    //     '',
    //     'Main L.O. Temp (°C) value not more than 0.'
    //   );
    //   return;
    // }

    // if (
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Main_Lube_Oil_Pressure &&
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Main_Lube_Oil_Pressure > 10
    // ) {
    //   this.notificationService.error(
    //     '',
    //     'Main L.O. Pr. (bar) value not more than 10.'
    //   );
    //   return;
    // }

    // if (
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Main_Lube_Oil_Pressure &&
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Main_Lube_Oil_Pressure < 0
    // ) {
    //   this.notificationService.error(
    //     '',
    //     'Main L.O. Pr. (bar) value not less than 0.'
    //   );
    //   return;
    // }

    // if (
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Servo_Oil_Pressure &&
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Servo_Oil_Pressure < 0
    // ) {
    //   this.notificationService.error(
    //     '',
    //     'Servo Oil Pr. (bar) value not less than 0.'
    //   );
    //   return;
    // }

    // if (
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Servo_Oil_Pressure &&
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Servo_Oil_Pressure > 500
    // ) {
    //   this.notificationService.error(
    //     '',
    //     'Servo Oil Pr. (bar) value not more than 500.'
    //   );
    //   return;
    // }

    // if (
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Differential_Pressure_Air_Filter &&
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Differential_Pressure_Air_Filter > 100
    // ) {
    //   this.notificationService.error(
    //     '',
    //     'Diff. Pr. Air Filt. (mmWc) value not more than 100.'
    //   );
    //   return;
    // }

    // if (
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Differential_Pressure_Air_Filter &&
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Differential_Pressure_Air_Filter < 0
    // ) {
    //   this.notificationService.error(
    //     '',
    //     'Diff. Pr. Air Filt. (mmWc) value not less than 0.'
    //   );
    //   return;
    // }

    // if (
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_TC_Lube_Oil_Inlet_Temperature &&
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_TC_Lube_Oil_Inlet_Temperature < 0
    // ) {
    //   this.notificationService.error(
    //     '',
    //     'T/C L.O. In Temp (°C) value not less than 0.'
    //   );
    //   return;
    // }

    // if (
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_TC_Lube_Oil_Inlet_Temperature &&
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_TC_Lube_Oil_Inlet_Temperature > 100
    // ) {
    //   this.notificationService.error(
    //     '',
    //     'T/C L.O. In Temp (°C) value not more than 100.'
    //   );
    //   return;
    // }

    // if (
    //   this.addUpdateMainEngPermorfanceReportForm.value.ME1_PERF_Fuel_Oil_Temp &&
    //   this.addUpdateMainEngPermorfanceReportForm.value.ME1_PERF_Fuel_Oil_Temp >
    //     200
    // ) {
    //   this.notificationService.error(
    //     '',
    //     'Fuel Oil. Temp (°C) value not more than 200.'
    //   );
    //   return;
    // }
    // if (
    //   this.addUpdateMainEngPermorfanceReportForm.value.ME1_PERF_Fuel_Oil_Temp &&
    //   this.addUpdateMainEngPermorfanceReportForm.value.ME1_PERF_Fuel_Oil_Temp <
    //     0
    // ) {
    //   this.notificationService.error(
    //     '',
    //     'Fuel Oil. Temp (°C) value not less than 0.'
    //   );
    //   return;
    // }
    // if (
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Axial_Vibration &&
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Axial_Vibration < 0
    // ) {
    //   this.notificationService.error(
    //     '',
    //     'Axial Vibration (mm) value not less than 0.'
    //   );
    //   return;
    // }
    // if (
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Axial_Vibration &&
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Axial_Vibration > 100
    // ) {
    //   this.notificationService.error(
    //     '',
    //     'Axial Vibration (mm) value not more than 100.'
    //   );
    //   return;
    // }
    // if (
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Fuel_Oil_Pressure &&
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Fuel_Oil_Pressure > 50
    // ) {
    //   this.notificationService.error(
    //     '',
    //     'Fuel Oil. Pr. (bar) value not more than 50.'
    //   );
    //   return;
    // }
    // if (
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Fuel_Oil_Pressure &&
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Fuel_Oil_Pressure < 0
    // ) {
    //   this.notificationService.error(
    //     '',
    //     'Fuel Oil. Pr. (bar) value not less than 0.'
    //   );
    //   return;
    // }

    // if (
    //   this.addUpdateMainEngPermorfanceReportForm.value.ME1_PERF_Fuel_Index &&
    //   this.addUpdateMainEngPermorfanceReportForm.value.ME1_PERF_Fuel_Index < 0
    // ) {
    //   this.notificationService.error('', 'Fuel Index value not less than 0.');
    //   return;
    // }
    // if (
    //   this.addUpdateMainEngPermorfanceReportForm.value.ME1_PERF_Fuel_Index &&
    //   this.addUpdateMainEngPermorfanceReportForm.value.ME1_PERF_Fuel_Index > 50
    // ) {
    //   this.notificationService.error('', 'Fuel Index value not more than 50.');
    //   return;
    // }

    // if (
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Fuel_Oil_Rail_Pressure &&
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Fuel_Oil_Rail_Pressure > 2000
    // ) {
    //   this.notificationService.error(
    //     '',
    //     'Fuel Oil. Rail Pr. (bar) value not more than 2000.'
    //   );
    //   return;
    // }
    // if (
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Fuel_Oil_Rail_Pressure &&
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Fuel_Oil_Rail_Pressure < 0
    // ) {
    //   this.notificationService.error(
    //     '',
    //     'Fuel Oil. Rail Pr. (bar) value not less than 0.'
    //   );
    //   return;
    // }

    // Main Engine Performance - Unit 1
    // if (
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Unit_1_Mean_Pressure &&
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Unit_1_Mean_Pressure < 0
    // ) {
    //   this.notificationService.error(
    //     '',
    //     'Mean Pr. (bar) value not less than 0.'
    //   );
    //   return;
    // }
    // if (
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Unit_1_Mean_Pressure &&
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Unit_1_Mean_Pressure > 500
    // ) {
    //   this.notificationService.error(
    //     '',
    //     'Mean Pr. (bar) value not more than 500.'
    //   );
    //   return;
    // }

    // if (
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Unit_1_Fuel_Qulaity_Setting &&
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Unit_1_Fuel_Qulaity_Setting < 0
    // ) {
    //   this.notificationService.error('', 'FQA [%] value not less than 0.');
    //   return;
    // }
    // if (
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Unit_1_Fuel_Qulaity_Setting &&
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Unit_1_Fuel_Qulaity_Setting > 100
    // ) {
    //   this.notificationService.error('', 'FQA [%] value not more than 100.');
    //   return;
    // }
    // if (
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Unit_1_Exhaust_Temperature &&
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Unit_1_Exhaust_Temperature < 0
    // ) {
    //   this.notificationService.error(
    //     '',
    //     'Exh. Temp (°C) value not less than 0.'
    //   );
    //   return;
    // }
    // if (
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Unit_1_Exhaust_Temperature &&
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Unit_1_Exhaust_Temperature > 500
    // ) {
    //   this.notificationService.error(
    //     '',
    //     'Exh. Temp (°C) value not more than 500.'
    //   );
    //   return;
    // }
    // if (
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Unit_1_Pressure_Max &&
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Unit_1_Pressure_Max < 0
    // ) {
    //   this.notificationService.error('', 'Pmax (bar) value not less than 0.');
    //   return;
    // }
    // if (
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Unit_1_Pressure_Max &&
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Unit_1_Pressure_Max > 500
    // ) {
    //   this.notificationService.error('', 'Pmax (bar) value not more than 500.');
    //   return;
    // }
    // if (
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Unit_1_High_Load_Off_Percentage &&
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Unit_1_High_Load_Off_Percentage < 0
    // ) {
    //   this.notificationService.error(
    //     '',
    //     'High Load Off. (%) value not less than 0.'
    //   );
    //   return;
    // }
    // if (
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Unit_1_High_Load_Off_Percentage &&
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Unit_1_High_Load_Off_Percentage > 100
    // ) {
    //   this.notificationService.error(
    //     '',
    //     'High Load Off. (%) value not more than 100.'
    //   );
    //   return;
    // }
    // if (
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Unit_1_Colling_Water_Out_Temperature &&
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Unit_1_Colling_Water_Out_Temperature < 0
    // ) {
    //   this.notificationService.error(
    //     '',
    //     'C.W. Out. Temp. (°C) value not less than 0.'
    //   );
    //   return;
    // }
    // if (
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Unit_1_Colling_Water_Out_Temperature &&
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Unit_1_Colling_Water_Out_Temperature > 100
    // ) {
    //   this.notificationService.error(
    //     '',
    //     'C.W. Out. Temp. (°C) value not more than 100.'
    //   );
    //   return;
    // }
    // if (
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Unit_1_Pressure_compressure &&
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Unit_1_Pressure_compressure < 0
    // ) {
    //   this.notificationService.error('', 'Pcomp [bar] value not less than 0.');
    //   return;
    // }
    // if (
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Unit_1_Pressure_compressure &&
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Unit_1_Pressure_compressure > 500
    // ) {
    //   this.notificationService.error(
    //     '',
    //     'Pcomp [bar] value not more than 500.'
    //   );
    //   return;
    // }
    // if (
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Unit_1_Low_Load_Off &&
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Unit_1_Low_Load_Off < 0
    // ) {
    //   this.notificationService.error(
    //     '',
    //     'Low Load Off. (%) value not less than 0.'
    //   );
    //   return;
    // }
    // if (
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Unit_1_Low_Load_Off &&
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Unit_1_Low_Load_Off > 100
    // ) {
    //   this.notificationService.error(
    //     '',
    //     'Low Load Off. (%) value not more than 100.'
    //   );
    //   return;
    // }

    // if (
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Unit_1_Piston_Out_Temperature &&
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Unit_1_Piston_Out_Temperature < 0
    // ) {
    //   this.notificationService.error(
    //     '',
    //     'Pist. Out. Temp. (°C) value not less than 0.'
    //   );
    //   return;
    // }
    // if (
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Unit_1_Piston_Out_Temperature &&
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Unit_1_Piston_Out_Temperature > 100
    // ) {
    //   this.notificationService.error(
    //     '',
    //     'Pist. Out. Temp. (°C) value not more than 100.'
    //   );
    //   return;
    // }

    // if (
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Unit_1_Output_Indicated &&
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Unit_1_Output_Indicated < 0
    // ) {
    //   this.notificationService.error(
    //     '',
    //     'Outp. Ind. (kW) value not less than 0.'
    //   );
    //   return;
    // }
    // if (
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Unit_1_Output_Indicated &&
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Unit_1_Output_Indicated > 20000
    // ) {
    //   this.notificationService.error(
    //     '',
    //     'Outp. Ind. (kW) value not more than 20000.'
    //   );
    //   return;
    // }
    // if (
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Unit_1_Fuel_Index &&
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Unit_1_Fuel_Index < 0
    // ) {
    //   this.notificationService.error(
    //     '',
    //     'Fuel Index (mm) value not less than 0.'
    //   );
    //   return;
    // }
    // if (
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Unit_1_Fuel_Index &&
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Unit_1_Fuel_Index > 100
    // ) {
    //   this.notificationService.error(
    //     '',
    //     'Fuel Index (mm) value not more than 100.'
    //   );
    //   return;
    // }
    // if (
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Unit_1_Variable_Enjection_Timing_Index &&
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Unit_1_Variable_Enjection_Timing_Index < 0
    // ) {
    //   this.notificationService.error(
    //     '',
    //     'VIT Index (mm) value not less than 0.'
    //   );
    //   return;
    // }
    // if (
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Unit_1_Variable_Enjection_Timing_Index &&
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Unit_1_Variable_Enjection_Timing_Index > 100
    // ) {
    //   this.notificationService.error(
    //     '',
    //     'VIT Index (mm) value not more than 100.'
    //   );
    //   return;
    // }

    // Main Engine Performance - Unit 2
    // if (
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Unit_2_Mean_Pressure &&
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Unit_2_Mean_Pressure < 0
    // ) {
    //   this.notificationService.error(
    //     '',
    //     'Mean Pr. (bar) value not less than 0.'
    //   );
    //   return;
    // }
    // if (
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Unit_2_Mean_Pressure &&
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Unit_2_Mean_Pressure > 500
    // ) {
    //   this.notificationService.error(
    //     '',
    //     'Mean Pr. (bar) value not more than 500.'
    //   );
    //   return;
    // }

    // if (
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Unit_2_Fuel_Qulaity_Setting &&
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Unit_2_Fuel_Qulaity_Setting < 0
    // ) {
    //   this.notificationService.error('', 'FQA [%] value not less than 0.');
    //   return;
    // }
    // if (
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Unit_2_Fuel_Qulaity_Setting &&
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Unit_2_Fuel_Qulaity_Setting > 100
    // ) {
    //   this.notificationService.error('', 'FQA [%] value not more than 100.');
    //   return;
    // }
    // if (
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Unit_2_Exhaust_Temperature &&
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Unit_2_Exhaust_Temperature < 0
    // ) {
    //   this.notificationService.error(
    //     '',
    //     'Exh. Temp (°C) value not less than 0.'
    //   );
    //   return;
    // }
    // if (
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Unit_2_Exhaust_Temperature &&
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Unit_2_Exhaust_Temperature > 500
    // ) {
    //   this.notificationService.error(
    //     '',
    //     'Exh. Temp (°C) value not more than 500.'
    //   );
    //   return;
    // }
    // if (
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Unit_2_Pressure_Max &&
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Unit_2_Pressure_Max < 0
    // ) {
    //   this.notificationService.error('', 'Pmax (bar) value not less than 0.');
    //   return;
    // }
    // if (
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Unit_2_Pressure_Max &&
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Unit_2_Pressure_Max > 500
    // ) {
    //   this.notificationService.error('', 'Pmax (bar) value not more than 500.');
    //   return;
    // }
    // if (
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Unit_2_High_Load_Off_Percentage &&
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Unit_2_High_Load_Off_Percentage < 0
    // ) {
    //   this.notificationService.error(
    //     '',
    //     'High Load Off. (%) value not less than 0.'
    //   );
    //   return;
    // }
    // if (
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Unit_2_High_Load_Off_Percentage &&
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Unit_2_High_Load_Off_Percentage > 100
    // ) {
    //   this.notificationService.error(
    //     '',
    //     'High Load Off. (%) value not more than 100.'
    //   );
    //   return;
    // }
    // if (
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Unit_2_Colling_Water_Out_Temperature &&
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Unit_2_Colling_Water_Out_Temperature < 0
    // ) {
    //   this.notificationService.error(
    //     '',
    //     'C.W. Out. Temp. (°C) value not less than 0.'
    //   );
    //   return;
    // }
    // if (
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Unit_2_Colling_Water_Out_Temperature &&
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Unit_2_Colling_Water_Out_Temperature > 100
    // ) {
    //   this.notificationService.error(
    //     '',
    //     'C.W. Out. Temp. (°C) value not more than 100.'
    //   );
    //   return;
    // }
    // if (
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Unit_2_Pressure_compressure &&
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Unit_2_Pressure_compressure < 0
    // ) {
    //   this.notificationService.error('', 'Pcomp [bar] value not less than 0.');
    //   return;
    // }
    // if (
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Unit_2_Pressure_compressure &&
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Unit_2_Pressure_compressure > 500
    // ) {
    //   this.notificationService.error(
    //     '',
    //     'Pcomp [bar] value not more than 500.'
    //   );
    //   return;
    // }
    // if (
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Unit_2_Low_Load_Off &&
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Unit_2_Low_Load_Off < 0
    // ) {
    //   this.notificationService.error(
    //     '',
    //     'Low Load Off. (%) value not less than 0.'
    //   );
    //   return;
    // }
    // if (
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Unit_2_Low_Load_Off &&
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Unit_2_Low_Load_Off > 100
    // ) {
    //   this.notificationService.error(
    //     '',
    //     'Low Load Off. (%) value not more than 100.'
    //   );
    //   return;
    // }

    // if (
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Unit_2_Piston_Out_Temperature &&
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Unit_2_Piston_Out_Temperature < 0
    // ) {
    //   this.notificationService.error(
    //     '',
    //     'Pist. Out. Temp. (°C) value not less than 0.'
    //   );
    //   return;
    // }
    // if (
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Unit_2_Piston_Out_Temperature &&
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Unit_2_Piston_Out_Temperature > 100
    // ) {
    //   this.notificationService.error(
    //     '',
    //     'Pist. Out. Temp. (°C) value not more than 100.'
    //   );
    //   return;
    // }

    // if (
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Unit_2_Output_Indicated &&
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Unit_2_Output_Indicated < 0
    // ) {
    //   this.notificationService.error(
    //     '',
    //     'Outp. Ind. (kW) value not less than 0.'
    //   );
    //   return;
    // }
    // if (
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Unit_2_Output_Indicated &&
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Unit_2_Output_Indicated > 20000
    // ) {
    //   this.notificationService.error(
    //     '',
    //     'Outp. Ind. (kW) value not more than 20000.'
    //   );
    //   return;
    // }
    // if (
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Unit_2_Fuel_Index &&
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Unit_2_Fuel_Index < 0
    // ) {
    //   this.notificationService.error(
    //     '',
    //     'Fuel Index (mm) value not less than 0.'
    //   );
    //   return;
    // }
    // if (
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Unit_2_Fuel_Index &&
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Unit_2_Fuel_Index > 100
    // ) {
    //   this.notificationService.error(
    //     '',
    //     'Fuel Index (mm) value not more than 100.'
    //   );
    //   return;
    // }
    // if (
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Unit_2_Variable_Enjection_Timing_Index &&
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Unit_2_Variable_Enjection_Timing_Index < 0
    // ) {
    //   this.notificationService.error(
    //     '',
    //     'VIT Index (mm) value not less than 0.'
    //   );
    //   return;
    // }
    // if (
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Unit_2_Variable_Enjection_Timing_Index &&
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Unit_2_Variable_Enjection_Timing_Index > 100
    // ) {
    //   this.notificationService.error(
    //     '',
    //     'VIT Index (mm) value not more than 100.'
    //   );
    //   return;
    // }

    // Main Engine Performance - Unit 3
    // if (
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Unit_3_Mean_Pressure &&
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Unit_3_Mean_Pressure < 0
    // ) {
    //   this.notificationService.error(
    //     '',
    //     'Mean Pr. (bar) value not less than 0.'
    //   );
    //   return;
    // }
    // if (
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Unit_3_Mean_Pressure &&
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Unit_3_Mean_Pressure > 500
    // ) {
    //   this.notificationService.error(
    //     '',
    //     'Mean Pr. (bar) value not more than 500.'
    //   );
    //   return;
    // }

    // if (
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Unit_3_Fuel_Qulaity_Setting &&
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Unit_3_Fuel_Qulaity_Setting < 0
    // ) {
    //   this.notificationService.error('', 'FQA [%] value not less than 0.');
    //   return;
    // }
    // if (
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Unit_3_Fuel_Qulaity_Setting &&
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Unit_3_Fuel_Qulaity_Setting > 100
    // ) {
    //   this.notificationService.error('', 'FQA [%] value not more than 100.');
    //   return;
    // }
    // if (
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Unit_3_Exhaust_Temperature &&
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Unit_3_Exhaust_Temperature < 0
    // ) {
    //   this.notificationService.error(
    //     '',
    //     'Exh. Temp (°C) value not less than 0.'
    //   );
    //   return;
    // }
    // if (
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Unit_3_Exhaust_Temperature &&
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Unit_3_Exhaust_Temperature > 500
    // ) {
    //   this.notificationService.error(
    //     '',
    //     'Exh. Temp (°C) value not more than 500.'
    //   );
    //   return;
    // }
    // if (
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Unit_3_Pressure_Max &&
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Unit_3_Pressure_Max < 0
    // ) {
    //   this.notificationService.error('', 'Pmax (bar) value not less than 0.');
    //   return;
    // }
    // if (
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Unit_3_Pressure_Max &&
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Unit_3_Pressure_Max > 500
    // ) {
    //   this.notificationService.error('', 'Pmax (bar) value not more than 500.');
    //   return;
    // }
    // if (
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Unit_3_High_Load_Off_Percentage &&
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Unit_3_High_Load_Off_Percentage < 0
    // ) {
    //   this.notificationService.error(
    //     '',
    //     'High Load Off. (%) value not less than 0.'
    //   );
    //   return;
    // }
    // if (
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Unit_3_High_Load_Off_Percentage &&
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Unit_3_High_Load_Off_Percentage > 100
    // ) {
    //   this.notificationService.error(
    //     '',
    //     'High Load Off. (%) value not more than 100.'
    //   );
    //   return;
    // }
    // if (
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Unit_3_Colling_Water_Out_Temperature &&
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Unit_3_Colling_Water_Out_Temperature < 0
    // ) {
    //   this.notificationService.error(
    //     '',
    //     'C.W. Out. Temp. (°C) value not less than 0.'
    //   );
    //   return;
    // }
    // if (
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Unit_3_Colling_Water_Out_Temperature &&
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Unit_3_Colling_Water_Out_Temperature > 100
    // ) {
    //   this.notificationService.error(
    //     '',
    //     'C.W. Out. Temp. (°C) value not more than 100.'
    //   );
    //   return;
    // }
    // if (
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Unit_3_Pressure_compressure &&
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Unit_3_Pressure_compressure < 0
    // ) {
    //   this.notificationService.error('', 'Pcomp [bar] value not less than 0.');
    //   return;
    // }
    // if (
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Unit_3_Pressure_compressure &&
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Unit_3_Pressure_compressure > 500
    // ) {
    //   this.notificationService.error(
    //     '',
    //     'Pcomp [bar] value not more than 500.'
    //   );
    //   return;
    // }
    // if (
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Unit_3_Low_Load_Off &&
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Unit_3_Low_Load_Off < 0
    // ) {
    //   this.notificationService.error(
    //     '',
    //     'Low Load Off. (%) value not less than 0.'
    //   );
    //   return;
    // }
    // if (
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Unit_3_Low_Load_Off &&
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Unit_3_Low_Load_Off > 100
    // ) {
    //   this.notificationService.error(
    //     '',
    //     'Low Load Off. (%) value not more than 100.'
    //   );
    //   return;
    // }

    // if (
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Unit_3_Piston_Out_Temperature &&
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Unit_3_Piston_Out_Temperature < 0
    // ) {
    //   this.notificationService.error(
    //     '',
    //     'Pist. Out. Temp. (°C) value not less than 0.'
    //   );
    //   return;
    // }
    // if (
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Unit_3_Piston_Out_Temperature &&
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Unit_3_Piston_Out_Temperature > 100
    // ) {
    //   this.notificationService.error(
    //     '',
    //     'Pist. Out. Temp. (°C) value not more than 100.'
    //   );
    //   return;
    // }

    // if (
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Unit_3_Output_Indicated &&
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Unit_3_Output_Indicated < 0
    // ) {
    //   this.notificationService.error(
    //     '',
    //     'Outp. Ind. (kW) value not less than 0.'
    //   );
    //   return;
    // }
    // if (
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Unit_3_Output_Indicated &&
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Unit_3_Output_Indicated > 20000
    // ) {
    //   this.notificationService.error(
    //     '',
    //     'Outp. Ind. (kW) value not more than 20000.'
    //   );
    //   return;
    // }
    // if (
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Unit_3_Fuel_Index &&
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Unit_3_Fuel_Index < 0
    // ) {
    //   this.notificationService.error(
    //     '',
    //     'Fuel Index (mm) value not less than 0.'
    //   );
    //   return;
    // }
    // if (
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Unit_3_Fuel_Index &&
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Unit_3_Fuel_Index > 100
    // ) {
    //   this.notificationService.error(
    //     '',
    //     'Fuel Index (mm) value not more than 100.'
    //   );
    //   return;
    // }
    // if (
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Unit_3_Variable_Enjection_Timing_Index &&
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Unit_3_Variable_Enjection_Timing_Index < 0
    // ) {
    //   this.notificationService.error(
    //     '',
    //     'VIT Index (mm) value not less than 0.'
    //   );
    //   return;
    // }
    // if (
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Unit_3_Variable_Enjection_Timing_Index &&
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Unit_3_Variable_Enjection_Timing_Index > 100
    // ) {
    //   this.notificationService.error(
    //     '',
    //     'VIT Index (mm) value not more than 100.'
    //   );
    //   return;
    // }

    // Main Engine Performance - Unit 4
    // if (
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Unit_4_Mean_Pressure &&
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Unit_4_Mean_Pressure < 0
    // ) {
    //   this.notificationService.error(
    //     '',
    //     'Mean Pr. (bar) value not less than 0.'
    //   );
    //   return;
    // }
    // if (
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Unit_4_Mean_Pressure &&
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Unit_4_Mean_Pressure > 500
    // ) {
    //   this.notificationService.error(
    //     '',
    //     'Mean Pr. (bar) value not more than 500.'
    //   );
    //   return;
    // }

    // if (
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Unit_4_Fuel_Qulaity_Setting &&
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Unit_4_Fuel_Qulaity_Setting < 0
    // ) {
    //   this.notificationService.error('', 'FQA [%] value not less than 0.');
    //   return;
    // }
    // if (
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Unit_4_Fuel_Qulaity_Setting &&
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Unit_4_Fuel_Qulaity_Setting > 100
    // ) {
    //   this.notificationService.error('', 'FQA [%] value not more than 100.');
    //   return;
    // }
    // if (
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Unit_4_Exhaust_Temperature &&
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Unit_4_Exhaust_Temperature < 0
    // ) {
    //   this.notificationService.error(
    //     '',
    //     'Exh. Temp (°C) value not less than 0.'
    //   );
    //   return;
    // }
    // if (
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Unit_4_Exhaust_Temperature &&
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Unit_4_Exhaust_Temperature > 500
    // ) {
    //   this.notificationService.error(
    //     '',
    //     'Exh. Temp (°C) value not more than 500.'
    //   );
    //   return;
    // }
    // if (
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Unit_4_Pressure_Max &&
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Unit_4_Pressure_Max < 0
    // ) {
    //   this.notificationService.error('', 'Pmax (bar) value not less than 0.');
    //   return;
    // }
    // if (
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Unit_4_Pressure_Max &&
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Unit_4_Pressure_Max > 500
    // ) {
    //   this.notificationService.error('', 'Pmax (bar) value not more than 500.');
    //   return;
    // }
    // if (
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Unit_4_High_Load_Off_Percentage &&
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Unit_4_High_Load_Off_Percentage < 0
    // ) {
    //   this.notificationService.error(
    //     '',
    //     'High Load Off. (%) value not less than 0.'
    //   );
    //   return;
    // }
    // if (
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Unit_4_High_Load_Off_Percentage &&
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Unit_4_High_Load_Off_Percentage > 100
    // ) {
    //   this.notificationService.error(
    //     '',
    //     'High Load Off. (%) value not more than 100.'
    //   );
    //   return;
    // }
    // if (
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Unit_4_Colling_Water_Out_Temperature &&
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Unit_4_Colling_Water_Out_Temperature < 0
    // ) {
    //   this.notificationService.error(
    //     '',
    //     'C.W. Out. Temp. (°C) value not less than 0.'
    //   );
    //   return;
    // }
    // if (
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Unit_4_Colling_Water_Out_Temperature &&
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Unit_4_Colling_Water_Out_Temperature > 100
    // ) {
    //   this.notificationService.error(
    //     '',
    //     'C.W. Out. Temp. (°C) value not more than 100.'
    //   );
    //   return;
    // }
    // if (
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Unit_4_Pressure_compressure &&
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Unit_4_Pressure_compressure < 0
    // ) {
    //   this.notificationService.error('', 'Pcomp [bar] value not less than 0.');
    //   return;
    // }
    // if (
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Unit_4_Pressure_compressure &&
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Unit_4_Pressure_compressure > 500
    // ) {
    //   this.notificationService.error(
    //     '',
    //     'Pcomp [bar] value not more than 500.'
    //   );
    //   return;
    // }
    // if (
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Unit_4_Low_Load_Off &&
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Unit_4_Low_Load_Off < 0
    // ) {
    //   this.notificationService.error(
    //     '',
    //     'Low Load Off. (%) value not less than 0.'
    //   );
    //   return;
    // }
    // if (
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Unit_4_Low_Load_Off &&
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Unit_4_Low_Load_Off > 100
    // ) {
    //   this.notificationService.error(
    //     '',
    //     'Low Load Off. (%) value not more than 100.'
    //   );
    //   return;
    // }

    // if (
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Unit_4_Piston_Out_Temperature &&
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Unit_4_Piston_Out_Temperature < 0
    // ) {
    //   this.notificationService.error(
    //     '',
    //     'Pist. Out. Temp. (°C) value not less than 0.'
    //   );
    //   return;
    // }
    // if (
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Unit_4_Piston_Out_Temperature &&
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Unit_4_Piston_Out_Temperature > 100
    // ) {
    //   this.notificationService.error(
    //     '',
    //     'Pist. Out. Temp. (°C) value not more than 100.'
    //   );
    //   return;
    // }

    // if (
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Unit_4_Output_Indicated &&
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Unit_4_Output_Indicated < 0
    // ) {
    //   this.notificationService.error(
    //     '',
    //     'Outp. Ind. (kW) value not less than 0.'
    //   );
    //   return;
    // }
    // if (
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Unit_4_Output_Indicated &&
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Unit_4_Output_Indicated > 20000
    // ) {
    //   this.notificationService.error(
    //     '',
    //     'Outp. Ind. (kW) value not more than 20000.'
    //   );
    //   return;
    // }
    // if (
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Unit_4_Fuel_Index &&
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Unit_4_Fuel_Index < 0
    // ) {
    //   this.notificationService.error(
    //     '',
    //     'Fuel Index (mm) value not less than 0.'
    //   );
    //   return;
    // }
    // if (
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Unit_4_Fuel_Index &&
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Unit_4_Fuel_Index > 100
    // ) {
    //   this.notificationService.error(
    //     '',
    //     'Fuel Index (mm) value not more than 100.'
    //   );
    //   return;
    // }
    // if (
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Unit_4_Variable_Enjection_Timing_Index &&
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Unit_4_Variable_Enjection_Timing_Index < 0
    // ) {
    //   this.notificationService.error(
    //     '',
    //     'VIT Index (mm) value not less than 0.'
    //   );
    //   return;
    // }
    // if (
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Unit_4_Variable_Enjection_Timing_Index &&
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Unit_4_Variable_Enjection_Timing_Index > 100
    // ) {
    //   this.notificationService.error(
    //     '',
    //     'VIT Index (mm) value not more than 100.'
    //   );
    //   return;
    // }

    // Main Engine Performance - Unit 5
    // if (
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Unit_5_Mean_Pressure &&
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Unit_5_Mean_Pressure < 0
    // ) {
    //   this.notificationService.error(
    //     '',
    //     'Mean Pr. (bar) value not less than 0.'
    //   );
    //   return;
    // }
    // if (
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Unit_5_Mean_Pressure &&
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Unit_5_Mean_Pressure > 500
    // ) {
    //   this.notificationService.error(
    //     '',
    //     'Mean Pr. (bar) value not more than 500.'
    //   );
    //   return;
    // }

    // if (
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Unit_5_Fuel_Qulaity_Setting &&
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Unit_5_Fuel_Qulaity_Setting < 0
    // ) {
    //   this.notificationService.error('', 'FQA [%] value not less than 0.');
    //   return;
    // }
    // if (
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Unit_5_Fuel_Qulaity_Setting &&
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Unit_5_Fuel_Qulaity_Setting > 100
    // ) {
    //   this.notificationService.error('', 'FQA [%] value not more than 100.');
    //   return;
    // }
    // if (
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Unit_5_Exhaust_Temperature &&
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Unit_5_Exhaust_Temperature < 0
    // ) {
    //   this.notificationService.error(
    //     '',
    //     'Exh. Temp (°C) value not less than 0.'
    //   );
    //   return;
    // }
    // if (
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Unit_5_Exhaust_Temperature &&
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Unit_5_Exhaust_Temperature > 500
    // ) {
    //   this.notificationService.error(
    //     '',
    //     'Exh. Temp (°C) value not more than 500.'
    //   );
    //   return;
    // }
    // if (
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Unit_5_Pressure_Max &&
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Unit_5_Pressure_Max < 0
    // ) {
    //   this.notificationService.error('', 'Pmax (bar) value not less than 0.');
    //   return;
    // }
    // if (
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Unit_5_Pressure_Max &&
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Unit_5_Pressure_Max > 500
    // ) {
    //   this.notificationService.error('', 'Pmax (bar) value not more than 500.');
    //   return;
    // }
    // if (
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Unit_5_High_Load_Off_Percentage &&
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Unit_5_High_Load_Off_Percentage < 0
    // ) {
    //   this.notificationService.error(
    //     '',
    //     'High Load Off. (%) value not less than 0.'
    //   );
    //   return;
    // }
    // if (
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Unit_5_High_Load_Off_Percentage &&
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Unit_5_High_Load_Off_Percentage > 100
    // ) {
    //   this.notificationService.error(
    //     '',
    //     'High Load Off. (%) value not more than 100.'
    //   );
    //   return;
    // }
    // if (
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Unit_5_Colling_Water_Out_Temperature &&
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Unit_5_Colling_Water_Out_Temperature < 0
    // ) {
    //   this.notificationService.error(
    //     '',
    //     'C.W. Out. Temp. (°C) value not less than 0.'
    //   );
    //   return;
    // }
    // if (
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Unit_5_Colling_Water_Out_Temperature &&
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Unit_5_Colling_Water_Out_Temperature > 100
    // ) {
    //   this.notificationService.error(
    //     '',
    //     'C.W. Out. Temp. (°C) value not more than 100.'
    //   );
    //   return;
    // }
    // if (
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Unit_5_Pressure_compressure &&
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Unit_5_Pressure_compressure < 0
    // ) {
    //   this.notificationService.error('', 'Pcomp [bar] value not less than 0.');
    //   return;
    // }
    // if (
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Unit_5_Pressure_compressure &&
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Unit_5_Pressure_compressure > 500
    // ) {
    //   this.notificationService.error(
    //     '',
    //     'Pcomp [bar] value not more than 500.'
    //   );
    //   return;
    // }
    // if (
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Unit_5_Low_Load_Off &&
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Unit_5_Low_Load_Off < 0
    // ) {
    //   this.notificationService.error(
    //     '',
    //     'Low Load Off. (%) value not less than 0.'
    //   );
    //   return;
    // }
    // if (
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Unit_5_Low_Load_Off &&
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Unit_5_Low_Load_Off > 100
    // ) {
    //   this.notificationService.error(
    //     '',
    //     'Low Load Off. (%) value not more than 100.'
    //   );
    //   return;
    // }

    // if (
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Unit_5_Piston_Out_Temperature &&
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Unit_5_Piston_Out_Temperature < 0
    // ) {
    //   this.notificationService.error(
    //     '',
    //     'Pist. Out. Temp. (°C) value not less than 0.'
    //   );
    //   return;
    // }
    // if (
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Unit_5_Piston_Out_Temperature &&
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Unit_5_Piston_Out_Temperature > 100
    // ) {
    //   this.notificationService.error(
    //     '',
    //     'Pist. Out. Temp. (°C) value not more than 100.'
    //   );
    //   return;
    // }

    // if (
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Unit_5_Output_Indicated &&
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Unit_5_Output_Indicated < 0
    // ) {
    //   this.notificationService.error(
    //     '',
    //     'Outp. Ind. (kW) value not less than 0.'
    //   );
    //   return;
    // }
    // if (
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Unit_5_Output_Indicated &&
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Unit_5_Output_Indicated > 20000
    // ) {
    //   this.notificationService.error(
    //     '',
    //     'Outp. Ind. (kW) value not more than 20000.'
    //   );
    //   return;
    // }
    // if (
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Unit_5_Fuel_Index &&
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Unit_5_Fuel_Index < 0
    // ) {
    //   this.notificationService.error(
    //     '',
    //     'Fuel Index (mm) value not less than 0.'
    //   );
    //   return;
    // }
    // if (
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Unit_5_Fuel_Index &&
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Unit_5_Fuel_Index > 100
    // ) {
    //   this.notificationService.error(
    //     '',
    //     'Fuel Index (mm) value not more than 100.'
    //   );
    //   return;
    // }
    // if (
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Unit_5_Variable_Enjection_Timing_Index &&
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Unit_5_Variable_Enjection_Timing_Index < 0
    // ) {
    //   this.notificationService.error(
    //     '',
    //     'VIT Index (mm) value not less than 0.'
    //   );
    //   return;
    // }
    // if (
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Unit_5_Variable_Enjection_Timing_Index &&
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Unit_5_Variable_Enjection_Timing_Index > 100
    // ) {
    //   this.notificationService.error(
    //     '',
    //     'VIT Index (mm) value not more than 100.'
    //   );
    //   return;
    // }

    // Main Engine Performance - Unit 6
    // if (
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Unit_6_Mean_Pressure &&
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Unit_6_Mean_Pressure < 0
    // ) {
    //   this.notificationService.error(
    //     '',
    //     'Mean Pr. (bar) value not less than 0.'
    //   );
    //   return;
    // }
    // if (
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Unit_6_Mean_Pressure &&
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Unit_6_Mean_Pressure > 500
    // ) {
    //   this.notificationService.error(
    //     '',
    //     'Mean Pr. (bar) value not more than 500.'
    //   );
    //   return;
    // }

    // if (
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Unit_6_Fuel_Qulaity_Setting &&
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Unit_6_Fuel_Qulaity_Setting < 0
    // ) {
    //   this.notificationService.error('', 'FQA [%] value not less than 0.');
    //   return;
    // }
    // if (
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Unit_6_Fuel_Qulaity_Setting &&
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Unit_6_Fuel_Qulaity_Setting > 100
    // ) {
    //   this.notificationService.error('', 'FQA [%] value not more than 100.');
    //   return;
    // }
    // if (
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Unit_6_Exhaust_Temperature &&
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Unit_6_Exhaust_Temperature < 0
    // ) {
    //   this.notificationService.error(
    //     '',
    //     'Exh. Temp (°C) value not less than 0.'
    //   );
    //   return;
    // }
    // if (
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Unit_6_Exhaust_Temperature &&
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Unit_6_Exhaust_Temperature > 500
    // ) {
    //   this.notificationService.error(
    //     '',
    //     'Exh. Temp (°C) value not more than 500.'
    //   );
    //   return;
    // }
    // if (
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Unit_6_Pressure_Max &&
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Unit_6_Pressure_Max < 0
    // ) {
    //   this.notificationService.error('', 'Pmax (bar) value not less than 0.');
    //   return;
    // }
    // if (
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Unit_6_Pressure_Max &&
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Unit_6_Pressure_Max > 500
    // ) {
    //   this.notificationService.error('', 'Pmax (bar) value not more than 500.');
    //   return;
    // }
    // if (
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Unit_6_High_Load_Off_Percentage &&
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Unit_6_High_Load_Off_Percentage < 0
    // ) {
    //   this.notificationService.error(
    //     '',
    //     'High Load Off. (%) value not less than 0.'
    //   );
    //   return;
    // }
    // if (
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Unit_6_High_Load_Off_Percentage &&
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Unit_6_High_Load_Off_Percentage > 100
    // ) {
    //   this.notificationService.error(
    //     '',
    //     'High Load Off. (%) value not more than 100.'
    //   );
    //   return;
    // }
    // if (
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Unit_6_Colling_Water_Out_Temperature &&
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Unit_6_Colling_Water_Out_Temperature < 0
    // ) {
    //   this.notificationService.error(
    //     '',
    //     'C.W. Out. Temp. (°C) value not less than 0.'
    //   );
    //   return;
    // }
    // if (
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Unit_6_Colling_Water_Out_Temperature &&
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Unit_6_Colling_Water_Out_Temperature > 100
    // ) {
    //   this.notificationService.error(
    //     '',
    //     'C.W. Out. Temp. (°C) value not more than 100.'
    //   );
    //   return;
    // }
    // if (
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Unit_6_Pressure_compressure &&
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Unit_6_Pressure_compressure < 0
    // ) {
    //   this.notificationService.error('', 'Pcomp [bar] value not less than 0.');
    //   return;
    // }
    // if (
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Unit_6_Pressure_compressure &&
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Unit_6_Pressure_compressure > 500
    // ) {
    //   this.notificationService.error(
    //     '',
    //     'Pcomp [bar] value not more than 500.'
    //   );
    //   return;
    // }
    // if (
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Unit_6_Low_Load_Off &&
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Unit_6_Low_Load_Off < 0
    // ) {
    //   this.notificationService.error(
    //     '',
    //     'Low Load Off. (%) value not less than 0.'
    //   );
    //   return;
    // }
    // if (
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Unit_6_Low_Load_Off &&
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Unit_6_Low_Load_Off > 100
    // ) {
    //   this.notificationService.error(
    //     '',
    //     'Low Load Off. (%) value not more than 100.'
    //   );
    //   return;
    // }

    // if (
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Unit_6_Piston_Out_Temperature &&
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Unit_6_Piston_Out_Temperature < 0
    // ) {
    //   this.notificationService.error(
    //     '',
    //     'Pist. Out. Temp. (°C) value not less than 0.'
    //   );
    //   return;
    // }
    // if (
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Unit_6_Piston_Out_Temperature &&
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Unit_6_Piston_Out_Temperature > 100
    // ) {
    //   this.notificationService.error(
    //     '',
    //     'Pist. Out. Temp. (°C) value not more than 100.'
    //   );
    //   return;
    // }

    // if (
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Unit_6_Output_Indicated &&
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Unit_6_Output_Indicated < 0
    // ) {
    //   this.notificationService.error(
    //     '',
    //     'Outp. Ind. (kW) value not less than 0.'
    //   );
    //   return;
    // }
    // if (
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Unit_6_Output_Indicated &&
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Unit_6_Output_Indicated > 20000
    // ) {
    //   this.notificationService.error(
    //     '',
    //     'Outp. Ind. (kW) value not more than 20000.'
    //   );
    //   return;
    // }
    // if (
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Unit_6_Fuel_Index &&
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Unit_6_Fuel_Index < 0
    // ) {
    //   this.notificationService.error(
    //     '',
    //     'Fuel Index (mm) value not less than 0.'
    //   );
    //   return;
    // }
    // if (
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Unit_6_Fuel_Index &&
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Unit_6_Fuel_Index > 100
    // ) {
    //   this.notificationService.error(
    //     '',
    //     'Fuel Index (mm) value not more than 100.'
    //   );
    //   return;
    // }
    // if (
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Unit_6_Variable_Enjection_Timing_Index &&
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Unit_6_Variable_Enjection_Timing_Index < 0
    // ) {
    //   this.notificationService.error(
    //     '',
    //     'VIT Index (mm) value not less than 0.'
    //   );
    //   return;
    // }
    // if (
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Unit_6_Variable_Enjection_Timing_Index &&
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Unit_6_Variable_Enjection_Timing_Index > 100
    // ) {
    //   this.notificationService.error(
    //     '',
    //     'VIT Index (mm) value not more than 100.'
    //   );
    //   return;
    // }

    // Main Engine Performance - Unit 7
    // if (
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Unit_7_Mean_Pressure &&
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Unit_7_Mean_Pressure < 0
    // ) {
    //   this.notificationService.error(
    //     '',
    //     'Mean Pr. (bar) value not less than 0.'
    //   );
    //   return;
    // }
    // if (
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Unit_7_Mean_Pressure &&
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Unit_7_Mean_Pressure > 500
    // ) {
    //   this.notificationService.error(
    //     '',
    //     'Mean Pr. (bar) value not more than 500.'
    //   );
    //   return;
    // }

    // if (
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Unit_7_Fuel_Qulaity_Setting &&
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Unit_7_Fuel_Qulaity_Setting < 0
    // ) {
    //   this.notificationService.error('', 'FQA [%] value not less than 0.');
    //   return;
    // }
    // if (
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Unit_7_Fuel_Qulaity_Setting &&
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Unit_7_Fuel_Qulaity_Setting > 100
    // ) {
    //   this.notificationService.error('', 'FQA [%] value not more than 100.');
    //   return;
    // }
    // if (
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Unit_7_Exhaust_Temperature &&
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Unit_7_Exhaust_Temperature < 0
    // ) {
    //   this.notificationService.error(
    //     '',
    //     'Exh. Temp (°C) value not less than 0.'
    //   );
    //   return;
    // }
    // if (
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Unit_7_Exhaust_Temperature &&
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Unit_7_Exhaust_Temperature > 500
    // ) {
    //   this.notificationService.error(
    //     '',
    //     'Exh. Temp (°C) value not more than 500.'
    //   );
    //   return;
    // }
    // if (
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Unit_7_Pressure_Max &&
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Unit_7_Pressure_Max < 0
    // ) {
    //   this.notificationService.error('', 'Pmax (bar) value not less than 0.');
    //   return;
    // }
    // if (
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Unit_7_Pressure_Max &&
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Unit_7_Pressure_Max > 500
    // ) {
    //   this.notificationService.error('', 'Pmax (bar) value not more than 500.');
    //   return;
    // }
    // if (
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Unit_7_High_Load_Off_Percentage &&
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Unit_7_High_Load_Off_Percentage < 0
    // ) {
    //   this.notificationService.error(
    //     '',
    //     'High Load Off. (%) value not less than 0.'
    //   );
    //   return;
    // }
    // if (
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Unit_7_High_Load_Off_Percentage &&
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Unit_7_High_Load_Off_Percentage > 100
    // ) {
    //   this.notificationService.error(
    //     '',
    //     'High Load Off. (%) value not more than 100.'
    //   );
    //   return;
    // }
    // if (
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Unit_7_Colling_Water_Out_Temperature &&
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Unit_7_Colling_Water_Out_Temperature < 0
    // ) {
    //   this.notificationService.error(
    //     '',
    //     'C.W. Out. Temp. (°C) value not less than 0.'
    //   );
    //   return;
    // }
    // if (
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Unit_7_Colling_Water_Out_Temperature &&
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Unit_7_Colling_Water_Out_Temperature > 100
    // ) {
    //   this.notificationService.error(
    //     '',
    //     'C.W. Out. Temp. (°C) value not more than 100.'
    //   );
    //   return;
    // }
    // if (
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Unit_7_Pressure_compressure &&
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Unit_7_Pressure_compressure < 0
    // ) {
    //   this.notificationService.error('', 'Pcomp [bar] value not less than 0.');
    //   return;
    // }
    // if (
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Unit_7_Pressure_compressure &&
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Unit_7_Pressure_compressure > 500
    // ) {
    //   this.notificationService.error(
    //     '',
    //     'Pcomp [bar] value not more than 500.'
    //   );
    //   return;
    // }
    // if (
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Unit_7_Low_Load_Off &&
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Unit_7_Low_Load_Off < 0
    // ) {
    //   this.notificationService.error(
    //     '',
    //     'Low Load Off. (%) value not less than 0.'
    //   );
    //   return;
    // }
    // if (
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Unit_7_Low_Load_Off &&
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Unit_7_Low_Load_Off > 100
    // ) {
    //   this.notificationService.error(
    //     '',
    //     'Low Load Off. (%) value not more than 100.'
    //   );
    //   return;
    // }

    // if (
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Unit_7_Piston_Out_Temperature &&
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Unit_7_Piston_Out_Temperature < 0
    // ) {
    //   this.notificationService.error(
    //     '',
    //     'Pist. Out. Temp. (°C) value not less than 0.'
    //   );
    //   return;
    // }
    // if (
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Unit_7_Piston_Out_Temperature &&
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Unit_7_Piston_Out_Temperature > 100
    // ) {
    //   this.notificationService.error(
    //     '',
    //     'Pist. Out. Temp. (°C) value not more than 100.'
    //   );
    //   return;
    // }

    // if (
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Unit_7_Output_Indicated &&
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Unit_7_Output_Indicated < 0
    // ) {
    //   this.notificationService.error(
    //     '',
    //     'Outp. Ind. (kW) value not less than 0.'
    //   );
    //   return;
    // }
    // if (
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Unit_7_Output_Indicated &&
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Unit_7_Output_Indicated > 20000
    // ) {
    //   this.notificationService.error(
    //     '',
    //     'Outp. Ind. (kW) value not more than 20000.'
    //   );
    //   return;
    // }
    // if (
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Unit_7_Fuel_Index &&
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Unit_7_Fuel_Index < 0
    // ) {
    //   this.notificationService.error(
    //     '',
    //     'Fuel Index (mm) value not less than 0.'
    //   );
    //   return;
    // }
    // if (
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Unit_7_Fuel_Index &&
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Unit_7_Fuel_Index > 100
    // ) {
    //   this.notificationService.error(
    //     '',
    //     'Fuel Index (mm) value not more than 100.'
    //   );
    //   return;
    // }
    // if (
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Unit_7_Variable_Enjection_Timing_Index &&
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Unit_7_Variable_Enjection_Timing_Index < 0
    // ) {
    //   this.notificationService.error(
    //     '',
    //     'VIT Index (mm) value not less than 0.'
    //   );
    //   return;
    // }
    // if (
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Unit_7_Variable_Enjection_Timing_Index &&
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Unit_7_Variable_Enjection_Timing_Index > 100
    // ) {
    //   this.notificationService.error(
    //     '',
    //     'VIT Index (mm) value not more than 100.'
    //   );
    //   return;
    // }

    // Main Engine Performance - Unit 8
    // if (
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Unit_8_Mean_Pressure &&
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Unit_8_Mean_Pressure < 0
    // ) {
    //   this.notificationService.error(
    //     '',
    //     'Mean Pr. (bar) value not less than 0.'
    //   );
    //   return;
    // }
    // if (
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Unit_8_Mean_Pressure &&
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Unit_8_Mean_Pressure > 500
    // ) {
    //   this.notificationService.error(
    //     '',
    //     'Mean Pr. (bar) value not more than 500.'
    //   );
    //   return;
    // }

    // if (
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Unit_8_Fuel_Qulaity_Setting &&
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Unit_8_Fuel_Qulaity_Setting < 0
    // ) {
    //   this.notificationService.error('', 'FQA [%] value not less than 0.');
    //   return;
    // }
    // if (
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Unit_8_Fuel_Qulaity_Setting &&
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Unit_8_Fuel_Qulaity_Setting > 100
    // ) {
    //   this.notificationService.error('', 'FQA [%] value not more than 100.');
    //   return;
    // }
    // if (
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Unit_8_Exhaust_Temperature &&
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Unit_8_Exhaust_Temperature < 0
    // ) {
    //   this.notificationService.error(
    //     '',
    //     'Exh. Temp (°C) value not less than 0.'
    //   );
    //   return;
    // }
    // if (
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Unit_8_Exhaust_Temperature &&
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Unit_8_Exhaust_Temperature > 500
    // ) {
    //   this.notificationService.error(
    //     '',
    //     'Exh. Temp (°C) value not more than 500.'
    //   );
    //   return;
    // }
    // if (
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Unit_8_Pressure_Max &&
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Unit_8_Pressure_Max < 0
    // ) {
    //   this.notificationService.error('', 'Pmax (bar) value not less than 0.');
    //   return;
    // }
    // if (
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Unit_8_Pressure_Max &&
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Unit_8_Pressure_Max > 500
    // ) {
    //   this.notificationService.error('', 'Pmax (bar) value not more than 500.');
    //   return;
    // }
    // if (
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Unit_8_High_Load_Off_Percentage &&
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Unit_8_High_Load_Off_Percentage < 0
    // ) {
    //   this.notificationService.error(
    //     '',
    //     'High Load Off. (%) value not less than 0.'
    //   );
    //   return;
    // }
    // if (
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Unit_8_High_Load_Off_Percentage &&
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Unit_8_High_Load_Off_Percentage > 100
    // ) {
    //   this.notificationService.error(
    //     '',
    //     'High Load Off. (%) value not more than 100.'
    //   );
    //   return;
    // }
    // if (
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Unit_8_Colling_Water_Out_Temperature &&
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Unit_8_Colling_Water_Out_Temperature < 0
    // ) {
    //   this.notificationService.error(
    //     '',
    //     'C.W. Out. Temp. (°C) value not less than 0.'
    //   );
    //   return;
    // }
    // if (
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Unit_8_Colling_Water_Out_Temperature &&
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Unit_8_Colling_Water_Out_Temperature > 100
    // ) {
    //   this.notificationService.error(
    //     '',
    //     'C.W. Out. Temp. (°C) value not more than 100.'
    //   );
    //   return;
    // }
    // if (
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Unit_8_Pressure_compressure &&
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Unit_8_Pressure_compressure < 0
    // ) {
    //   this.notificationService.error('', 'Pcomp [bar] value not less than 0.');
    //   return;
    // }
    // if (
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Unit_8_Pressure_compressure &&
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Unit_8_Pressure_compressure > 500
    // ) {
    //   this.notificationService.error(
    //     '',
    //     'Pcomp [bar] value not more than 500.'
    //   );
    //   return;
    // }
    // if (
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Unit_8_Low_Load_Off &&
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Unit_8_Low_Load_Off < 0
    // ) {
    //   this.notificationService.error(
    //     '',
    //     'Low Load Off. (%) value not less than 0.'
    //   );
    //   return;
    // }
    // if (
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Unit_8_Low_Load_Off &&
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Unit_8_Low_Load_Off > 100
    // ) {
    //   this.notificationService.error(
    //     '',
    //     'Low Load Off. (%) value not more than 100.'
    //   );
    //   return;
    // }

    // if (
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Unit_8_Piston_Out_Temperature &&
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Unit_8_Piston_Out_Temperature < 0
    // ) {
    //   this.notificationService.error(
    //     '',
    //     'Pist. Out. Temp. (°C) value not less than 0.'
    //   );
    //   return;
    // }
    // if (
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Unit_8_Piston_Out_Temperature &&
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Unit_8_Piston_Out_Temperature > 100
    // ) {
    //   this.notificationService.error(
    //     '',
    //     'Pist. Out. Temp. (°C) value not more than 100.'
    //   );
    //   return;
    // }

    // if (
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Unit_8_Output_Indicated &&
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Unit_8_Output_Indicated < 0
    // ) {
    //   this.notificationService.error(
    //     '',
    //     'Outp. Ind. (kW) value not less than 0.'
    //   );
    //   return;
    // }
    // if (
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Unit_8_Output_Indicated &&
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Unit_8_Output_Indicated > 20000
    // ) {
    //   this.notificationService.error(
    //     '',
    //     'Outp. Ind. (kW) value not more than 20000.'
    //   );
    //   return;
    // }
    // if (
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Unit_8_Fuel_Index &&
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Unit_8_Fuel_Index < 0
    // ) {
    //   this.notificationService.error(
    //     '',
    //     'Fuel Index (mm) value not less than 0.'
    //   );
    //   return;
    // }
    // if (
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Unit_8_Fuel_Index &&
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Unit_8_Fuel_Index > 100
    // ) {
    //   this.notificationService.error(
    //     '',
    //     'Fuel Index (mm) value not more than 100.'
    //   );
    //   return;
    // }
    // if (
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Unit_8_Variable_Enjection_Timing_Index &&
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Unit_8_Variable_Enjection_Timing_Index < 0
    // ) {
    //   this.notificationService.error(
    //     '',
    //     'VIT Index (mm) value not less than 0.'
    //   );
    //   return;
    // }
    // if (
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Unit_8_Variable_Enjection_Timing_Index &&
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Unit_8_Variable_Enjection_Timing_Index > 100
    // ) {
    //   this.notificationService.error(
    //     '',
    //     'VIT Index (mm) value not more than 100.'
    //   );
    //   return;
    // }

    // Main Engine Performance - Unit 9
    // if (
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Unit_9_Mean_Pressure &&
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Unit_9_Mean_Pressure < 0
    // ) {
    //   this.notificationService.error(
    //     '',
    //     'Mean Pr. (bar) value not less than 0.'
    //   );
    //   return;
    // }
    // if (
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Unit_9_Mean_Pressure &&
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Unit_9_Mean_Pressure > 500
    // ) {
    //   this.notificationService.error(
    //     '',
    //     'Mean Pr. (bar) value not more than 500.'
    //   );
    //   return;
    // }

    // if (
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Unit_9_Fuel_Qulaity_Setting &&
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Unit_9_Fuel_Qulaity_Setting < 0
    // ) {
    //   this.notificationService.error('', 'FQA [%] value not less than 0.');
    //   return;
    // }
    // if (
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Unit_9_Fuel_Qulaity_Setting &&
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Unit_9_Fuel_Qulaity_Setting > 100
    // ) {
    //   this.notificationService.error('', 'FQA [%] value not more than 100.');
    //   return;
    // }
    // if (
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Unit_9_Exhaust_Temperature &&
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Unit_9_Exhaust_Temperature < 0
    // ) {
    //   this.notificationService.error(
    //     '',
    //     'Exh. Temp (°C) value not less than 0.'
    //   );
    //   return;
    // }
    // if (
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Unit_9_Exhaust_Temperature &&
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Unit_9_Exhaust_Temperature > 500
    // ) {
    //   this.notificationService.error(
    //     '',
    //     'Exh. Temp (°C) value not more than 500.'
    //   );
    //   return;
    // }
    // if (
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Unit_9_Pressure_Max &&
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Unit_9_Pressure_Max < 0
    // ) {
    //   this.notificationService.error('', 'Pmax (bar) value not less than 0.');
    //   return;
    // }
    // if (
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Unit_9_Pressure_Max &&
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Unit_9_Pressure_Max > 500
    // ) {
    //   this.notificationService.error('', 'Pmax (bar) value not more than 500.');
    //   return;
    // }
    // if (
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Unit_9_High_Load_Off_Percentage &&
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Unit_9_High_Load_Off_Percentage < 0
    // ) {
    //   this.notificationService.error(
    //     '',
    //     'High Load Off. (%) value not less than 0.'
    //   );
    //   return;
    // }
    // if (
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Unit_9_High_Load_Off_Percentage &&
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Unit_9_High_Load_Off_Percentage > 100
    // ) {
    //   this.notificationService.error(
    //     '',
    //     'High Load Off. (%) value not more than 100.'
    //   );
    //   return;
    // }
    // if (
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Unit_9_Colling_Water_Out_Temperature &&
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Unit_9_Colling_Water_Out_Temperature < 0
    // ) {
    //   this.notificationService.error(
    //     '',
    //     'C.W. Out. Temp. (°C) value not less than 0.'
    //   );
    //   return;
    // }
    // if (
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Unit_9_Colling_Water_Out_Temperature &&
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Unit_9_Colling_Water_Out_Temperature > 100
    // ) {
    //   this.notificationService.error(
    //     '',
    //     'C.W. Out. Temp. (°C) value not more than 100.'
    //   );
    //   return;
    // }
    // if (
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Unit_9_Pressure_compressure &&
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Unit_9_Pressure_compressure < 0
    // ) {
    //   this.notificationService.error('', 'Pcomp [bar] value not less than 0.');
    //   return;
    // }
    // if (
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Unit_9_Pressure_compressure &&
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Unit_9_Pressure_compressure > 500
    // ) {
    //   this.notificationService.error(
    //     '',
    //     'Pcomp [bar] value not more than 500.'
    //   );
    //   return;
    // }
    // if (
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Unit_9_Low_Load_Off &&
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Unit_9_Low_Load_Off < 0
    // ) {
    //   this.notificationService.error(
    //     '',
    //     'Low Load Off. (%) value not less than 0.'
    //   );
    //   return;
    // }
    // if (
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Unit_9_Low_Load_Off &&
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Unit_9_Low_Load_Off > 100
    // ) {
    //   this.notificationService.error(
    //     '',
    //     'Low Load Off. (%) value not more than 100.'
    //   );
    //   return;
    // }

    // if (
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Unit_9_Piston_Out_Temperature &&
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Unit_9_Piston_Out_Temperature < 0
    // ) {
    //   this.notificationService.error(
    //     '',
    //     'Pist. Out. Temp. (°C) value not less than 0.'
    //   );
    //   return;
    // }
    // if (
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Unit_9_Piston_Out_Temperature &&
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Unit_9_Piston_Out_Temperature > 100
    // ) {
    //   this.notificationService.error(
    //     '',
    //     'Pist. Out. Temp. (°C) value not more than 100.'
    //   );
    //   return;
    // }

    // if (
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Unit_9_Output_Indicated &&
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Unit_9_Output_Indicated < 0
    // ) {
    //   this.notificationService.error(
    //     '',
    //     'Outp. Ind. (kW) value not less than 0.'
    //   );
    //   return;
    // }
    // if (
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Unit_9_Output_Indicated &&
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Unit_9_Output_Indicated > 20000
    // ) {
    //   this.notificationService.error(
    //     '',
    //     'Outp. Ind. (kW) value not more than 20000.'
    //   );
    //   return;
    // }
    // if (
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Unit_9_Fuel_Index &&
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Unit_9_Fuel_Index < 0
    // ) {
    //   this.notificationService.error(
    //     '',
    //     'Fuel Index (mm) value not less than 0.'
    //   );
    //   return;
    // }
    // if (
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Unit_9_Fuel_Index &&
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Unit_9_Fuel_Index > 100
    // ) {
    //   this.notificationService.error(
    //     '',
    //     'Fuel Index (mm) value not more than 100.'
    //   );
    //   return;
    // }
    // if (
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Unit_9_Variable_Enjection_Timing_Index &&
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Unit_9_Variable_Enjection_Timing_Index < 0
    // ) {
    //   this.notificationService.error(
    //     '',
    //     'VIT Index (mm) value not less than 0.'
    //   );
    //   return;
    // }
    // if (
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Unit_9_Variable_Enjection_Timing_Index &&
    //   this.addUpdateMainEngPermorfanceReportForm.value
    //     .ME1_PERF_Unit_9_Variable_Enjection_Timing_Index > 100
    // ) {
    //   this.notificationService.error(
    //     '',
    //     'VIT Index (mm) value not more than 100.'
    //   );
    //   return;
    // }

    if (!this.addUpdateMainEngPermorfanceReportForm.valid) {
      this.markFormGroupTouched(this.addUpdateMainEngPermorfanceReportForm);
    } else {
      if (this.idForUpdate) {
        this.addOrUpdateMainEngPermorfanceReport(
          'put',
          `main-engine-perfomance-reports/${this.idForUpdate}`,
          ' Report Successfully Updated'
        );
      } else {
        console.log(this.addUpdateMainEngPermorfanceReportForm.value);
        this.addOrUpdateMainEngPermorfanceReport(
          'post',
          'main-engine-perfomance-reports',
          'Report Added Successfully '
        );

        // console.log(
        //   this.addUpdateMainEngPermorfanceReportForm.get(
        //     'Main_Engine_Performance_Unit_1'
        //   )?.value.ME1_PERF_Indicated_Diagram_Upload
        // );
      }
    }
  }

  addOrUpdateMainEngPermorfanceReport(
    requestMethod: string,
    requestURL: string,
    successMessage: string
  ): void {
    this.buttonLoading = true;
    this.httpRequestService
      .request(
        requestMethod,
        requestURL,
        this.addUpdateMainEngPermorfanceReportForm.value
      )
      .subscribe(
        (result: any) => {
          this.notificationService.success('', successMessage);
          this.router.navigateByUrl(
            '/main/performance-report/main-engine-performance-reports'
          );
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
        abstractControl?.markAsDirty();
        abstractControl?.updateValueAndValidity();
      }
    });
  }

  private getBase64(img: File, callback: (img: string) => void): void {
    const reader = new FileReader();
    reader.addEventListener('load', () =>
      callback(reader.result ? reader.result.toString() : '')
    );
    reader.readAsDataURL(img);
  }

  // Before media upload unit 1
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

  // On media upload unit 1
  handleUpload(info: { file: NzUploadFile }): void {
    console.log('file', info.file.status);
    switch (info.file.status) {
      case 'uploading':
        this.imgLoading = true;
        console.log('case', info);
        break;
      case 'done':
        this.addUpdateMainEngPermorfanceReportForm.patchValue({
          ME1_PERF_Unit_1_Indicated_Diagram_Upload: info.file.response.data._id,
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

  // Before media upload unit 2
  beforeUploadUnit2 = (
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

  // On media upload unit 2
  handleUploadUnit2(info: { file: NzUploadFile }): void {
    console.log('file', info.file.status);
    switch (info.file.status) {
      case 'uploading':
        this.imgLoading = true;
        console.log('case', info);
        break;
      case 'done':
        this.addUpdateMainEngPermorfanceReportForm.patchValue({
          ME1_PERF_Unit_2_Indicated_Diagram_Upload: info.file.response.data._id,
        });

        // Get this url from response in real world.
        if (info.file && info.file.originFileObj) {
          console.log('info', info.file);

          this.getBase64(info.file.originFileObj, (img: string) => {
            this.imgLoading = false;
            this.avatarUrl = img;
            //console.log()
            this.fileObjectUnit2 = info.file.response.data;
          });
        }

        break;
      case 'error':
        this.msg.error('Network error');
        this.imgLoading = false;
        break;
    }
  }
  // Before media upload unit 3
  beforeUploadUnit3 = (
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

  // On media upload unit 3
  handleUploadUnit3(info: { file: NzUploadFile }): void {
    console.log('file', info.file.status);
    switch (info.file.status) {
      case 'uploading':
        this.imgLoading = true;
        console.log('case', info);
        break;
      case 'done':
        this.addUpdateMainEngPermorfanceReportForm.patchValue({
          ME1_PERF_Unit_3_Indicated_Diagram_Upload: info.file.response.data._id,
        });

        // Get this url from response in real world.
        if (info.file && info.file.originFileObj) {
          console.log('info', info.file);

          this.getBase64(info.file.originFileObj, (img: string) => {
            this.imgLoading = false;
            this.avatarUrl = img;
            //console.log()
            this.fileObjectUnit3 = info.file.response.data;
          });
        }

        break;
      case 'error':
        this.msg.error('Network error');
        this.imgLoading = false;
        break;
    }
  }
  // Before media upload unit 4
  beforeUploadUnit4 = (
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

  // On media upload unit 4
  handleUploadUnit4(info: { file: NzUploadFile }): void {
    console.log('file', info.file.status);
    switch (info.file.status) {
      case 'uploading':
        this.imgLoading = true;
        console.log('case', info);
        break;
      case 'done':
        this.addUpdateMainEngPermorfanceReportForm.patchValue({
          ME1_PERF_Unit_4_Indicated_Diagram_Upload: info.file.response.data._id,
        });

        // Get this url from response in real world.
        if (info.file && info.file.originFileObj) {
          console.log('info', info.file);

          this.getBase64(info.file.originFileObj, (img: string) => {
            this.imgLoading = false;
            this.avatarUrl = img;
            //console.log()
            this.fileObjectUnit4 = info.file.response.data;
          });
        }

        break;
      case 'error':
        this.msg.error('Network error');
        this.imgLoading = false;
        break;
    }
  }

  // Before media upload unit 5
  beforeUploadUnit5 = (
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

  // On media upload unit 5
  handleUploadUnit5(info: { file: NzUploadFile }): void {
    console.log('file', info.file.status);
    switch (info.file.status) {
      case 'uploading':
        this.imgLoading = true;
        console.log('case', info);
        break;
      case 'done':
        this.addUpdateMainEngPermorfanceReportForm.patchValue({
          ME1_PERF_Unit_5_Indicated_Diagram_Upload: info.file.response.data._id,
        });

        // Get this url from response in real world.
        if (info.file && info.file.originFileObj) {
          console.log('info', info.file);

          this.getBase64(info.file.originFileObj, (img: string) => {
            this.imgLoading = false;
            this.avatarUrl = img;
            //console.log()
            this.fileObjectUnit5 = info.file.response.data;
          });
        }

        break;
      case 'error':
        this.msg.error('Network error');
        this.imgLoading = false;
        break;
    }
  }

  // Before media upload unit 6
  beforeUploadUnit6 = (
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

  // On media upload unit 6
  handleUploadUnit6(info: { file: NzUploadFile }): void {
    console.log('file', info.file.status);
    switch (info.file.status) {
      case 'uploading':
        this.imgLoading = true;
        console.log('case', info);
        break;
      case 'done':
        this.addUpdateMainEngPermorfanceReportForm.patchValue({
          ME1_PERF_Unit_6_Indicated_Diagram_Upload: info.file.response.data._id,
        });

        // Get this url from response in real world.
        if (info.file && info.file.originFileObj) {
          console.log('info', info.file);

          this.getBase64(info.file.originFileObj, (img: string) => {
            this.imgLoading = false;
            this.avatarUrl = img;
            //console.log()
            this.fileObjectUnit6 = info.file.response.data;
          });
        }

        break;
      case 'error':
        this.msg.error('Network error');
        this.imgLoading = false;
        break;
    }
  }

  // Before media upload unit 7
  beforeUploadUnit7 = (
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

  // On media upload unit 7
  handleUploadUnit7(info: { file: NzUploadFile }): void {
    console.log('file', info.file.status);
    switch (info.file.status) {
      case 'uploading':
        this.imgLoading = true;
        console.log('case', info);
        break;
      case 'done':
        this.addUpdateMainEngPermorfanceReportForm.patchValue({
          ME1_PERF_Unit_7_Indicated_Diagram_Upload: info.file.response.data._id,
        });

        // Get this url from response in real world.
        if (info.file && info.file.originFileObj) {
          console.log('info', info.file);

          this.getBase64(info.file.originFileObj, (img: string) => {
            this.imgLoading = false;
            this.avatarUrl = img;
            //console.log()
            this.fileObjectUnit7 = info.file.response.data;
          });
        }

        break;
      case 'error':
        this.msg.error('Network error');
        this.imgLoading = false;
        break;
    }
  }

  // Before media upload unit 8
  beforeUploadUnit8 = (
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

  // On media upload unit 8
  handleUploadUnit8(info: { file: NzUploadFile }): void {
    console.log('file', info.file.status);
    switch (info.file.status) {
      case 'uploading':
        this.imgLoading = true;
        console.log('case', info);
        break;
      case 'done':
        this.addUpdateMainEngPermorfanceReportForm.patchValue({
          ME1_PERF_Unit_8_Indicated_Diagram_Upload: info.file.response.data._id,
        });

        // Get this url from response in real world.
        if (info.file && info.file.originFileObj) {
          console.log('info', info.file);

          this.getBase64(info.file.originFileObj, (img: string) => {
            this.imgLoading = false;
            this.avatarUrl = img;
            //console.log()
            this.fileObjectUnit8 = info.file.response.data;
          });
        }

        break;
      case 'error':
        this.msg.error('Network error');
        this.imgLoading = false;
        break;
    }
  }

  // Before media upload unit 9
  beforeUploadUnit9 = (
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

  // On media upload unit 9
  handleUploadUnit9(info: { file: NzUploadFile }): void {
    console.log('file', info.file.status);
    switch (info.file.status) {
      case 'uploading':
        this.imgLoading = true;
        console.log('case', info);
        break;
      case 'done':
        this.addUpdateMainEngPermorfanceReportForm.patchValue({
          ME1_PERF_Unit_9_Indicated_Diagram_Upload: info.file.response.data._id,
        });

        // Get this url from response in real world.
        if (info.file && info.file.originFileObj) {
          console.log('info', info.file);

          this.getBase64(info.file.originFileObj, (img: string) => {
            this.imgLoading = false;
            this.avatarUrl = img;
            //console.log()
            this.fileObjectUnit9 = info.file.response.data;
          });
        }

        break;
      case 'error':
        this.msg.error('Network error');
        this.imgLoading = false;
        break;
    }
  }

  // Before media upload unit 10
  beforeUploadUnit10 = (
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

  // On media upload unit 10
  handleUploadUnit10(info: { file: NzUploadFile }): void {
    console.log('file', info.file.status);
    switch (info.file.status) {
      case 'uploading':
        this.imgLoading = true;
        console.log('case', info);
        break;
      case 'done':
        this.addUpdateMainEngPermorfanceReportForm.patchValue({
          ME1_PERF_Unit_10_Indicated_Diagram_Upload:
            info.file.response.data._id,
        });

        // Get this url from response in real world.
        if (info.file && info.file.originFileObj) {
          console.log('info', info.file);

          this.getBase64(info.file.originFileObj, (img: string) => {
            this.imgLoading = false;
            this.avatarUrl = img;
            //console.log()
            this.fileObjectUnit9 = info.file.response.data;
          });
        }

        break;
      case 'error':
        this.msg.error('Network error');
        this.imgLoading = false;
        break;
    }
  }

  // Before media upload unit 11
  beforeUploadUnit11 = (
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

  // On media upload unit 11
  handleUploadUnit11(info: { file: NzUploadFile }): void {
    console.log('file', info.file.status);
    switch (info.file.status) {
      case 'uploading':
        this.imgLoading = true;
        console.log('case', info);
        break;
      case 'done':
        this.addUpdateMainEngPermorfanceReportForm.patchValue({
          ME1_PERF_Unit_11_Indicated_Diagram_Upload:
            info.file.response.data._id,
        });

        // Get this url from response in real world.
        if (info.file && info.file.originFileObj) {
          console.log('info', info.file);

          this.getBase64(info.file.originFileObj, (img: string) => {
            this.imgLoading = false;
            this.avatarUrl = img;
            //console.log()
            this.fileObjectUnit9 = info.file.response.data;
          });
        }

        break;
      case 'error':
        this.msg.error('Network error');
        this.imgLoading = false;
        break;
    }
  }

  // Before media upload unit 12
  beforeUploadUnit12 = (
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

  // On media upload unit 12
  handleUploadUnit12(info: { file: NzUploadFile }): void {
    console.log('file', info.file.status);
    switch (info.file.status) {
      case 'uploading':
        this.imgLoading = true;
        console.log('case', info);
        break;
      case 'done':
        this.addUpdateMainEngPermorfanceReportForm.patchValue({
          ME1_PERF_Unit_12_Indicated_Diagram_Upload:
            info.file.response.data._id,
        });

        // Get this url from response in real world.
        if (info.file && info.file.originFileObj) {
          console.log('info', info.file);

          this.getBase64(info.file.originFileObj, (img: string) => {
            this.imgLoading = false;
            this.avatarUrl = img;
            //console.log()
            this.fileObjectUnit9 = info.file.response.data;
          });
        }

        break;
      case 'error':
        this.msg.error('Network error');
        this.imgLoading = false;
        break;
    }
  }

  // Custom range validation
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
