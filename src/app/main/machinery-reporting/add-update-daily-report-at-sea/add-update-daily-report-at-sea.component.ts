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
import { timeZoneData } from './timezone.data';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { LocalDatabaseService } from 'src/app/core/services/local-database.service';
import { CommonAPIService } from 'src/app/core/services/common-api.service';
import { ReportingStoreService } from 'src/app/core/services/reporting-store.service';

@Component({
  selector: 'app-add-update-daily-report-at-sea',
  templateUrl: './add-update-daily-report-at-sea.component.html',
  styleUrls: ['./add-update-daily-report-at-sea.component.scss'],
})
export class AddUpdateDailyReportAtSeaComponent implements OnInit {
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
      DailyRept_AtSea_IMO_No: [null],
      Report_Type: [null],

      // Vessel Activity (At Sea)
      DailyRept_VslActivity_At_Sea_StartDate: [null, [Validators.required]],
      DailyRept_VslActivity_At_Sea_StartTime: [null, [Validators.required]],
      DailyRept_VslActivity_At_Sea_EndDate: [null, [Validators.required]],
      DailyRept_VslActivity_At_Sea_EndTime: [null, [Validators.required]],

      // At Sea (Voyage Details)
      DailyRept_AtSea_VoyDetails_VoyNo: [null, [Validators.required]],
      DailyRept_AtSea_VoyDetails_TimeZone: [null, [Validators.required]],
      DailyRept_AtSea_VoyDetails_DistOverGrnd: [
        null,
        [Validators.required, Validators.pattern('^[.0-9]*$')],
      ],
      DailyRept_AtSea_VoyDetails_TimeShft: [
        null,
        [Validators.required, , this.rangeValidator(-9999, 9999)],
      ],
      DailyRept_AtSea_VoyDetails_DistOverSea: [
        null,
        [Validators.required, Validators.pattern('^[.0-9]*$')],
      ],
      DailyRept_AtSea_VoyDetails_LoadingCond: [null, [Validators.required]],
      DailyRept_AtSea_VoyDetails_AvgSpeed: [
        null,
        [Validators.required, Validators.pattern('^[.0-9]*$')],
      ],
      DailyRept_AtSea_VoyDetails_WindForce: [null, [Validators.required]],
      DailyRept_AtSea_VoyDetails_WindDirection: [null, [Validators.required]],
      DailyRept_AtSea_VoyDetails_RestrictNavg: [null],
      DailyRept_AtSea_VoyDetails_ForwardDraft: [
        null,
        [Validators.required, Validators.pattern('^[.0-9]*$')],
      ],
      DailyRept_AtSea_VoyDetails_ForwardAft: [
        null,
        [Validators.required, Validators.pattern('^[.0-9]*$')],
      ],

      // At Sea (Cargo Info.) for container ship
      DailyRept_AtSea_CargoInfo_TotalContTEU: [
        null,
        [Validators.pattern('^[.0-9]*$')],
      ],
      DailyRept_AtSea_CargoInfo_TotalRefContTEU: [
        null,
        [Validators.pattern('^[.0-9]*$')],
      ],

