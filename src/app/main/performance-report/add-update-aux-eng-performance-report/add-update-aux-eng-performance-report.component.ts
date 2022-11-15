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
import { NzUploadChangeParam, NzUploadFile } from 'ng-zorro-antd/upload';
import { from, Observable, Observer, Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import {
  ConfigurationService,
  HttpRequestService,
} from 'src/app/core/services';

@Component({
  selector: 'app-add-update-aux-eng-performance-report',
  templateUrl: './add-update-aux-eng-performance-report.component.html',
  styleUrls: ['./add-update-aux-eng-performance-report.component.scss'],
})
export class AddUpdateAuxEngPerformanceReportComponent implements OnInit {
  addUpdateBunkerStockReportForm!: FormGroup;
  idForUpdate!: string;
  buttonLoading = false;
  mediaUploadUrl!: string;
  time: Date | null = null;
  defaultOpenValue = new Date(0, 0, 0, 0, 0, 0);
  reportValue: any;

  files: NzUploadFile[] = [];
  mockOSSData = {
    dir: 'user-dir/',
    expire: '1577811661',
    host: '//www.mocky.io/v2/5cc8019d300000980a055e76',
    accessId: 'c2hhb2RhaG9uZw==',
    policy: 'eGl4aWhhaGFrdWt1ZGFkYQ==',
    signature: 'ZGFob25nc2hhbw==',
  };

  transformFile = (file: NzUploadFile): NzUploadFile => {
    const suffix = file.name.slice(file.name.lastIndexOf('.'));
    const filename = Date.now() + suffix;
    file.url = this.mockOSSData.dir + filename;

    return file;
  };

  getExtraData = (file: NzUploadFile): {} => {
    const { accessId, policy, signature } = this.mockOSSData;

    return {
      key: file.url,
      OSSAccessKeyId: accessId,
      policy,
      Signature: signature,
    };
  };

  onChange(e: NzUploadChangeParam): void {
    console.log('Aliyun OSS:', e.fileList);
  }

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
    this.addUpdateBunkerStockReportForm = this.fb.group({
      // Service Data
      ME1_PERF_Vessel_Name: [null],
      ME1_PERF_Report_Date: [null],
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
      ME1_PERF_Running_Hours: [null],
      ME1_PERF_Main_Engine_RPM: [null],
      ME1_PERF_Loading_condition: [null],
      ME1_PERF_Main_Engine_Power: [null],
      ME1_PERF_Wind_Force: [null],
      ME1_PERF_Wind_Direction: [null],
      ME1_PERF_Fuel_In_Use: [null],
      ME1_PERF_Scavenge_Pressure: [null],
      ME1_PERF_Scavenge_Temperature: [null],
      ME1_PERF_Fuel_Consumption: [null],
      ME1_PERF_Main_Engine_Specific_Fuel_Oil_Consumption: [null],
      ME1_PERF_Vessel_Speed: [null],
      ME1_PERF_Cylinder_Lube_Oil_Base_Number: [null],
      ME1_PERF_Cylinder_Lube_Oil_Consumption: [null],
      ME1_PERF_Specific_Cylinder_Lube_Oil_Consumption: [null],

      // Turbochargers & Air coolers
      ME1_PERF_TC1_RPM: [null],
      ME1_PERF_TC2_RPM: [null],
      ME1_PERF_TC3_RPM: [null],
      ME1_PERF_TC4_RPM: [null],
      ME1_PERF_TC1_Exht_In_Temperature: [null],
      ME1_PERF_TC1_Exht_Out_Temperature: [null],
      ME1_PERF_TC2_Exht_In_Temperature: [null],
      ME1_PERF_TC2_Exht_Out_Temperature: [null],
      ME1_PERF_TC3_Exht_In_Temperature: [null],
      ME1_PERF_TC3_Exht_Out_Temperature: [null],
      ME1_PERF_TC4_Exht_In_Temperature: [null],
      ME1_PERF_TC4_Exht_Out_Temperature: [null],
      ME1_PERF_Auxillary_Blowers_On_Off: [null],
      ME1_PERF_Air_Cooler_1_Cooling_Water_In: [null],
      ME1_PERF_Air_Cooler_1_Cooling_Water_Out: [null],
      ME1_PERF_Air_Cooler_2_Cooling_Water_In: [null],
      ME1_PERF_Air_Cooler_2_Cooling_Water_Out: [null],
      ME1_PERF_Air_Cooler_3_Cooling_Water_In: [null],
      ME1_PERF_Air_Cooler_3_Cooling_Water_Out: [null],
      ME1_PERF_Exht_Receiver_Pressure: [null],

      // Air, Fuel Oil & Lubrication Oil
      ME1_PERF_Scavenge_Receiver_Pressure: [null],
      ME1_PERF_Scavenge_Received_Temp: [null],
      ME1_PERF_Air_Cooler_1_Air_In: [null],
      ME1_PERF_Air_Cooler_1_Air_Out: [null],
      ME1_PERF_Air_Cooling_2_Air_In: [null],
      ME1_PERF_Air_Cooling_2_Air_Out: [null],
      ME1_PERF_Air_Cooling_3_Air_In: [null],
      ME1_PERF_Air_Cooling_3_Air_Out: [null],
      ME1_PERF_Main_Lube_Oil_Tempertature: [null],
      ME1_PERF_Main_Lube_Oil_Pressure: [null],
      ME1_PERF_Servo_Oil_Pressure: [null],
      ME1_PERF_Differential_Pressure_Air_Filter: [null],
      ME1_PERF_TC_Lube_Oil_Inlet_Temperature: [null],
      ME1_PERF_Fuel_Oil_Temp: [null],
      ME1_PERF_Axial_Vibration: [null],
      ME1_PERF_Fuel_Oil_Pressure: [null],
      ME1_PERF_Fuel_Index: [null],
      ME1_PERF_Fuel_Oil_Rail_Pressure: [null],
      // unit - 1
      Main_Engine_Performance_Unit_1: this.fb.group({
        ME1_PERF_Mean_Pressure: [null],
        ME1_PERF_Fuel_Qulaity_Setting: [null],
        ME1_PERF_Exhaust_Temperature: [null],
        ME1_PERF_Pressure_Max: [null],
        ME1_PERF_High_Load_Off_Percentage: [null],
        ME1_PERF_Colling_Water_Out_Temperature: [null],
        ME1_PERF_Pressure_compressure: [null],
        ME1_PERF_Low_Load_Off: [null],
        ME1_PERF_Piston_Out_Temperature: [null],
        ME1_PERF_Output_Indicated: [null],
        ME1_PERF_Fuel_Index: [null],
        ME1_PERF_Variable_Enjection_Timing_Index: [null],
        ME1_PERF_Indicated_Diagram_Upload: [null],
      }),
      // unit - 2
      Main_Engine_Performance_Unit_2: this.fb.group({
        ME1_PERF_Mean_Pressure: [null],
        ME1_PERF_Fuel_Qulaity_Setting: [null],
        ME1_PERF_Exhaust_Temperature: [null],
        ME1_PERF_Pressure_Max: [null],
        ME1_PERF_High_Load_Off_Percentage: [null],
        ME1_PERF_Colling_Water_Out_Temperature: [null],
        ME1_PERF_Pressure_compressure: [null],
        ME1_PERF_Low_Load_Off: [null],
        ME1_PERF_Piston_Out_Temperature: [null],
        ME1_PERF_Output_Indicated: [null],
        ME1_PERF_Fuel_Index: [null],
        ME1_PERF_Variable_Enjection_Timing_Index: [null],
        ME1_PERF_Indicated_Diagram_Upload: [null],
      }),
      // unit - 3
      Main_Engine_Performance_Unit_3: this.fb.group({
        ME1_PERF_Mean_Pressure: [null],
        ME1_PERF_Fuel_Qulaity_Setting: [null],
        ME1_PERF_Exhaust_Temperature: [null],
        ME1_PERF_Pressure_Max: [null],
        ME1_PERF_High_Load_Off_Percentage: [null],
        ME1_PERF_Colling_Water_Out_Temperature: [null],
        ME1_PERF_Pressure_compressure: [null],
        ME1_PERF_Low_Load_Off: [null],
        ME1_PERF_Piston_Out_Temperature: [null],
        ME1_PERF_Output_Indicated: [null],
        ME1_PERF_Fuel_Index: [null],
        ME1_PERF_Variable_Enjection_Timing_Index: [null],
        ME1_PERF_Indicated_Diagram_Upload: [null],
      }),
      // unit - 4
      Main_Engine_Performance_Unit_4: this.fb.group({
        ME1_PERF_Mean_Pressure: [null],
        ME1_PERF_Fuel_Qulaity_Setting: [null],
        ME1_PERF_Exhaust_Temperature: [null],
        ME1_PERF_Pressure_Max: [null],
        ME1_PERF_High_Load_Off_Percentage: [null],
        ME1_PERF_Colling_Water_Out_Temperature: [null],
        ME1_PERF_Pressure_compressure: [null],
        ME1_PERF_Low_Load_Off: [null],
        ME1_PERF_Piston_Out_Temperature: [null],
        ME1_PERF_Output_Indicated: [null],
        ME1_PERF_Fuel_Index: [null],
        ME1_PERF_Variable_Enjection_Timing_Index: [null],
        ME1_PERF_Indicated_Diagram_Upload: [null],
      }),
      // unit - 5
      Main_Engine_Performance_Unit_5: this.fb.group({
        ME1_PERF_Mean_Pressure: [null],
        ME1_PERF_Fuel_Qulaity_Setting: [null],
        ME1_PERF_Exhaust_Temperature: [null],
        ME1_PERF_Pressure_Max: [null],
        ME1_PERF_High_Load_Off_Percentage: [null],
        ME1_PERF_Colling_Water_Out_Temperature: [null],
        ME1_PERF_Pressure_compressure: [null],
        ME1_PERF_Low_Load_Off: [null],
        ME1_PERF_Piston_Out_Temperature: [null],
        ME1_PERF_Output_Indicated: [null],
        ME1_PERF_Fuel_Index: [null],
        ME1_PERF_Variable_Enjection_Timing_Index: [null],
        ME1_PERF_Indicated_Diagram_Upload: [null],
      }),
      // unit - 6
      Main_Engine_Performance_Unit_6: this.fb.group({
        ME1_PERF_Mean_Pressure: [null],
        ME1_PERF_Fuel_Qulaity_Setting: [null],
        ME1_PERF_Exhaust_Temperature: [null],
        ME1_PERF_Pressure_Max: [null],
        ME1_PERF_High_Load_Off_Percentage: [null],
        ME1_PERF_Colling_Water_Out_Temperature: [null],
        ME1_PERF_Pressure_compressure: [null],
        ME1_PERF_Low_Load_Off: [null],
        ME1_PERF_Piston_Out_Temperature: [null],
        ME1_PERF_Output_Indicated: [null],
        ME1_PERF_Fuel_Index: [null],
        ME1_PERF_Variable_Enjection_Timing_Index: [null],
        ME1_PERF_Indicated_Diagram_Upload: [null],
      }),
      // unit - 7
      Main_Engine_Performance_Unit_7: this.fb.group({
        ME1_PERF_Mean_Pressure: [null],
        ME1_PERF_Fuel_Qulaity_Setting: [null],
        ME1_PERF_Exhaust_Temperature: [null],
        ME1_PERF_Pressure_Max: [null],
        ME1_PERF_High_Load_Off_Percentage: [null],
        ME1_PERF_Colling_Water_Out_Temperature: [null],
        ME1_PERF_Pressure_compressure: [null],
        ME1_PERF_Low_Load_Off: [null],
        ME1_PERF_Piston_Out_Temperature: [null],
        ME1_PERF_Output_Indicated: [null],
        ME1_PERF_Fuel_Index: [null],
        ME1_PERF_Variable_Enjection_Timing_Index: [null],
        ME1_PERF_Indicated_Diagram_Upload: [null],
      }),
      // unit - 8
      Main_Engine_Performance_Unit_8: this.fb.group({
        ME1_PERF_Mean_Pressure: [null],
        ME1_PERF_Fuel_Qulaity_Setting: [null],
        ME1_PERF_Exhaust_Temperature: [null],
        ME1_PERF_Pressure_Max: [null],
        ME1_PERF_High_Load_Off_Percentage: [null],
        ME1_PERF_Colling_Water_Out_Temperature: [null],
        ME1_PERF_Pressure_compressure: [null],
        ME1_PERF_Low_Load_Off: [null],
        ME1_PERF_Piston_Out_Temperature: [null],
        ME1_PERF_Output_Indicated: [null],
        ME1_PERF_Fuel_Index: [null],
        ME1_PERF_Variable_Enjection_Timing_Index: [null],
        ME1_PERF_Indicated_Diagram_Upload: [null],
      }),
      // unit - 9
      Main_Engine_Performance_Unit_9: this.fb.group({
        ME1_PERF_Mean_Pressure: [null],
        ME1_PERF_Fuel_Qulaity_Setting: [null],
        ME1_PERF_Exhaust_Temperature: [null],
        ME1_PERF_Pressure_Max: [null],
        ME1_PERF_High_Load_Off_Percentage: [null],
        ME1_PERF_Colling_Water_Out_Temperature: [null],
        ME1_PERF_Pressure_compressure: [null],
        ME1_PERF_Low_Load_Off: [null],
        ME1_PERF_Piston_Out_Temperature: [null],
        ME1_PERF_Output_Indicated: [null],
        ME1_PERF_Fuel_Index: [null],
        ME1_PERF_Variable_Enjection_Timing_Index: [null],
        ME1_PERF_Indicated_Diagram_Upload: [null],
      }),
      // unit - 10
      Main_Engine_Performance_Unit_10: this.fb.group({
        ME1_PERF_Mean_Pressure: [null],
        ME1_PERF_Fuel_Qulaity_Setting: [null],
        ME1_PERF_Exhaust_Temperature: [null],
        ME1_PERF_Pressure_Max: [null],
        ME1_PERF_High_Load_Off_Percentage: [null],
        ME1_PERF_Colling_Water_Out_Temperature: [null],
        ME1_PERF_Pressure_compressure: [null],
        ME1_PERF_Low_Load_Off: [null],
        ME1_PERF_Piston_Out_Temperature: [null],
        ME1_PERF_Output_Indicated: [null],
        ME1_PERF_Fuel_Index: [null],
        ME1_PERF_Variable_Enjection_Timing_Index: [null],
        ME1_PERF_Indicated_Diagram_Upload: [null],
      }),
      // unit - 11
      Main_Engine_Performance_Unit_11: this.fb.group({
        ME1_PERF_Mean_Pressure: [null],
        ME1_PERF_Fuel_Qulaity_Setting: [null],
        ME1_PERF_Exhaust_Temperature: [null],
        ME1_PERF_Pressure_Max: [null],
        ME1_PERF_High_Load_Off_Percentage: [null],
        ME1_PERF_Colling_Water_Out_Temperature: [null],
        ME1_PERF_Pressure_compressure: [null],
        ME1_PERF_Low_Load_Off: [null],
        ME1_PERF_Piston_Out_Temperature: [null],
        ME1_PERF_Output_Indicated: [null],
        ME1_PERF_Fuel_Index: [null],
        ME1_PERF_Variable_Enjection_Timing_Index: [null],
        ME1_PERF_Indicated_Diagram_Upload: [null],
      }),
      // unit - 12
      Main_Engine_Performance_Unit_12: this.fb.group({
        ME1_PERF_Mean_Pressure: [null],
        ME1_PERF_Fuel_Qulaity_Setting: [null],
        ME1_PERF_Exhaust_Temperature: [null],
        ME1_PERF_Pressure_Max: [null],
        ME1_PERF_High_Load_Off_Percentage: [null],
        ME1_PERF_Colling_Water_Out_Temperature: [null],
        ME1_PERF_Pressure_compressure: [null],
        ME1_PERF_Low_Load_Off: [null],
        ME1_PERF_Piston_Out_Temperature: [null],
        ME1_PERF_Output_Indicated: [null],
        ME1_PERF_Fuel_Index: [null],
        ME1_PERF_Variable_Enjection_Timing_Index: [null],
        ME1_PERF_Indicated_Diagram_Upload: [null],
      }),

      Message_Date: [null],
    });
  }

  ngOnInit(): void {}
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
}