      // At Sea (Cargo Info.) for tanker ship
      DailyRept_AtSea_CargoInfo_CargoType1Name: [null],
      DailyRept_AtSea_CargoInfo_CargoType1MT: [
        null,
        [Validators.pattern('^[.0-9]*$')],
      ],
      DailyRept_AtSea_CargoInfo_CargoType2Name: [null],
      DailyRept_AtSea_CargoInfo_CargoType2MT: [
        null,
        [Validators.pattern('^[.0-9]*$')],
      ],
      DailyRept_AtSea_CargoInfo_CargoType3Name: [null],
      DailyRept_AtSea_CargoInfo_CargoType3MT: [
        null,
        [Validators.pattern('^[.0-9]*$')],
      ],
      DailyRept_AtSea_CargoInfo_CargoType4Name: [null],
      DailyRept_AtSea_CargoInfo_CargoType4MT: [
        null,
        [Validators.pattern('^[.0-9]*$')],
      ],
      DailyRept_AtSea_CargoInfo_CargoType5Name: [null],
      DailyRept_AtSea_CargoInfo_CargoType5MT: [
        null,
        [Validators.pattern('^[.0-9]*$')],
      ],
      DailyRept_AtSea_CargoInfo_CargoType6Name: [null],
      DailyRept_AtSea_CargoInfo_CargoType6MT: [
        null,
        [Validators.pattern('^[.0-9]*$')],
      ],
      DailyRept_AtSea_CargoInfo_CargoType7Name: [null],
      DailyRept_AtSea_CargoInfo_CargoType7MT: [
        null,
        [Validators.pattern('^[.0-9]*$')],
      ],
      DailyRept_AtSea_CargoInfo_CargoType8Name: [null],
      DailyRept_AtSea_CargoInfo_CargoType8MT: [
        null,
        [Validators.pattern('^[.0-9]*$')],
      ],
      DailyRept_AtSea_CargoInfo_CargoType9Name: [null],
      DailyRept_AtSea_CargoInfo_CargoType9MT: [
        null,
        [Validators.pattern('^[.0-9]*$')],
      ],
      DailyRept_AtSea_CargoInfo_CargoType10Name: [null],
      DailyRept_AtSea_CargoInfo_CargoType10MT: [
        null,
        [Validators.pattern('^[.0-9]*$')],
      ],

      // At Sea (weather info.)
      DailyRept_AtSea_WeatherInfo_SeaWaterTemp: [
        null,
        this.rangeValidator(0, 50),
      ],
      DailyRept_AtSea_WeatherInfo_ERTemp: [
        null,
        [Validators.required, Validators.pattern('^[.0-9]*$')],
      ],
      DailyRept_AtSea_WeatherInfo_OutsideTemp: [
        null,
        [Validators.required, Validators.pattern('^[.0-9]*$')],
      ],
      DailyRept_AtSea_WeatherInfo_OutsideHumidity: [
        null,
        [Validators.pattern('^[.0-9]*$')],
      ],

      // At Sea (Main Engine Info.)
      DailyRept_AtSea_MEInfo_MEAvgLoad: [null, [Validators.required]],
      DailyRept_AtSea_MEInfo_MEAvgRPM: [null, [Validators.required]],
      DailyRept_AtSea_MEInfo_MEAvgLoadPercent: [null, [Validators.required]],
      DailyRept_AtSea_MEInfo_MERhrs: [null, [Validators.required,Validators.pattern('^[.0-9]*$'),this.rangeValidator(0,26)]],
      DailyRept_AtSea_MEInfo_MERhrs_TotalCounter: [null, [Validators.required,Validators.pattern('^[.0-9]*$'),this.rangeValidator(0,200000)]],
 

      // At Sea (Main Engine - Turbochargers & Air coolers)
      DailyRept_AtSea_METurboChgrAirCoolers_TC1RPM: [
        null,
        this.rangeValidator(0, 999),
      ],
      DailyRept_AtSea_METurboChgrAirCoolers_TC1ExhaustAirINTemp: [
        null,
        [this.rangeValidator(0, 999)],
      ],
      DailyRept_AtSea_METurboChgrAirCoolers_TC1ExhaustAirOutTemp: [
        null,
        [this.rangeValidator(0, 999)],
      ],
      DailyRept_AtSea_METurboChgrAirCoolers_TC2RPM: [
        null,
        this.rangeValidator(0, 999),
      ],
      DailyRept_AtSea_METurboChgrAirCoolers_TC2ExhaustAirINTemp: [null],
      DailyRept_AtSea_METurboChgrAirCoolers_TC2ExhaustAirOutTemp: [null],
      DailyRept_AtSea_METurboChgrAirCoolers_TC3RPM: [
        null,
        this.rangeValidator(0, 999),
      ],
      DailyRept_AtSea_METurboChgrAirCoolers_TC3ExhaustAirINTemp: [null],
      DailyRept_AtSea_METurboChgrAirCoolers_TC3ExhaustAirOutTemp: [null],
      DailyRept_AtSea_METurboChgrAirCoolers_AuxBlowerONOFF: [null],
      DailyRept_AtSea_METurboChgrAirCoolers_AirCooler1CoolingWaterInTemp: [
        null,
        this.rangeValidator(0, 100),
      ],
      DailyRept_AtSea_METurboChgrAirCoolers_AirCooler1CoolingWaterOutTemp: [
        null,
        this.rangeValidator(0, 100),
      ],
      DailyRept_AtSea_METurboChgrAirCoolers_ExhaustRecvPressure: [
        null,
        this.rangeValidator(0, 5),
      ],
      DailyRept_AtSea_METurboChgrAirCoolers_AirCooler2CoolingWaterInTemp: [
        null,
        this.rangeValidator(0, 100),
      ],
      DailyRept_AtSea_METurboChgrAirCoolers_AirCooler2CoolingWaterOutTemp: [
        null,
        this.rangeValidator(0, 100),
      ],
      DailyRept_AtSea_METurboChgrAirCoolers_ScavengetRecvPressure: [
        null,
        [Validators.required, , this.rangeValidator(0, 5)],
      ],
      DailyRept_AtSea_METurboChgrAirCoolers_AirCooler3CoolingWaterInTemp: [
        null,
        this.rangeValidator(0, 100),
      ],
      DailyRept_AtSea_METurboChgrAirCoolers_AirCooler3CoolingWaterOutTemp: [
        null,
        this.rangeValidator(0, 100),
      ],

      // At Sea (Main Engine - Air, Fuel Oil & Lubrication Oil)
      DailyRept_AtSea_MEAirFOLO_ScavengetRecvTemp: [
        null,
        [Validators.required, this.rangeValidator(0, 100)],
      ],
      DailyRept_AtSea_MEAirFOLO_AirCooler1AirInTemp: [
        null,
        this.rangeValidator(0, 300),
      ],
      DailyRept_AtSea_MEAirFOLO_AirCooler1AirOutTemp: [
        null,
        this.rangeValidator(0, 300),
      ],
      DailyRept_AtSea_MEAirFOLO_MainLOTemp: [
        null,
        [Validators.required, this.rangeValidator(0, 100)],
      ],
      DailyRept_AtSea_MEAirFOLO_AirCooler2AirInTemp: [
        null,
        this.rangeValidator(0, 300),
      ],
      DailyRept_AtSea_MEAirFOLO_AirCooler2AirOutTemp: [
        null,
        this.rangeValidator(0, 300),
      ],
      DailyRept_AtSea_MEAirFOLO_MainLOPressure: [
        null,
        [Validators.required, this.rangeValidator(0, 20)],
      ],
      DailyRept_AtSea_MEAirFOLO_AirCooler3AirInTemp: [
        null,
        this.rangeValidator(0, 300),
      ],
      DailyRept_AtSea_MEAirFOLO_AirCooler3AirOutTemp: [
        null,
        this.rangeValidator(0, 300),
      ],
      DailyRept_AtSea_MEAirFOLO_ServoOilPressure: [
        null,
        [Validators.required, this.rangeValidator(0, 999)],
      ],
      DailyRept_AtSea_MEAirFOLO_DiffPressureAirFilterPressure: [
        null,
        this.rangeValidator(0, 10),
      ],
      DailyRept_AtSea_MEAirFOLO_TCLOInTemp: [null, this.rangeValidator(0, 999)],
      DailyRept_AtSea_MEAirFOLO_FuelOilTemp: [
        null,
        [Validators.required, this.rangeValidator(0, 200)],
      ],
      DailyRept_AtSea_MEAirFOLO_AxialVibration: [
        null,
        this.rangeValidator(0, 100),
      ],
      DailyRept_AtSea_MEAirFOLO_FuelOilPressure: [
        null,
        [Validators.required, this.rangeValidator(0, 30)],
      ],
      DailyRept_AtSea_MEAirFOLO_FuelIndex: [null, this.rangeValidator(0, 100)],
      DailyRept_AtSea_MEAirFOLO_FuelOilRailPressure: [
        null,
        this.rangeValidator(0, 999),
      ],

      // At Sea (Main Engine - Unit 1)
      DailyRept_AtSea_MEUnit1_ExhaustTemp: [null, this.rangeValidator(0, 999)],
      DailyRept_AtSea_MEUnit1_CoolingWaterOutTemp: [
        null,
        this.rangeValidator(0, 100),
      ],
      DailyRept_AtSea_MEUnit1_PistonOutTemp: [
        null,
        this.rangeValidator(0, 999),
      ],
      DailyRept_AtSea_MEUnit1_FuelIndex: [null, this.rangeValidator(0, 100)],
      DailyRept_AtSea_MEUnit1_InjectionCorrectionFactor: [
        null,
        this.rangeValidator(0, 100),
      ],
      DailyRept_AtSea_MEUnit1_NominalFeedRate: [
        null,
        this.rangeValidator(0, 100),
      ],

      // At Sea (Main Engine - Unit 2)
      DailyRept_AtSea_MEUnit2_ExhaustTemp: [null, this.rangeValidator(0, 999)],
      DailyRept_AtSea_MEUnit2_CoolingWaterOutTemp: [
        null,
        this.rangeValidator(0, 100),
      ],
      DailyRept_AtSea_MEUnit2_PistonOutTemp: [
        null,
        this.rangeValidator(0, 999),
      ],
      DailyRept_AtSea_MEUnit2_FuelIndex: [null, this.rangeValidator(0, 100)],
      DailyRept_AtSea_MEUnit2_InjectionCorrectionFactor: [
        null,
        this.rangeValidator(0, 100),
      ],
      DailyRept_AtSea_MEUnit2_NominalFeedRate: [
        null,
        this.rangeValidator(0, 100),
      ],

      // At Sea (Main Engine - Unit 3)
      DailyRept_AtSea_MEUnit3_ExhaustTemp: [null, this.rangeValidator(0, 999)],
      DailyRept_AtSea_MEUnit3_CoolingWaterOutTemp: [
        null,
        this.rangeValidator(0, 100),
      ],
      DailyRept_AtSea_MEUnit3_PistonOutTemp: [
        null,
        this.rangeValidator(0, 999),
      ],
      DailyRept_AtSea_MEUnit3_FuelIndex: [null, this.rangeValidator(0, 100)],
      DailyRept_AtSea_MEUnit3_InjectionCorrectionFactor: [
        null,
        this.rangeValidator(0, 100),
      ],
      DailyRept_AtSea_MEUnit3_NominalFeedRate: [
        null,
        this.rangeValidator(0, 100),
      ],

      // At Sea (Main Engine - Unit 4)
      DailyRept_AtSea_MEUnit4_ExhaustTemp: [null, this.rangeValidator(0, 999)],
      DailyRept_AtSea_MEUnit4_CoolingWaterOutTemp: [
        null,
        this.rangeValidator(0, 100),
      ],
      DailyRept_AtSea_MEUnit4_PistonOutTemp: [
        null,
        this.rangeValidator(0, 999),
      ],
      DailyRept_AtSea_MEUnit4_FuelIndex: [null, this.rangeValidator(0, 100)],
      DailyRept_AtSea_MEUnit4_InjectionCorrectionFactor: [
        null,
        this.rangeValidator(0, 100),
      ],
      DailyRept_AtSea_MEUnit4_NominalFeedRate: [
        null,
        this.rangeValidator(0, 100),
      ],

      // At Sea (Main Engine - Unit 5)
      DailyRept_AtSea_MEUnit5_ExhaustTemp: [null, this.rangeValidator(0, 999)],
      DailyRept_AtSea_MEUnit5_CoolingWaterOutTemp: [
        null,
        this.rangeValidator(0, 100),
      ],
      DailyRept_AtSea_MEUnit5_PistonOutTemp: [
        null,
        this.rangeValidator(0, 999),
      ],
      DailyRept_AtSea_MEUnit5_FuelIndex: [null, this.rangeValidator(0, 100)],
      DailyRept_AtSea_MEUnit5_InjectionCorrectionFactor: [
        null,
        this.rangeValidator(0, 100),
      ],
      DailyRept_AtSea_MEUnit5_NominalFeedRate: [
        null,
        this.rangeValidator(0, 100),
      ],

      // At Sea (Main Engine - Unit 6)
      DailyRept_AtSea_MEUnit6_ExhaustTemp: [null, this.rangeValidator(0, 999)],
      DailyRept_AtSea_MEUnit6_CoolingWaterOutTemp: [
        null,
        this.rangeValidator(0, 100),
      ],
      DailyRept_AtSea_MEUnit6_PistonOutTemp: [
        null,
        this.rangeValidator(0, 999),
      ],
      DailyRept_AtSea_MEUnit6_FuelIndex: [null, this.rangeValidator(0, 100)],
      DailyRept_AtSea_MEUnit6_InjectionCorrectionFactor: [
        null,
        this.rangeValidator(0, 100),
      ],
      DailyRept_AtSea_MEUnit6_NominalFeedRate: [
        null,
        this.rangeValidator(0, 100),
      ],

      // At Sea (Main Engine - Unit 7)
      DailyRept_AtSea_MEUnit7_ExhaustTemp: [null, this.rangeValidator(0, 999)],
      DailyRept_AtSea_MEUnit7_CoolingWaterOutTemp: [
        null,
        this.rangeValidator(0, 100),
      ],
      DailyRept_AtSea_MEUnit7_PistonOutTemp: [
        null,
        this.rangeValidator(0, 999),
      ],
      DailyRept_AtSea_MEUnit7_FuelIndex: [null, this.rangeValidator(0, 100)],
      DailyRept_AtSea_MEUnit7_InjectionCorrectionFactor: [
        null,
        this.rangeValidator(0, 100),
      ],
      DailyRept_AtSea_MEUnit7_NominalFeedRate: [
        null,
        this.rangeValidator(0, 100),
      ],

      // At Sea (Main Engine - Unit 8)
      DailyRept_AtSea_MEUnit8_ExhaustTemp: [null, this.rangeValidator(0, 999)],
      DailyRept_AtSea_MEUnit8_CoolingWaterOutTemp: [
        null,
        this.rangeValidator(0, 100),
      ],
      DailyRept_AtSea_MEUnit8_PistonOutTemp: [
        null,
        this.rangeValidator(0, 999),
      ],
      DailyRept_AtSea_MEUnit8_FuelIndex: [null, this.rangeValidator(0, 100)],
      DailyRept_AtSea_MEUnit8_InjectionCorrectionFactor: [
        null,
        this.rangeValidator(0, 100),
      ],
      DailyRept_AtSea_MEUnit8_NominalFeedRate: [
        null,
        this.rangeValidator(0, 100),
      ],

      // At Sea (Main Engine - Unit 9)
      DailyRept_AtSea_MEUnit9_ExhaustTemp: [null, this.rangeValidator(0, 999)],
      DailyRept_AtSea_MEUnit9_CoolingWaterOutTemp: [
        null,
        this.rangeValidator(0, 100),
      ],
      DailyRept_AtSea_MEUnit9_PistonOutTemp: [
        null,
        this.rangeValidator(0, 999),
      ],
      DailyRept_AtSea_MEUnit9_FuelIndex: [null, this.rangeValidator(0, 100)],
      DailyRept_AtSea_MEUnit9_InjectionCorrectionFactor: [
        null,
        this.rangeValidator(0, 100),
      ],
      DailyRept_AtSea_MEUnit9_NominalFeedRate: [
        null,
        this.rangeValidator(0, 100),
      ],

      // At Sea (Main Engine - Unit 10)
      DailyRept_AtSea_MEUnit10_ExhaustTemp: [null, this.rangeValidator(0, 999)],
      DailyRept_AtSea_MEUnit10_CoolingWaterOutTemp: [
        null,
        this.rangeValidator(0, 100),
      ],
      DailyRept_AtSea_MEUnit10_PistonOutTemp: [
        null,
        this.rangeValidator(0, 999),
      ],
      DailyRept_AtSea_MEUnit10_FuelIndex: [null, this.rangeValidator(0, 100)],
      DailyRept_AtSea_MEUnit10_InjectionCorrectionFactor: [
        null,
        this.rangeValidator(0, 100),
      ],
      DailyRept_AtSea_MEUnit10_NominalFeedRate: [
        null,
        this.rangeValidator(0, 100),
      ],

      // At Sea (Main Engine - Unit 11)
      DailyRept_AtSea_MEUnit11_ExhaustTemp: [null, this.rangeValidator(0, 999)],
      DailyRept_AtSea_MEUnit11_CoolingWaterOutTemp: [
        null,
        this.rangeValidator(0, 100),
      ],
      DailyRept_AtSea_MEUnit11_PistonOutTemp: [
        null,
        this.rangeValidator(0, 999),
      ],
      DailyRept_AtSea_MEUnit11_FuelIndex: [null, this.rangeValidator(0, 100)],
      DailyRept_AtSea_MEUnit11_InjectionCorrectionFactor: [
        null,
        this.rangeValidator(0, 100),
      ],
      DailyRept_AtSea_MEUnit11_NominalFeedRate: [
        null,
        this.rangeValidator(0, 100),
      ],

      // At Sea (Main Engine - Unit 12)
      DailyRept_AtSea_MEUnit12_ExhaustTemp: [null, this.rangeValidator(0, 999)],
      DailyRept_AtSea_MEUnit12_CoolingWaterOutTemp: [
        null,
        this.rangeValidator(0, 100),
      ],
      DailyRept_AtSea_MEUnit12_PistonOutTemp: [
        null,
        this.rangeValidator(0, 999),
      ],
      DailyRept_AtSea_MEUnit12_FuelIndex: [null, this.rangeValidator(0, 100)],
      DailyRept_AtSea_MEUnit12_InjectionCorrectionFactor: [
        null,
        this.rangeValidator(0, 100),
      ],
      DailyRept_AtSea_MEUnit12_NominalFeedRate: [
        null,
        this.rangeValidator(0, 100),
      ],

      // At Sea (Main Engine - Consumption)
      DailyRept_AtSea_MECons_FuelCons: [
        null,
        [Validators.required, this.rangeValidator(0, 999)],
      ],
      DailyRept_AtSea_MECons_Fuelinuse: [null],
      DailyRept_AtSea_MECons_CylOilCons: [
        null,
        [Validators.required, this.rangeValidator(0, 9999)],
      ],
      DailyRept_AtSea_MECons_CylLOBN: [null, this.rangeValidator(0, 999)],
      DailyRept_AtSea_MECons_SysOilConsLtrs: [
        null,
        this.rangeValidator(0, 9999),
      ],

      // At Sea (Aux. Engine - Consumption)
      DailyRept_AtSea_AECons_AE1RHRS: [null,[Validators.pattern('^[.0-9]*$'),this.rangeValidator(0,26)]],
      DailyRept_AtSea_AECons_AE1RHRS_TotalCounter:[null,[Validators.pattern('^[.0-9]*$'),this.rangeValidator(0,200000)]],

      DailyRept_AtSea_AECons_LOCons1: [null, this.rangeValidator(0, 9999)],
      DailyRept_AtSea_AECons_AE2RHRS: [null,[Validators.pattern('^[.0-9]*$'),this.rangeValidator(0,26)]],
      DailyRept_AtSea_AECons_AE2RHRS_TotalCounter:[null,[Validators.pattern('^[.0-9]*$'),this.rangeValidator(0,200000)]],

      DailyRept_AtSea_AECons_LOCons2: [null, this.rangeValidator(0, 9999)],
      DailyRept_AtSea_AECons_AE3RHRS: [null,[Validators.pattern('^[.0-9]*$'),this.rangeValidator(0,26)]],
      DailyRept_AtSea_AECons_AE3RHRS_TotalCounter:[null,[Validators.pattern('^[.0-9]*$'),this.rangeValidator(0,200000)]],

      DailyRept_AtSea_AECons_LOCons3: [null, this.rangeValidator(0, 9999)],
      DailyRept_AtSea_AECons_AE4RHRS: [null,[Validators.pattern('^[.0-9]*$'),this.rangeValidator(0,26)]],
      DailyRept_AtSea_AECons_AE4RHRS_TotalCounter:[null,[Validators.pattern('^[.0-9]*$'),this.rangeValidator(0,200000)]],

      DailyRept_AtSea_AECons_LOCons4: [null, this.rangeValidator(0, 9999)],
      DailyRept_AtSea_AECons_AE5RHRS: [null],
      DailyRept_AtSea_AECons_AE5RHRS_TotalCounter:[null,[Validators.pattern('^[.0-9]*$'),this.rangeValidator(0,200000)]],
      DailyRept_AtSea_AECons_LOCons5: [null, this.rangeValidator(0, 9999)],
      DailyRept_AtSea_AECons_AE6RHRS: [null],
      DailyRept_AtSea_AECons_AE6RHRS_TotalCounter:[null,[Validators.pattern('^[.0-9]*$'),this.rangeValidator(0,200000)]],
      DailyRept_AtSea_AECons_LOCons6: [null, this.rangeValidator(0, 9999)],
      DailyRept_AtSea_AECons_AE7RHRS: [null],
      DailyRept_AtSea_AECons_AE7RHRS_TotalCounter:[null,[Validators.pattern('^[.0-9]*$'),this.rangeValidator(0,200000)]],
      DailyRept_AtSea_AECons_LOCons7: [null, this.rangeValidator(0, 9999)],
      DailyRept_AtSea_AECons_AE8RHRS: [null],
      DailyRept_AtSea_AECons_AE8RHRS_TotalCounter:[null,[Validators.pattern('^[.0-9]*$'),this.rangeValidator(0,200000)]],
      DailyRept_AtSea_AECons_LOCons8: [null, this.rangeValidator(0, 9999)],
      DailyRept_AtSea_AECons_TotalAELoad: [null, [Validators.required]],
      DailyRept_AtSea_AECons_ReeferCons: [null],
      DailyRept_AtSea_AECons_TotalAEFuelCons: [null, [Validators.required]],
      DailyRept_AtSea_AECons_FuelInUse: [null],
      DailyRept_AtSea_AECons_AddComments: [null],

      // At Sea (Boiler - Consumption)
      DailyRept_AtSea_BLRCons_TotalFuelCons: [
        null,
        [Validators.required, this.rangeValidator(0, 999)],
      ],
      DailyRept_AtSea_BLRCons_FuelInUse: [null],

      // at Sea (additional comments)
      DailyRept_AtSea_Gen_Comments: [null],

      // At Sea (Miscellaneous)
      DailyRept_AtSea_Misc_TotalFreshWaterProd: [
        null,
        this.rangeValidator(0, 9999),
      ],
      DailyRept_AtSea_Misc_SternTubeCons: [null, this.rangeValidator(0, 999)],
      DailyRept_AtSea_Misc_SternTubeTemp: [null, this.rangeValidator(0, 100)],
      DailyRept_AtSea_Misc_MEAutoFilterBackFlush: [
        null,
        this.rangeValidator(0, 100),
      ],
      DailyRept_AtSea_Misc_MEFineFilterBackFlush: [
        null,
        this.rangeValidator(0, 100),
      ],
      DailyRept_AtSea_Misc_AEAutoFilterBackFlush: [
        null,
        this.rangeValidator(0, 100),
      ],
      DailyRept_AtSea_Misc_AEFineFilterBackFlush: [
        null,
        this.rangeValidator(0, 100),
      ],

      // at Sea (Miscellaneous – R.O.B)
      DailyRept_AtSea_MiscROB_TotalSludgeROB: [
        null,
        this.rangeValidator(0, 999),
      ],
      DailyRept_AtSea_MiscROB_SludgeLanded: [null, this.rangeValidator(0, 999)],
      DailyRept_AtSea_MiscROB_ERBilgeROB: [null, this.rangeValidator(0, 999)],
      DailyRept_AtSea_MiscROB_ERBilgeDischarge: [
        null,
        this.rangeValidator(0, 999),
      ],
      DailyRept_AtSea_MiscROB_MESYSOil: [null, this.rangeValidator(0, 999)],
      DailyRept_AtSea_MiscROB_FreshWaterROB: [
        null,
        this.rangeValidator(0, 999),
      ],
      DailyRept_AtSea_MiscROB_MECylOil1: [null, this.rangeValidator(0, 999)],
      DailyRept_AtSea_MiscROB_MECylOil2: [null, this.rangeValidator(0, 999)],
      DailyRept_AtSea_MiscROB_AECylOil1: [null, this.rangeValidator(0, 999)],
      DailyRept_AtSea_MiscROB_AECylOil2: [null, this.rangeValidator(0, 999)],
      Fuel_Grade: [null],
      Fuel_Grade1: [null],
      _rev: [null],
      createdAt: [null],
    });
  }

  ngOnInit(): void {
    this.addUpdateDailyReportReportForm.patchValue({
      DailyRept_AtSea_IMO_No: this.localUser.IMO_No,
      Report_Type: 'At Sea',
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

        if (data.DailyRept_AtSea_MECons_Fuelinuse) {
          this.addUpdateDailyReportReportForm.patchValue({
            DailyRept_AtSea_MECons_Fuelinuse:
              data.DailyRept_AtSea_MECons_Fuelinuse,
          });
        }
        if (data.DailyRept_AtSea_AECons_FuelInUse) {
          this.addUpdateDailyReportReportForm.patchValue({
            DailyRept_AtSea_AECons_FuelInUse:
              data.DailyRept_AtSea_AECons_FuelInUse,
          });
        }
        if (data.DailyRept_AtSea_BLRCons_FuelInUse) {
          this.addUpdateDailyReportReportForm.patchValue({
            DailyRept_AtSea_BLRCons_FuelInUse:
              data.DailyRept_AtSea_BLRCons_FuelInUse,
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
      .request('get', `daily-report-at-seas/${this.idForUpdate}`)
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

          if (result.data.DailyRept_AtSea_MECons_Fuelinuse) {
            this.addUpdateDailyReportReportForm.patchValue({
              DailyRept_AtSea_MECons_Fuelinuse:
                result.data.DailyRept_AtSea_MECons_Fuelinuse._id,
            });
          }
          if (result.data.DailyRept_AtSea_AECons_FuelInUse) {
            this.addUpdateDailyReportReportForm.patchValue({
              DailyRept_AtSea_AECons_FuelInUse:
                result.data.DailyRept_AtSea_AECons_FuelInUse._id,
            });
          }
          if (result.data.DailyRept_AtSea_BLRCons_FuelInUse) {
            this.addUpdateDailyReportReportForm.patchValue({
              DailyRept_AtSea_BLRCons_FuelInUse:
                result.data.DailyRept_AtSea_BLRCons_FuelInUse._id,
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
              //this.router.navigateByUrl('/main/machinery-report/daily-report');
            })
            .catch((err: any) => {
              console.error(err);
            });
        }
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

  /* Add Or Edit Daily Report at sea */
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
