import { NullTemplateVisitor } from '@angular/compiler';
import { Component, OnInit, OnChanges, SimpleChanges } from '@angular/core';
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
  LocalStorageService,
} from 'src/app/core/services';
import { timeZoneData } from './timezone.data';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';

@Component({
  selector: 'app-add-update-daily-report',
  templateUrl: './add-update-daily-report.component.html',
  styleUrls: ['./add-update-daily-report.component.scss'],
})
export class AddUpdateDailyReportComponent implements OnInit {
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
    private nzModalService: NzModalService
  ) {
    this.localUser = this.localStorageService.getItem('user');
    this.idForUpdate = this.activatedRoute.snapshot.params.id;
    this.addUpdateDailyReportReportForm = this.fb.group({
      // uniqueId
      //uniqueId: [null],
      //DailyReportUniqueId: [null],
      DailyRept_IMO_No: [null],
      // checkbox
      isCheckedButton: [null],
      isFuelCheckedButton: [null],
      isPortCheckedButton: [null],
      isAncCheckedButton: [null],
      isDriftingCheckedButton: [null],
      isManArrCheckedButton: [null],
      isManDepCheckedButton: [null],
      // Vessel Activity (At Sea)
      DailyRept_VslActivity_At_Sea_StartDate: [null],
      DailyRept_VslActivity_At_Sea_StartTime: [null],
      DailyRept_VslActivity_At_Sea_EndDate: [null],
      DailyRept_VslActivity_At_Sea_EndTime: [null],

      // Vessel Activity (Fuel Changeover)
      DailyRept_VslActivity_Fuel_Changeover_StartDate: [null],
      DailyRept_VslActivity_Fuel_Changeover_StartTime: [null],
      DailyRept_VslActivity_Fuel_Changeover_EndDate: [null],
      DailyRept_VslActivity_Fuel_Changeover_EndTime: [null],

      // Vessel Activity (At Port)
      DailyRept_VslActivity_At_Port_StartDate: [null],
      DailyRept_VslActivity_At_Port_StartTime: [null],
      DailyRept_VslActivity_At_Port_EndDate: [null],
      DailyRept_VslActivity_At_Port_EndTime: [null],

      // Vessel Activity (At Anchorage)
      DailyRept_VslActivity_At_Anchorage_StartDate: [null],
      DailyRept_VslActivity_At_Anchorage_StartTime: [null],
      DailyRept_VslActivity_At_Anchorage_EndDate: [null],
      DailyRept_VslActivity_At_Anchorage_EndTime: [null],

      // Vessel Activity (At Drifting)
      DailyRept_VslActivity_At_Drifting_StartDate: [null],
      DailyRept_VslActivity_At_Drifting_StartTime: [null],
      DailyRept_VslActivity_At_Drifting_EndDate: [null],
      DailyRept_VslActivity_At_Drifting_EndTime: [null],

      // Vessel Activity (Manoeuvring [Arrival]
      DailyRept_VslActivity_Manoeuvring_Arrival_StartDate: [null],
      DailyRept_VslActivity_Manoeuvring_Arrival_StartTime: [null],
      DailyRept_VslActivity_Manoeuvring_Arrival_EndDate: [null],
      DailyRept_VslActivity_Manoeuvring_Arrival_EndTime: [null],

      // Vessel Activity (Manoeuvring [Departure])
      DailyRept_VslActivity_Manoeuvring_Departure_StartDate: [null],
      DailyRept_VslActivity_Manoeuvring_Departure_StartTime: [null],
      DailyRept_VslActivity_Manoeuvring_Departure_EndDate: [null],
      DailyRept_VslActivity_Manoeuvring_Departure_EndTime: [null],

      // At Sea (Voyage Details)
      DailyRept_AtSea_VoyDetails_VoyNo: [null],
      DailyRept_AtSea_VoyDetails_TimeZone: [null],
      DailyRept_AtSea_VoyDetails_DistOverGrnd: [
        null,
        [Validators.pattern('^[.0-9]*$')],
      ],
      DailyRept_AtSea_VoyDetails_TimeShft: [
        null,
        [Validators.pattern('^-?[1-9]+([.0-9]+)*$')],
      ],
      DailyRept_AtSea_VoyDetails_DistOverSea: [
        null,
        [Validators.pattern('^[.0-9]*$')],
      ],
      DailyRept_AtSea_VoyDetails_LoadingCond: [null],
      DailyRept_AtSea_VoyDetails_AvgSpeed: [
        null,
        [Validators.pattern('^[.0-9]*$')],
      ],
      DailyRept_AtSea_VoyDetails_WindForce: [null],
      DailyRept_AtSea_VoyDetails_WindDirection: [null],
      DailyRept_AtSea_VoyDetails_RestrictNavg: [null],

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
      DailyRept_AtSea_CargoInfo_CargoType1MT: [null],
      DailyRept_AtSea_CargoInfo_CargoType2Name: [null],
      DailyRept_AtSea_CargoInfo_CargoType2MT: [null],
      DailyRept_AtSea_CargoInfo_CargoType3Name: [null],
      DailyRept_AtSea_CargoInfo_CargoType3MT: [null],
      DailyRept_AtSea_CargoInfo_CargoType4Name: [null],
      DailyRept_AtSea_CargoInfo_CargoType4MT: [null],
      DailyRept_AtSea_CargoInfo_CargoType5Name: [null],
      DailyRept_AtSea_CargoInfo_CargoType5MT: [null],
      DailyRept_AtSea_CargoInfo_CargoType6Name: [null],
      DailyRept_AtSea_CargoInfo_CargoType6MT: [null],
      DailyRept_AtSea_CargoInfo_CargoType7Name: [null],
      DailyRept_AtSea_CargoInfo_CargoType7MT: [null],
      DailyRept_AtSea_CargoInfo_CargoType8Name: [null],
      DailyRept_AtSea_CargoInfo_CargoType8MT: [null],
      DailyRept_AtSea_CargoInfo_CargoType9Name: [null],
      DailyRept_AtSea_CargoInfo_CargoType9MT: [null],
      DailyRept_AtSea_CargoInfo_CargoType10Name: [null],
      DailyRept_AtSea_CargoInfo_CargoType10MT: [null],

      // At Sea (weather info.)
      DailyRept_AtSea_WeatherInfo_SeaWaterTemp: [null],
      DailyRept_AtSea_WeatherInfo_ERTemp: [null],
      DailyRept_AtSea_WeatherInfo_OutsideTemp: [null, [Validators.required]],
      DailyRept_AtSea_WeatherInfo_OutsideHumidity: [null],

      // At Sea (Main Engine Info.)
      DailyRept_AtSea_MEInfo_MEAvgLoad: [null],
      DailyRept_AtSea_MEInfo_MEAvgRPM: [null],
      DailyRept_AtSea_MEInfo_MEAvgLoadPercent: [null],
      DailyRept_AtSea_MEInfo_MERhrs: [null],

      // At Sea (Main Engine - Turbochargers & Air coolers)
      DailyRept_AtSea_METurboChgrAirCoolers_TC1RPM: [null],
      DailyRept_AtSea_METurboChgrAirCoolers_TC1ExhaustAirINTemp: [null],
      DailyRept_AtSea_METurboChgrAirCoolers_TC1ExhaustAirOutTemp: [null],
      DailyRept_AtSea_METurboChgrAirCoolers_TC2RPM: [null],
      DailyRept_AtSea_METurboChgrAirCoolers_TC2ExhaustAirINTemp: [null],
      DailyRept_AtSea_METurboChgrAirCoolers_TC2ExhaustAirOutTemp: [null],
      DailyRept_AtSea_METurboChgrAirCoolers_TC3RPM: [null],
      DailyRept_AtSea_METurboChgrAirCoolers_TC3ExhaustAirINTemp: [null],
      DailyRept_AtSea_METurboChgrAirCoolers_TC3ExhaustAirOutTemp: [null],
      DailyRept_AtSea_METurboChgrAirCoolers_AuxBlowerONOFF: [null],
      DailyRept_AtSea_METurboChgrAirCoolers_AirCooler1CoolingWaterInTemp: [
        null,
      ],
      DailyRept_AtSea_METurboChgrAirCoolers_AirCooler1CoolingWaterOutTemp: [
        null,
      ],
      DailyRept_AtSea_METurboChgrAirCoolers_ExhaustRecvPressure: [null],
      DailyRept_AtSea_METurboChgrAirCoolers_AirCooler2CoolingWaterInTemp: [
        null,
      ],
      DailyRept_AtSea_METurboChgrAirCoolers_AirCooler2CoolingWaterOutTemp: [
        null,
      ],
      DailyRept_AtSea_METurboChgrAirCoolers_ScavengetRecvPressure: [null],
      DailyRept_AtSea_METurboChgrAirCoolers_AirCooler3CoolingWaterInTemp: [
        null,
      ],
      DailyRept_AtSea_METurboChgrAirCoolers_AirCooler3CoolingWaterOutTemp: [
        null,
      ],

      // At Sea (Main Engine - Air, Fuel Oil & Lubrication Oil)
      DailyRept_AtSea_MEAirFOLO_ScavengetRecvTemp: [null],
      DailyRept_AtSea_MEAirFOLO_AirCooler1AirInTemp: [null],
      DailyRept_AtSea_MEAirFOLO_AirCooler1AirOutTemp: [null],
      DailyRept_AtSea_MEAirFOLO_MainLOTemp: [null],
      DailyRept_AtSea_MEAirFOLO_AirCooler2AirInTemp: [null],
      DailyRept_AtSea_MEAirFOLO_AirCooler2AirOutTemp: [null],
      DailyRept_AtSea_MEAirFOLO_MainLOPressure: [null],
      DailyRept_AtSea_MEAirFOLO_AirCooler3AirInTemp: [null],
      DailyRept_AtSea_MEAirFOLO_AirCooler3AirOutTemp: [null],
      DailyRept_AtSea_MEAirFOLO_ServoOilPressure: [null],
      DailyRept_AtSea_MEAirFOLO_DiffPressureAirFilterPressure: [null],
      DailyRept_AtSea_MEAirFOLO_TCLOInTemp: [null],
      DailyRept_AtSea_MEAirFOLO_FuelOilTemp: [null],
      DailyRept_AtSea_MEAirFOLO_AxialVibration: [null],
      DailyRept_AtSea_MEAirFOLO_FuelOilPressure: [null],
      DailyRept_AtSea_MEAirFOLO_FuelIndex: [null],
      DailyRept_AtSea_MEAirFOLO_FuelOilRailPressure: [null],

      // At Sea (Main Engine - Unit 1)
      DailyRept_AtSea_MEUnit1_ExhaustTemp: [null],
      DailyRept_AtSea_MEUnit1_CoolingWaterOutTemp: [null],
      DailyRept_AtSea_MEUnit1_PistonOutTemp: [null],
      DailyRept_AtSea_MEUnit1_FuelIndex: [null],
      DailyRept_AtSea_MEUnit1_InjectionCorrectionFactor: [null],
      DailyRept_AtSea_MEUnit1_NominalFeedRate: [null],

      // At Sea (Main Engine - Unit 2)
      DailyRept_AtSea_MEUnit2_ExhaustTemp: [null],
      DailyRept_AtSea_MEUnit2_CoolingWaterOutTemp: [null],
      DailyRept_AtSea_MEUnit2_PistonOutTemp: [null],
      DailyRept_AtSea_MEUnit2_FuelIndex: [null],
      DailyRept_AtSea_MEUnit2_InjectionCorrectionFactor: [null],
      DailyRept_AtSea_MEUnit2_NominalFeedRate: [null],

      // At Sea (Main Engine - Unit 3)
      DailyRept_AtSea_MEUnit3_ExhaustTemp: [null],
      DailyRept_AtSea_MEUnit3_CoolingWaterOutTemp: [null],
      DailyRept_AtSea_MEUnit3_PistonOutTemp: [null],
      DailyRept_AtSea_MEUnit3_FuelIndex: [null],
      DailyRept_AtSea_MEUnit3_InjectionCorrectionFactor: [null],
      DailyRept_AtSea_MEUnit3_NominalFeedRate: [null],

      // At Sea (Main Engine - Unit 4)
      DailyRept_AtSea_MEUnit4_ExhaustTemp: [null],
      DailyRept_AtSea_MEUnit4_CoolingWaterOutTemp: [null],
      DailyRept_AtSea_MEUnit4_PistonOutTemp: [null],
      DailyRept_AtSea_MEUnit4_FuelIndex: [null],
      DailyRept_AtSea_MEUnit4_InjectionCorrectionFactor: [null],
      DailyRept_AtSea_MEUnit4_NominalFeedRate: [null],

      // At Sea (Main Engine - Unit 5)
      DailyRept_AtSea_MEUnit5_ExhaustTemp: [null],
      DailyRept_AtSea_MEUnit5_CoolingWaterOutTemp: [null],
      DailyRept_AtSea_MEUnit5_PistonOutTemp: [null],
      DailyRept_AtSea_MEUnit5_FuelIndex: [null],
      DailyRept_AtSea_MEUnit5_InjectionCorrectionFactor: [null],
      DailyRept_AtSea_MEUnit5_NominalFeedRate: [null],

      // At Sea (Main Engine - Unit 6)
      DailyRept_AtSea_MEUnit6_ExhaustTemp: [null],
      DailyRept_AtSea_MEUnit6_CoolingWaterOutTemp: [null],
      DailyRept_AtSea_MEUnit6_PistonOutTemp: [null],
      DailyRept_AtSea_MEUnit6_FuelIndex: [null],
      DailyRept_AtSea_MEUnit6_InjectionCorrectionFactor: [null],
      DailyRept_AtSea_MEUnit6_NominalFeedRate: [null],

      // At Sea (Main Engine - Unit 7)
      DailyRept_AtSea_MEUnit7_ExhaustTemp: [null],
      DailyRept_AtSea_MEUnit7_CoolingWaterOutTemp: [null],
      DailyRept_AtSea_MEUnit7_PistonOutTemp: [null],
      DailyRept_AtSea_MEUnit7_FuelIndex: [null],
      DailyRept_AtSea_MEUnit7_InjectionCorrectionFactor: [null],
      DailyRept_AtSea_MEUnit7_NominalFeedRate: [null],

      // At Sea (Main Engine - Unit 8)
      DailyRept_AtSea_MEUnit8_ExhaustTemp: [null],
      DailyRept_AtSea_MEUnit8_CoolingWaterOutTemp: [null],
      DailyRept_AtSea_MEUnit8_PistonOutTemp: [null],
      DailyRept_AtSea_MEUnit8_FuelIndex: [null],
      DailyRept_AtSea_MEUnit8_InjectionCorrectionFactor: [null],
      DailyRept_AtSea_MEUnit8_NominalFeedRate: [null],

      // At Sea (Main Engine - Unit 9)
      DailyRept_AtSea_MEUnit9_ExhaustTemp: [null],
      DailyRept_AtSea_MEUnit9_CoolingWaterOutTemp: [null],
      DailyRept_AtSea_MEUnit9_PistonOutTemp: [null],
      DailyRept_AtSea_MEUnit9_FuelIndex: [null],
      DailyRept_AtSea_MEUnit9_InjectionCorrectionFactor: [null],
      DailyRept_AtSea_MEUnit9_NominalFeedRate: [null],

      // At Sea (Main Engine - Unit 10)
      DailyRept_AtSea_MEUnit10_ExhaustTemp: [null],
      DailyRept_AtSea_MEUnit10_CoolingWaterOutTemp: [null],
      DailyRept_AtSea_MEUnit10_PistonOutTemp: [null],
      DailyRept_AtSea_MEUnit10_FuelIndex: [null],
      DailyRept_AtSea_MEUnit10_InjectionCorrectionFactor: [null],
      DailyRept_AtSea_MEUnit10_NominalFeedRate: [null],

      // At Sea (Main Engine - Unit 11)
      DailyRept_AtSea_MEUnit11_ExhaustTemp: [null],
      DailyRept_AtSea_MEUnit11_CoolingWaterOutTemp: [null],
      DailyRept_AtSea_MEUnit11_PistonOutTemp: [null],
      DailyRept_AtSea_MEUnit11_FuelIndex: [null],
      DailyRept_AtSea_MEUnit11_InjectionCorrectionFactor: [null],
      DailyRept_AtSea_MEUnit11_NominalFeedRate: [null],

      // At Sea (Main Engine - Unit 12)
      DailyRept_AtSea_MEUnit12_ExhaustTemp: [null],
      DailyRept_AtSea_MEUnit12_CoolingWaterOutTemp: [null],
      DailyRept_AtSea_MEUnit12_PistonOutTemp: [null],
      DailyRept_AtSea_MEUnit12_FuelIndex: [null],
      DailyRept_AtSea_MEUnit12_InjectionCorrectionFactor: [null],
      DailyRept_AtSea_MEUnit12_NominalFeedRate: [null],

      // At Sea (Main Engine - Consumption)
      DailyRept_AtSea_MECons_FuelCons: [null],
      DailyRept_AtSea_MECons_Fuelinuse: [null],
      DailyRept_AtSea_MECons_CylOilCons: [null],
      DailyRept_AtSea_MECons_CylLOBN: [null],
      DailyRept_AtSea_MECons_SysOilConsLtrs: [null],

      // At Sea (Aux. Engine - Consumption)
      DailyRept_AtSea_AECons_AE1RHRS: [null],
      DailyRept_AtSea_AECons_LOCons1: [null],
      DailyRept_AtSea_AECons_AE2RHRS: [null],
      DailyRept_AtSea_AECons_LOCons2: [null],
      DailyRept_AtSea_AECons_AE3RHRS: [null],
      DailyRept_AtSea_AECons_LOCons3: [null],
      DailyRept_AtSea_AECons_AE4RHRS: [null],
      DailyRept_AtSea_AECons_LOCons4: [null],
      DailyRept_AtSea_AECons_AE5RHRS: [null],
      DailyRept_AtSea_AECons_LOCons5: [null],
      DailyRept_AtSea_AECons_AE6RHRS: [null],
      DailyRept_AtSea_AECons_LOCons6: [null],
      DailyRept_AtSea_AECons_AE7RHRS: [null],
      DailyRept_AtSea_AECons_LOCons7: [null],
      DailyRept_AtSea_AECons_AE8RHRS: [null],
      DailyRept_AtSea_AECons_LOCons8: [null],
      DailyRept_AtSea_AECons_TotalAELoad: [null],
      DailyRept_AtSea_AECons_ReeferCons: [null],
      DailyRept_AtSea_AECons_TotalAEFuelCons: [null],
      DailyRept_AtSea_AECons_FuelInUse: [null],
      DailyRept_AtSea_AECons_AddComments: [null],

      // At Sea (Boiler - Consumption)
      DailyRept_AtSea_BLRCons_TotalFuelCons: [null],
      DailyRept_AtSea_BLRCons_FuelInUse: [null],

      // at Sea (additional comments)
      DailyRept_AtSea_Gen_Comments: [null],

      // At Sea (Miscellaneous)
      DailyRept_AtSea_Misc_TotalFreshWaterProd: [null],
      DailyRept_AtSea_Misc_SternTubeCons: [null],
      DailyRept_AtSea_Misc_SternTubeTemp: [null],
      DailyRept_AtSea_Misc_MEAutoFilterBackFlush: [null],
      DailyRept_AtSea_Misc_MEFineFilterBackFlush: [null],
      DailyRept_AtSea_Misc_AEAutoFilterBackFlush: [null],
      DailyRept_AtSea_Misc_AEFineFilterBackFlush: [null],

      // at Sea (Miscellaneous – R.O.B)
      DailyRept_AtSea_MiscROB_TotalSludgeROB: [null],
      DailyRept_AtSea_MiscROB_SludgeLanded: [null],
      DailyRept_AtSea_MiscROB_ERBilgeROB: [null],
      DailyRept_AtSea_MiscROB_ERBilgeDischarge: [null],
      DailyRept_AtSea_MiscROB_MESYSOil: [null],
      DailyRept_AtSea_MiscROB_FreshWaterROB: [null],
      DailyRept_AtSea_MiscROB_MECylOil1: [null],
      DailyRept_AtSea_MiscROB_MECylOil2: [null],
      DailyRept_AtSea_MiscROB_AECylOil1: [null],
      DailyRept_AtSea_MiscROB_AECylOil2: [null],

      // Fuel Changeover (Main Engine – Consumption (From C/O Start))
      DailyRept_FuelChangeover_MECons_FuelCons: [null],
      DailyRept_FuelChangeover_MECons_Fuelinuse: [null],
      DailyRept_FuelChangeover_MECons_CylOilCons: [null],
      DailyRept_FuelChangeover_MECons_CylLOBN: [null],
      DailyRept_FuelChangeover_MECons_SysOilConsLtrs: [null],

      // Fuel Changeover (Aux. Engine - Consumption (From C/O Start))
      DailyRept_FuelChangeover_AECons_AE1RHRS: [null],
      DailyRept_FuelChangeover_AECons_LOCons1: [null],
      DailyRept_FuelChangeover_AECons_AE2RHRS: [null],
      DailyRept_FuelChangeover_AECons_LOCons2: [null],
      DailyRept_FuelChangeover_AECons_AE3RHRS: [null],
      DailyRept_FuelChangeover_AECons_LOCons3: [null],
      DailyRept_FuelChangeover_AECons_AE4RHRS: [null],
      DailyRept_FuelChangeover_AECons_LOCons4: [null],
      DailyRept_FuelChangeover_AECons_TotalAELoad: [null],
      DailyRept_FuelChangeover_AECons_ReeferCons: [null],
      DailyRept_FuelChangeover_AECons_TotalAEFuelCons: [null],
      DailyRept_FuelChangeover_AECons_FuelInUse: [null],
      DailyRept_FuelChangeover_AECons_AddComments: [null],

      // Fuel Changeover (Boiler – Consumption (From C/O Start))
      DailyRept_FuelChangeover_BLRCons_TotalFuelCons: [null],
      DailyRept_FuelChangeover_BLRCons_FuelInUse: [null],

      // at FuelChangeover (additional comments)
      DailyRept_FuelChangeover_Gen_Comments: [null],

      // At Port (Aux. Engine - Consumption)
      DailyRept_AtPort_AECons_AE1RHRS: [null],
      DailyRept_AtPort_AECons_LOCons1: [null],
      DailyRept_AtPort_AECons_AE2RHRS: [null],
      DailyRept_AtPort_AECons_LOCons2: [null],
      DailyRept_AtPort_AECons_AE3RHRS: [null],
      DailyRept_AtPort_AECons_LOCons3: [null],
      DailyRept_AtPort_AECons_AE4RHRS: [null],
      DailyRept_AtPort_AECons_LOCons4: [null],
      DailyRept_AtPort_AECons_TotalAELoad: [null],
      DailyRept_AtPort_AECons_ReeferCons: [null],
      DailyRept_AtPort_AECons_TotalAEFuelCons: [null],
      DailyRept_AtPort_AECons_FuelInUse: [null],
      DailyRept_AtPort_AECons_AddComments: [null],

      // At Port (Boiler - Consumption)
      DailyRept_AtPort_BLRCons_TotalFuelCons: [null],
      DailyRept_AtPort_BLRCons_FuelInUse: [null],

      // at Port (additional comments)
      DailyRept_AtPort_Gen_Comments: [null],

      // At Port (Miscellaneous – R.O.B)
      DailyRept_AtPort_MiscROB_TotalSludgeROB: [null],
      DailyRept_AtPort_MiscROB_SludgeLanded: [null],
      DailyRept_AtPort_MiscROB_ERBilgeROB: [null],
      DailyRept_AtPort_MiscROB_ERBilgeDischarge: [null],
      DailyRept_AtPort_MiscROB_MESYSOil: [null],
      DailyRept_AtPort_MiscROB_FreshWaterROB: [null],
      DailyRept_AtPort_MiscROB_MECylOil1: [null],
      DailyRept_AtPort_MiscROB_MECylOil2: [null],
      DailyRept_AtPort_MiscROB_AECylOil1: [null],
      DailyRept_AtPort_MiscROB_AECylOil2: [null],

      // At Anchorage (Aux. Engine - Consumption)
      DailyRept_AtAnchorage_AECons_AE1RHRS: [null],
      DailyRept_AtAnchorage_AECons_LOCons1: [null],
      DailyRept_AtAnchorage_AECons_AE2RHRS: [null],
      DailyRept_AtAnchorage_AECons_LOCons2: [null],
      DailyRept_AtAnchorage_AECons_AE3RHRS: [null],
      DailyRept_AtAnchorage_AECons_LOCons3: [null],
      DailyRept_AtAnchorage_AECons_AE4RHRS: [null],
      DailyRept_AtAnchorage_AECons_LOCons4: [null],
      DailyRept_AtAnchorage_AECons_TotalAELoad: [null],
      DailyRept_AtAnchorage_AECons_ReeferCons: [null],
      DailyRept_AtAnchorage_AECons_TotalAEFuelCons: [null],
      DailyRept_AtAnchorage_AECons_FuelInUse: [null],
      DailyRept_AtAchorage_AECons_AddComments: [null],

      // At Anchorage (Boiler - Consumption)
      DailyRept_AtAnchorage_BLRCons_TotalFuelCons: [null],
      DailyRept_AtAnchorage_BLRCons_FuelInUse: [null],

      // At Anchorage (Miscellaneous – R.O.B)
      DailyRept_AtAnchorage_MiscROB_TotalSludgeROB: [null],
      DailyRept_AtAnchorage_MiscROB_SludgeLanded: [null],
      DailyRept_AtAnchorage_MiscROB_ERBilgeROB: [null],
      DailyRept_AtAnchorage_MiscROB_ERBilgeDischarge: [null],
      DailyRept_AtAnchorage_MiscROB_MESYSOil: [null],
      DailyRept_AtAnchorage_MiscROB_FreshWaterROB: [null],
      DailyRept_AtAnchorage_MiscROB_MECylOil1: [null],
      DailyRept_AtAnchorage_MiscROB_MECylOil2: [null],
      DailyRept_AtAnchorage_MiscROB_AECylOil1: [null],
      DailyRept_AtAnchorage_MiscROB_AECylOil2: [null],

      // at Anchorage (additional comments)
      DailyRept_AtAnchorage_Gen_Comments: [null],

      // At Drifting (Aux. Engine - Consumption)
      DailyRept_AtDrifting_AECons_AE1RHRS: [null],
      DailyRept_AtDrifting_AECons_LOCons1: [null],
      DailyRept_AtDrifting_AECons_AE2RHRS: [null],
      DailyRept_AtDrifting_AECons_LOCons2: [null],
      DailyRept_AtDrifting_AECons_AE3RHRS: [null],
      DailyRept_AtDrifting_AECons_LOCons3: [null],
      DailyRept_AtDrifting_AECons_AE4RHRS: [null],
      DailyRept_AtDrifting_AECons_LOCons4: [null],
      DailyRept_AtDrifting_AECons_TotalAELoad: [null],
      DailyRept_AtDrifting_AECons_ReeferCons: [null],
      DailyRept_AtDrifting_AECons_TotalAEFuelCons: [null],
      DailyRept_AtDrifting_AECons_FuelInUse: [null],
      DailyRept_AtDrifting_AECons_AddComments: [null],

      // At Drifting (Boiler - Consumption)
      DailyRept_AtDrifting_BLRCons_TotalFuelCons: [null],
      DailyRept_AtDrifting_BLRCons_FuelInUse: [null],

      // At Drifting (Miscellaneous – R.O.B)
      DailyRept_AtDrifting_MiscROB_TotalSludgeROB: [null],
      DailyRept_AtDrifting_MiscROB_SludgeLanded: [null],
      DailyRept_AtDrifting_MiscROB_ERBilgeROB: [null],
      DailyRept_AtDrifting_MiscROB_ERBilgeDischarge: [null],
      DailyRept_AtDrifting_MiscROB_MESYSOil: [null],
      DailyRept_AtDrifting_MiscROB_FreshWaterROB: [null],
      DailyRept_AtDrifting_MiscROB_MECylOil1: [null],
      DailyRept_AtDrifting_MiscROB_MECylOil2: [null],
      DailyRept_AtDrifting_MiscROB_AECylOil1: [null],
      DailyRept_AtDrifting_MiscROB_AECylOil2: [null],

      // at Drifting (additional comments)
      DailyRept_AtDrifting_Gen_Comments: [null],

      // Manoeuvring [Arrival] (Voyage Details)
      DailyRept_ManoeuvringArrival_VoyDetails_VoyNo: [null],
      DailyRept_ManoeuvringArrival_VoyDetails_DistOverSea: [null],
      DailyRept_ManoeuvringArrival_VoyDetails_DistOverGrnd: [null],
      DailyRept_ManoeuvringArrival_VoyDetails_AvgSpeed: [null],

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

      // Manoeuvring [Arrival] (Aux. Engine - Consumption (After C/O))
      DailyRept_ManoeuvringArrival_AECons_AE1RHRS: [null],
      DailyRept_ManoeuvringArrival_AECons_LOCons1: [null],
      DailyRept_ManoeuvringArrival_AECons_AE2RHRS: [null],
      DailyRept_ManoeuvringArrival_AECons_LOCons2: [null],
      DailyRept_ManoeuvringArrival_AECons_AE3RHRS: [null],
      DailyRept_ManoeuvringArrival_AECons_LOCons3: [null],
      DailyRept_ManoeuvringArrival_AECons_AE4RHRS: [null],
      DailyRept_ManoeuvringArrival_AECons_LOCons4: [null],
      DailyRept_ManoeuvringArrival_AECons_TotalAELoad: [null],
      DailyRept_ManoeuvringArrival_AECons_ReeferCons: [null],
      DailyRept_ManoeuvringArrival_AECons_TotalAEFuelCons: [null],
      DailyRept_ManoeuvringArrival_AECons_FuelInUse: [null],
      DailyRept_ManoeuvringArrival_AECons_AddComments: [null],

      // Manoeuvring [Arrival] (Boiler – Consumption (After C/O))
      DailyRept_ManoeuvringArrival_BLRCons_TotalFuelCons: [null],
      DailyRept_ManoeuvringArrival_BLRCons_FuelInUse: [null],

      // at Manoeuvring Arrival (additional comments)
      DailyRept_ManoeuvringArrival_Gen_Comments: [null],

      // Manoeuvring [Departure] (Voyage Details)
      DailyRept_ManoeuvringDeparture_VoyDetails_VoyNo: [null],
      DailyRept_ManoeuvringDeparture_VoyDetails_DistOverSea: [null],
      DailyRept_ManoeuvringDeparture_VoyDetails_DistOverGrnd: [null],
      DailyRept_ManoeuvringDeparture_VoyDetails_AvgSpeed: [null],

      // Manoeuvring [Departure] (Weather Info.)
      DailyRept_ManoeuvringDeparture_WeatherInfo_SeaWaterTemp: [null],
      DailyRept_ManoeuvringDeparture_WeatherInfo_ERTemp: [null],
      DailyRept_ManoeuvringDeparture_WeatherInfo_OutsideTemp: [null],
      DailyRept_ManoeuvringDeparture_WeatherInfo_OutsideHumidity: [null],

      // Manoeuvring [Departure] (Main Engine Info)
      DailyRept_ManoeuvringDeparture_MEInfo_MEAvgLoad: [null],
      DailyRept_ManoeuvringDeparture_MEInfo_MEAvgRPM: [null],
      DailyRept_ManoeuvringDeparture_MEInfo_MEAvgLoadPercent: [null],
      DailyRept_ManoeuvringDeparture_MEInfo_MERhrs: [null],

      // Manoeuvring [Departure] (Main Engine – Consumption)
      DailyRept_ManoeuvringDeparture_MECons_FuelCons: [null],
      DailyRept_ManoeuvringDeparture_MECons_Fuelinuse: [null],
      DailyRept_ManoeuvringDeparture_MECons_CylOilCons: [null],
      DailyRept_ManoeuvringDeparture_MECons_CylLOBN: [null],
      DailyRept_ManoeuvringDeparture_MECons_SysOilConsLtrs: [null],

      // Manoeuvring [Departure] (Aux. Engine - Consumption (After C/O))
      DailyRept_ManoeuvringDeparture_AECons_AE1RHRS: [null],
      DailyRept_ManoeuvringDeparture_AECons_LOCons1: [null],
      DailyRept_ManoeuvringDeparture_AECons_AE2RHRS: [null],
      DailyRept_ManoeuvringDeparture_AECons_LOCons2: [null],
      DailyRept_ManoeuvringDeparture_AECons_AE3RHRS: [null],
      DailyRept_ManoeuvringDeparture_AECons_LOCons3: [null],
      DailyRept_ManoeuvringDeparture_AECons_AE4RHRS: [null],
      DailyRept_ManoeuvringDeparture_AECons_LOCons4: [null],
      DailyRept_ManoeuvringDeparture_AECons_TotalAELoad: [null],
      DailyRept_ManoeuvringDeparture_AECons_ReeferCons: [null],
      DailyRept_ManoeuvringDeparture_AECons_TotalAEFuelCons: [null],
      DailyRept_ManoeuvringDeparture_AECons_FuelInUse: [null],
      DailyRept_ManoeuvringDeparture_AECons_AddComments: [null],

      // Manoeuvring [Departure] (Boiler – Consumption (After C/O))
      DailyRept_ManoeuvringDeparture_BLRCons_TotalFuelCons: [null],
      DailyRept_ManoeuvringDeparture_BLRCons_FuelInUse: [null],

      // at Manoeuvring Departure (additional comments)
      DailyRept_ManoeuvringDeparture_Gen_Comments: [null],

      Fuel_Grade: [null],
      Fuel_Grade1: [null],
    });
  }

  ngOnInit(): void {
    this.addUpdateDailyReportReportForm.patchValue({
      DailyRept_IMO_No: this.localUser.IMO_No,
    });
    this.getBunkerStcokDetails();
    //this.validation();
    // api/daily-reports/generate/uniqueid
    if (this.idForUpdate) {
      console.log('in edit mode');
      this.getDailyReportById();
      //this.addUpdateDailyReportReportForm.valueChanges.subscribe((val) => {
      // console.log('val', val);
      // this.snycVal = val;
      // this.addOrUpdateRealTimeDailyReport(
      //   'put',
      //   `daily-reports/${this.idForUpdate}`,
      //   'Daily Report Successfully Updated'
      // );
      //});
    }
    //if (!this.idForUpdate) {
    // this.httpRequestService
    //   .request('get', `daily-reports/generate/uniqueid`)
    //   .subscribe(
    //     (result) => {
    //       this.uniqueId = result.data.uniqueId;
    //       this.addUpdateDailyReportReportForm.patchValue(result.data);
    //       console.log('result', this.addUpdateDailyReportReportForm.value);
    //     },
    //     (error) => {}
    //   );
    //this.onChanges();
    //}
  }

  /* get bunker stock details */
  getBunkerStcokDetails(): void {
    this.httpRequestService.request('get', 'bunker-reports').subscribe(
      (result) => {
        console.log(result);

        this.allBunkerStockReports = result.data;
      },
      (err) => {}
    );
  }

  // on form value chages
  onChanges(): void {
    this.addUpdateDailyReportReportForm.valueChanges.subscribe((val) => {
      console.log('val', val);
      this.snycVal = val;

      this.addOrUpdateRealTimeDailyReport(
        'put',
        `daily-reports/update/real-time-sync/${this.uniqueId}`,
        'Daily Report Successfully Added'
      );
    });
  }
  // /* get by id */
  getDailyReportById(): void {
    this.httpRequestService
      .request('get', `daily-reports/${this.idForUpdate}`)
      .subscribe(
        (result) => {
          this.addUpdateDailyReportReportForm.patchValue(result.data);

          this.uniqueId = result.data.DailyReportUniqueId;
          this.isCheckedButton = result.data.isCheckedButton;
          this.isFuelCheckedButton = result.data.isFuelCheckedButton;
          this.isPortCheckedButton = result.data.isPortCheckedButton;
          this.isAncCheckedButton = result.data.isAncCheckedButton;
          this.isDriftingCheckedButton = result.data.isDriftingCheckedButton;
          this.isManArrCheckedButton = result.data.isManArrCheckedButton;
          this.isManDepCheckedButton = result.data.isManDepCheckedButton;
          console.log('res val', result.data);
          console.log('edit val', this.uniqueId);

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
          if (result.data.DailyRept_AtPort_AECons_FuelInUse) {
            this.addUpdateDailyReportReportForm.patchValue({
              DailyRept_AtPort_AECons_FuelInUse:
                result.data.DailyRept_AtPort_AECons_FuelInUse._id,
            });
          }
          if (result.data.DailyRept_AtPort_BLRCons_FuelInUse) {
            this.addUpdateDailyReportReportForm.patchValue({
              DailyRept_AtPort_BLRCons_FuelInUse:
                result.data.DailyRept_AtPort_BLRCons_FuelInUse._id,
            });
          }
          if (result.data.DailyRept_AtAnchorage_AECons_FuelInUse) {
            this.addUpdateDailyReportReportForm.patchValue({
              DailyRept_AtAnchorage_AECons_FuelInUse:
                result.data.DailyRept_AtAnchorage_AECons_FuelInUse._id,
            });
          }
          if (result.data.DailyRept_AtAnchorage_BLRCons_FuelInUse) {
            this.addUpdateDailyReportReportForm.patchValue({
              DailyRept_AtAnchorage_BLRCons_FuelInUse:
                result.data.DailyRept_AtAnchorage_BLRCons_FuelInUse._id,
            });
          }
          if (result.data.DailyRept_AtDrifting_AECons_FuelInUse) {
            this.addUpdateDailyReportReportForm.patchValue({
              DailyRept_AtDrifting_AECons_FuelInUse:
                result.data.DailyRept_AtDrifting_AECons_FuelInUse._id,
            });
          }
          if (result.data.DailyRept_AtDrifting_BLRCons_FuelInUse) {
            this.addUpdateDailyReportReportForm.patchValue({
              DailyRept_AtDrifting_BLRCons_FuelInUse:
                result.data.DailyRept_AtDrifting_BLRCons_FuelInUse._id,
            });
          }
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
          if (result.data.DailyRept_ManoeuvringDeparture_MECons_Fuelinuse) {
            this.addUpdateDailyReportReportForm.patchValue({
              DailyRept_ManoeuvringDeparture_MECons_Fuelinuse:
                result.data.DailyRept_ManoeuvringDeparture_MECons_Fuelinuse._id,
            });
          }
          if (result.data.DailyRept_ManoeuvringDeparture_AECons_FuelInUse) {
            this.addUpdateDailyReportReportForm.patchValue({
              DailyRept_ManoeuvringDeparture_AECons_FuelInUse:
                result.data.DailyRept_ManoeuvringDeparture_AECons_FuelInUse._id,
            });
          }
          if (result.data.DailyRept_ManoeuvringDeparture_BLRCons_FuelInUse) {
            this.addUpdateDailyReportReportForm.patchValue({
              DailyRept_ManoeuvringDeparture_BLRCons_FuelInUse:
                result.data.DailyRept_ManoeuvringDeparture_BLRCons_FuelInUse
                  ._id,
            });
          }
        },
        (error) => {}
      );
    //this.onChanges();
  }

  /* Submit  form */
  submit(): void {
    if (
      !this.addUpdateDailyReportReportForm.value
        .DailyRept_AtSea_WeatherInfo_OutsideTemp
    ) {
      this.notificationService.error('', 'Outside temp. field are required.');
      return;
    }

    if (
      this.addUpdateDailyReportReportForm.value
        .DailyRept_AtSea_WeatherInfo_OutsideTemp &&
      this.addUpdateDailyReportReportForm.value
        .DailyRept_AtSea_WeatherInfo_OutsideTemp > 100
    ) {
      this.notificationService.error(
        '',
        'Outside temp. value not more than 100.'
      );
      return;
    }
    if (
      this.addUpdateDailyReportReportForm.value
        .DailyRept_AtSea_WeatherInfo_OutsideTemp &&
      this.addUpdateDailyReportReportForm.value
        .DailyRept_AtSea_WeatherInfo_OutsideTemp < 0
    ) {
      this.notificationService.error(
        '',
        'Outside temp. value not less than 0.'
      );
      return;
    }
    if (!this.addUpdateDailyReportReportForm.valid) {
      this.markFormGroupTouched(this.addUpdateDailyReportReportForm);
    } else {
      if (this.idForUpdate) {
        this.addOrUpdateDailyReport(
          'put',
          `daily-reports/${this.idForUpdate}`,
          'Daily Report Successfully Updated'
        );
        //this.checkEditFields();
      } else {
        //console.log(this.addUpdateDailyReportReportForm.value);
        //this.checkFields();
        this.addOrUpdateDailyReport(
          'post',
          `daily-reports`,
          'Daily Report Successfully Added'
        );
      }
    }
  }

  /* Add Or Edit Daily Report */
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
  /* Add Or Edit Daily Report real time*/
  addOrUpdateRealTimeDailyReport(
    requestMethod: string,
    requestURL: string,
    successMessage: string
  ): void {
    //this.buttonLoading = true;
    this.httpRequestService
      .request(requestMethod, requestURL, this.snycVal)
      .subscribe(
        (result: any) => {
          //this.buttonLoading = false;
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
  // at sea
  isCheckChange(event: any): void {
    this.isCheckedButton = !this.isCheckedButton;
  }
  // fuel
  isFuelCheckChange(event: any): void {
    this.isFuelCheckedButton = !this.isFuelCheckedButton;
  }
  // port
  isPortCheckChange(event: any): void {
    this.isPortCheckedButton = !this.isPortCheckedButton;
  }
  // Anchorage
  isAncCheckChange(event: any): void {
    this.isAncCheckedButton = !this.isAncCheckedButton;
  }
  // at driftting
  isDriftingCheckChange(event: any): void {
    this.isDriftingCheckedButton = !this.isDriftingCheckedButton;
  }

  // Manoeuvring [Arrival]
  isManArrCheckChange(event: any): void {
    this.isManArrCheckedButton = !this.isManArrCheckedButton;
  }
  // Manoeuvring [Departure]
  isManDepCheckChange(event: any): void {
    this.isManDepCheckedButton = !this.isManDepCheckedButton;
  }

  // warning message show

  popUpMessage(): void {
    this.borderColor = 'true';
    this.confirmModal = this.nzModalService.confirm({
      nzTitle: 'Missing required field values',
      nzContent:
        'Please check atleast one section and fill data.\n Blank form can not be submitted.',

      nzOnOk: () =>
        new Promise((resolve, reject) => {
          setTimeout(Math.random() > 0.5 ? resolve : reject, 1000);
          this.notificationService.success('', 'Sucessfully done.');
          this.router.navigateByUrl('/main/machinery-report/daily-report');
          this.buttonLoading = false;
        }).catch(() => console.log('Oops errors!')),
    });
  }
  // blank popup
  blankPopUp(): void {
    this.confirmModal = this.nzModalService.confirm({
      nzTitle: 'Alert',
      nzContent:
        'Please check atleast one section and fill data.Blank form can not be submitted. ',
      nzOnOk: () =>
        new Promise((resolve, reject) => {
          setTimeout(Math.random() > 0.5 ? resolve : reject, 1000);
        }).catch(() => console.log('Oops errors!')),
    });
  }

  // valid submit
  validApiCall(): void {
    this.borderColor = 'false';
    this.router.navigateByUrl('/main/machinery-report/daily-report');
    this.buttonLoading = false;

    this.addUpdateDailyReportReportForm.value.isValid = true;
    this.httpRequestService
      .request(
        'put',
        `daily-reports/update/real-time-sync/${this.uniqueId}`,
        this.addUpdateDailyReportReportForm.value
      )
      .subscribe(
        (result) => {
          this.router.navigateByUrl('/main/machinery-report/daily-report');
        },
        (error) => {}
      );
  }
  // add form check field
  checkFields(): void {
    // at sea

    if (this.addUpdateDailyReportReportForm.value.isCheckedButton == true) {
      if (
        this.addUpdateDailyReportReportForm.value
          .DailyRept_AtSea_VoyDetails_VoyNo &&
        this.addUpdateDailyReportReportForm.value
          .DailyRept_AtSea_VoyDetails_TimeZone &&
        this.addUpdateDailyReportReportForm.value
          .DailyRept_AtSea_VoyDetails_DistOverGrnd &&
        this.addUpdateDailyReportReportForm.value
          .DailyRept_AtSea_VoyDetails_TimeShft &&
        this.addUpdateDailyReportReportForm.value
          .DailyRept_AtSea_VoyDetails_DistOverSea &&
        this.addUpdateDailyReportReportForm.value
          .DailyRept_AtSea_VoyDetails_LoadingCond &&
        this.addUpdateDailyReportReportForm.value
          .DailyRept_AtSea_VoyDetails_AvgSpeed &&
        this.addUpdateDailyReportReportForm.value
          .DailyRept_AtSea_VoyDetails_WindForce &&
        this.addUpdateDailyReportReportForm.value
          .DailyRept_AtSea_VoyDetails_WindDirection &&
        this.addUpdateDailyReportReportForm.value
          .DailyRept_AtSea_WeatherInfo_ERTemp &&
        this.addUpdateDailyReportReportForm.value
          .DailyRept_AtSea_WeatherInfo_OutsideTemp &&
        this.addUpdateDailyReportReportForm.value
          .DailyRept_AtSea_MEInfo_MEAvgLoad &&
        this.addUpdateDailyReportReportForm.value
          .DailyRept_AtSea_MEInfo_MEAvgRPM &&
        this.addUpdateDailyReportReportForm.value
          .DailyRept_AtSea_MEInfo_MEAvgLoadPercent &&
        this.addUpdateDailyReportReportForm.value
          .DailyRept_AtSea_MEInfo_MERhrs &&
        this.addUpdateDailyReportReportForm.value
          .DailyRept_AtSea_METurboChgrAirCoolers_ScavengetRecvPressure &&
        this.addUpdateDailyReportReportForm.value
          .DailyRept_AtSea_METurboChgrAirCoolers_TC1ExhaustAirINTemp &&
        this.addUpdateDailyReportReportForm.value
          .DailyRept_AtSea_METurboChgrAirCoolers_TC2ExhaustAirINTemp &&
        this.addUpdateDailyReportReportForm.value
          .DailyRept_AtSea_METurboChgrAirCoolers_TC3ExhaustAirINTemp &&
        this.addUpdateDailyReportReportForm.value
          .DailyRept_AtSea_METurboChgrAirCoolers_TC1ExhaustAirOutTemp &&
        this.addUpdateDailyReportReportForm.value
          .DailyRept_AtSea_METurboChgrAirCoolers_TC2ExhaustAirOutTemp &&
        this.addUpdateDailyReportReportForm.value
          .DailyRept_AtSea_METurboChgrAirCoolers_TC3ExhaustAirOutTemp &&
        this.addUpdateDailyReportReportForm.value
          .DailyRept_AtSea_MEAirFOLO_ScavengetRecvTemp &&
        this.addUpdateDailyReportReportForm.value
          .DailyRept_AtSea_MEAirFOLO_MainLOTemp &&
        this.addUpdateDailyReportReportForm.value
          .DailyRept_AtSea_MEAirFOLO_MainLOPressure &&
        this.addUpdateDailyReportReportForm.value
          .DailyRept_AtSea_MEAirFOLO_ServoOilPressure &&
        this.addUpdateDailyReportReportForm.value
          .DailyRept_AtSea_MEAirFOLO_FuelOilTemp &&
        this.addUpdateDailyReportReportForm.value
          .DailyRept_AtSea_MEAirFOLO_FuelOilPressure &&
        this.addUpdateDailyReportReportForm.value
          .DailyRept_AtSea_MEAirFOLO_FuelOilRailPressure &&
        this.addUpdateDailyReportReportForm.value
          .DailyRept_AtSea_MEUnit1_ExhaustTemp &&
        this.addUpdateDailyReportReportForm.value
          .DailyRept_AtSea_MEUnit1_CoolingWaterOutTemp &&
        this.addUpdateDailyReportReportForm.value
          .DailyRept_AtSea_MEUnit1_PistonOutTemp &&
        this.addUpdateDailyReportReportForm.value
          .DailyRept_AtSea_MEUnit2_ExhaustTemp &&
        this.addUpdateDailyReportReportForm.value
          .DailyRept_AtSea_MEUnit2_CoolingWaterOutTemp &&
        this.addUpdateDailyReportReportForm.value
          .DailyRept_AtSea_MEUnit2_PistonOutTemp &&
        this.addUpdateDailyReportReportForm.value
          .DailyRept_AtSea_MEUnit3_ExhaustTemp &&
        this.addUpdateDailyReportReportForm.value
          .DailyRept_AtSea_MEUnit3_CoolingWaterOutTemp &&
        this.addUpdateDailyReportReportForm.value
          .DailyRept_AtSea_MEUnit3_PistonOutTemp &&
        this.addUpdateDailyReportReportForm.value
          .DailyRept_AtSea_MEUnit4_ExhaustTemp &&
        this.addUpdateDailyReportReportForm.value
          .DailyRept_AtSea_MEUnit4_CoolingWaterOutTemp &&
        this.addUpdateDailyReportReportForm.value
          .DailyRept_AtSea_MEUnit4_PistonOutTemp &&
        this.addUpdateDailyReportReportForm.value
          .DailyRept_AtSea_MEUnit5_ExhaustTemp &&
        this.addUpdateDailyReportReportForm.value
          .DailyRept_AtSea_MEUnit5_CoolingWaterOutTemp &&
        this.addUpdateDailyReportReportForm.value
          .DailyRept_AtSea_MEUnit5_PistonOutTemp &&
        this.addUpdateDailyReportReportForm.value
          .DailyRept_AtSea_MEUnit6_ExhaustTemp &&
        this.addUpdateDailyReportReportForm.value
          .DailyRept_AtSea_MEUnit6_CoolingWaterOutTemp &&
        this.addUpdateDailyReportReportForm.value
          .DailyRept_AtSea_MEUnit6_PistonOutTemp &&
        this.addUpdateDailyReportReportForm.value
          .DailyRept_AtSea_MEUnit7_ExhaustTemp &&
        this.addUpdateDailyReportReportForm.value
          .DailyRept_AtSea_MEUnit7_CoolingWaterOutTemp &&
        this.addUpdateDailyReportReportForm.value
          .DailyRept_AtSea_MEUnit7_PistonOutTemp &&
        this.addUpdateDailyReportReportForm.value
          .DailyRept_AtSea_MEUnit8_ExhaustTemp &&
        this.addUpdateDailyReportReportForm.value
          .DailyRept_AtSea_MEUnit8_CoolingWaterOutTemp &&
        this.addUpdateDailyReportReportForm.value
          .DailyRept_AtSea_MEUnit8_PistonOutTemp &&
        this.addUpdateDailyReportReportForm.value
          .DailyRept_AtSea_MEUnit9_ExhaustTemp &&
        this.addUpdateDailyReportReportForm.value
          .DailyRept_AtSea_MEUnit9_CoolingWaterOutTemp &&
        this.addUpdateDailyReportReportForm.value
          .DailyRept_AtSea_MEUnit9_PistonOutTemp &&
        this.addUpdateDailyReportReportForm.value
          .DailyRept_AtSea_MECons_FuelCons &&
        this.addUpdateDailyReportReportForm.value
          .DailyRept_AtSea_MECons_CylOilCons &&
        this.addUpdateDailyReportReportForm.value
          .DailyRept_AtSea_MECons_Fuelinuse &&
        this.addUpdateDailyReportReportForm.value
          .DailyRept_AtSea_AECons_TotalAELoad &&
        this.addUpdateDailyReportReportForm.value
          .DailyRept_AtSea_AECons_TotalAEFuelCons &&
        this.addUpdateDailyReportReportForm.value
          .DailyRept_AtSea_AECons_FuelInUse &&
        this.addUpdateDailyReportReportForm.value
          .DailyRept_AtSea_BLRCons_TotalFuelCons &&
        this.addUpdateDailyReportReportForm.value
          .DailyRept_AtSea_BLRCons_FuelInUse
      ) {
        this.seaSatisfied = true;
        console.log('in at sea field satisfied', this.seaSatisfied);
      } else {
        this.seaSatisfied = false;
        console.log('in at sea field not satisfied', this.seaSatisfied);
        //this.popUpMessage();
      }
    } else {
      this.seaSatisfied = true;
      console.log('out at sea', this.seaSatisfied);
    }
    // fuel change over
    if (this.addUpdateDailyReportReportForm.value.isFuelCheckedButton == true) {
      if (
        this.addUpdateDailyReportReportForm.value
          .DailyRept_FuelChangeover_MECons_FuelCons &&
        this.addUpdateDailyReportReportForm.value
          .DailyRept_FuelChangeover_MECons_Fuelinuse &&
        this.addUpdateDailyReportReportForm.value
          .DailyRept_FuelChangeover_MECons_CylOilCons &&
        this.addUpdateDailyReportReportForm.value
          .DailyRept_FuelChangeover_AECons_TotalAELoad &&
        this.addUpdateDailyReportReportForm.value
          .DailyRept_FuelChangeover_AECons_TotalAEFuelCons &&
        this.addUpdateDailyReportReportForm.value
          .DailyRept_FuelChangeover_AECons_FuelInUse &&
        this.addUpdateDailyReportReportForm.value
          .DailyRept_FuelChangeover_BLRCons_TotalFuelCons &&
        this.addUpdateDailyReportReportForm.value
          .DailyRept_FuelChangeover_BLRCons_FuelInUse
      ) {
        this.fuelSatisfied = true;
        console.log('in at fuel field satisfied', this.fuelSatisfied);
      } else {
        this.fuelSatisfied = false;
        console.log('in at fuel field not satisfied', this.fuelSatisfied);
        //this.popUpMessage();
      }
    } else {
      this.fuelSatisfied = true;
      console.log('ou fuel', this.fuelSatisfied);
    }

    //at port
    if (this.addUpdateDailyReportReportForm.value.isPortCheckedButton == true) {
      if (
        this.addUpdateDailyReportReportForm.value
          .DailyRept_AtPort_AECons_TotalAELoad &&
        this.addUpdateDailyReportReportForm.value
          .DailyRept_AtPort_AECons_TotalAEFuelCons &&
        this.addUpdateDailyReportReportForm.value
          .DailyRept_AtPort_AECons_FuelInUse &&
        this.addUpdateDailyReportReportForm.value
          .DailyRept_AtPort_BLRCons_TotalFuelCons &&
        this.addUpdateDailyReportReportForm.value
          .DailyRept_AtPort_BLRCons_FuelInUse
      ) {
        this.portSatisfied = true;
        console.log('in at port field satisfied', this.portSatisfied);
      } else {
        this.portSatisfied = false;
        console.log('in at port field not satisfied', this.portSatisfied);
        // this.popUpMessage();
      }
    } else {
      this.portSatisfied = true;
      console.log('out at port', this.portSatisfied);
    }

    //at anchorage
    if (this.addUpdateDailyReportReportForm.value.isAncCheckedButton == true) {
      if (
        this.addUpdateDailyReportReportForm.value
          .DailyRept_AtAnchorage_AECons_TotalAELoad &&
        this.addUpdateDailyReportReportForm.value
          .DailyRept_AtAnchorage_AECons_TotalAEFuelCons &&
        this.addUpdateDailyReportReportForm.value
          .DailyRept_AtAnchorage_AECons_FuelInUse &&
        this.addUpdateDailyReportReportForm.value
          .DailyRept_AtAnchorage_BLRCons_TotalFuelCons &&
        this.addUpdateDailyReportReportForm.value
          .DailyRept_AtAnchorage_BLRCons_FuelInUse
      ) {
        this.ancSatisfied = true;
        console.log('in at anc field satisfied', this.ancSatisfied);
      } else {
        this.ancSatisfied = false;
        console.log('in at anc field not satisfied', this.ancSatisfied);
        //this.popUpMessage();
      }
    } else {
      this.ancSatisfied = true;
      console.log('out at anc', this.ancSatisfied);
    }
    // at driffting
    if (
      this.addUpdateDailyReportReportForm.value.isDriftingCheckedButton == true
    ) {
      if (
        this.addUpdateDailyReportReportForm.value
          .DailyRept_AtDrifting_AECons_TotalAELoad &&
        this.addUpdateDailyReportReportForm.value
          .DailyRept_AtDrifting_AECons_TotalAEFuelCons &&
        this.addUpdateDailyReportReportForm.value
          .DailyRept_AtDrifting_AECons_FuelInUse &&
        this.addUpdateDailyReportReportForm.value
          .DailyRept_AtDrifting_BLRCons_TotalFuelCons &&
        this.addUpdateDailyReportReportForm.value
          .DailyRept_AtDrifting_BLRCons_FuelInUse
      ) {
        this.driffSatisfied = true;
        console.log('in at driff field satisfied', this.driffSatisfied);
      } else {
        this.driffSatisfied = false;
        console.log('in at driff field not satisfied', this.driffSatisfied);
        //this.popUpMessage();
      }
    } else {
      this.driffSatisfied = true;
      console.log('out at anc', this.driffSatisfied);
    }

    //at man arr
    if (
      this.addUpdateDailyReportReportForm.value.isManArrCheckedButton == true
    ) {
      if (
        this.addUpdateDailyReportReportForm.value
          .DailyRept_ManoeuvringArrival_VoyDetails_VoyNo &&
        this.addUpdateDailyReportReportForm.value
          .DailyRept_ManoeuvringArrival_VoyDetails_DistOverGrnd &&
        this.addUpdateDailyReportReportForm.value
          .DailyRept_ManoeuvringArrival_VoyDetails_DistOverSea &&
        this.addUpdateDailyReportReportForm.value
          .DailyRept_ManoeuvringArrival_VoyDetails_AvgSpeed &&
        this.addUpdateDailyReportReportForm.value
          .DailyRept_ManoeuvringArrival_WeatherInfo_ERTemp &&
        this.addUpdateDailyReportReportForm.value
          .DailyRept_ManoeuvringArrival_WeatherInfo_OutsideTemp &&
        this.addUpdateDailyReportReportForm.value
          .DailyRept_ManoeuvringArrival_MEInfo_MEAvgLoad &&
        this.addUpdateDailyReportReportForm.value
          .DailyRept_ManoeuvringArrival_MEInfo_MEAvgRPM &&
        this.addUpdateDailyReportReportForm.value
          .DailyRept_ManoeuvringArrival_MEInfo_MEAvgLoadPercent &&
        this.addUpdateDailyReportReportForm.value
          .DailyRept_ManoeuvringArrival_MEInfo_MERhrs &&
        this.addUpdateDailyReportReportForm.value
          .DailyRept_ManoeuvringArrival_MECons_FuelCons &&
        this.addUpdateDailyReportReportForm.value
          .DailyRept_ManoeuvringArrival_MECons_CylOilCons &&
        this.addUpdateDailyReportReportForm.value
          .DailyRept_ManoeuvringArrival_MECons_Fuelinuse &&
        this.addUpdateDailyReportReportForm.value
          .DailyRept_ManoeuvringArrival_AECons_TotalAELoad &&
        this.addUpdateDailyReportReportForm.value
          .DailyRept_ManoeuvringArrival_AECons_TotalAEFuelCons &&
        this.addUpdateDailyReportReportForm.value
          .DailyRept_ManoeuvringArrival_AECons_FuelInUse &&
        this.addUpdateDailyReportReportForm.value
          .DailyRept_ManoeuvringArrival_BLRCons_TotalFuelCons &&
        this.addUpdateDailyReportReportForm.value
          .DailyRept_ManoeuvringArrival_BLRCons_FuelInUse
      ) {
        this.manArrSatisfied = true;
        console.log('in at man arr field satisfied', this.manArrSatisfied);
      } else {
        this.manArrSatisfied = false;
        console.log('in at man arr field not satisfied', this.manArrSatisfied);
        //this.popUpMessage();
      }
    } else {
      this.manArrSatisfied = true;
      console.log('out at man arr', this.manArrSatisfied);
    }

    //at man dep
    if (
      this.addUpdateDailyReportReportForm.value.isManDepCheckedButton == true
    ) {
      if (
        this.addUpdateDailyReportReportForm.value
          .DailyRept_ManoeuvringDeparture_VoyDetails_VoyNo &&
        this.addUpdateDailyReportReportForm.value
          .DailyRept_ManoeuvringDeparture_VoyDetails_DistOverGrnd &&
        this.addUpdateDailyReportReportForm.value
          .DailyRept_ManoeuvringDeparture_VoyDetails_DistOverSea &&
        this.addUpdateDailyReportReportForm.value
          .DailyRept_ManoeuvringDeparture_VoyDetails_AvgSpeed &&
        this.addUpdateDailyReportReportForm.value
          .DailyRept_ManoeuvringDeparture_WeatherInfo_ERTemp &&
        this.addUpdateDailyReportReportForm.value
          .DailyRept_ManoeuvringDeparture_WeatherInfo_OutsideTemp &&
        this.addUpdateDailyReportReportForm.value
          .DailyRept_ManoeuvringDeparture_MEInfo_MEAvgLoad &&
        this.addUpdateDailyReportReportForm.value
          .DailyRept_ManoeuvringDeparture_MEInfo_MEAvgRPM &&
        this.addUpdateDailyReportReportForm.value
          .DailyRept_ManoeuvringDeparture_MEInfo_MEAvgLoadPercent &&
        this.addUpdateDailyReportReportForm.value
          .DailyRept_ManoeuvringDeparture_MEInfo_MERhrs &&
        this.addUpdateDailyReportReportForm.value
          .DailyRept_ManoeuvringDeparture_MECons_FuelCons &&
        this.addUpdateDailyReportReportForm.value
          .DailyRept_ManoeuvringDeparture_MECons_CylOilCons &&
        this.addUpdateDailyReportReportForm.value
          .DailyRept_ManoeuvringDeparture_MECons_Fuelinuse &&
        this.addUpdateDailyReportReportForm.value
          .DailyRept_ManoeuvringDeparture_AECons_TotalAELoad &&
        this.addUpdateDailyReportReportForm.value
          .DailyRept_ManoeuvringDeparture_AECons_TotalAEFuelCons &&
        this.addUpdateDailyReportReportForm.value
          .DailyRept_ManoeuvringDeparture_AECons_FuelInUse &&
        this.addUpdateDailyReportReportForm.value
          .DailyRept_ManoeuvringDeparture_BLRCons_TotalFuelCons &&
        this.addUpdateDailyReportReportForm.value
          .DailyRept_ManoeuvringDeparture_BLRCons_FuelInUse
      ) {
        this.manDepSatisfied = true;
        console.log('in at man dep field satisfied', this.manDepSatisfied);
      } else {
        this.manDepSatisfied = false;
        console.log('in at man dep field not satisfied', this.manDepSatisfied);
        //this.popUpMessage();
      }
    } else {
      this.manDepSatisfied = true;
      console.log('out at man dep', this.manDepSatisfied);
    }

    // valid api call
    if (
      this.addUpdateDailyReportReportForm.value.isCheckedButton ||
      this.addUpdateDailyReportReportForm.value.isFuelCheckedButton ||
      this.addUpdateDailyReportReportForm.value.isPortCheckedButton ||
      this.addUpdateDailyReportReportForm.value.isAncCheckedButton ||
      this.addUpdateDailyReportReportForm.value.isDriftingCheckedButton ||
      this.addUpdateDailyReportReportForm.value.isManArrCheckedButton ||
      this.addUpdateDailyReportReportForm.value.isManDepCheckedButton
    ) {
      if (
        this.seaSatisfied &&
        this.fuelSatisfied &&
        this.portSatisfied &&
        this.ancSatisfied &&
        this.driffSatisfied &&
        this.manArrSatisfied &&
        this.manDepSatisfied
      ) {
        this.validApiCall();
        console.log('api call');
      } else {
        this.popUpMessage();
      }
    } else {
      this.blankPopUp();
      console.log('no checked');
    }
  }

  // edit form check field
  checkEditFields(): void {
    // at sea

    if (this.addUpdateDailyReportReportForm.value.isCheckedButton == true) {
      if (
        this.addUpdateDailyReportReportForm.value
          .DailyRept_AtSea_VoyDetails_VoyNo &&
        this.addUpdateDailyReportReportForm.value
          .DailyRept_AtSea_VoyDetails_TimeZone &&
        this.addUpdateDailyReportReportForm.value
          .DailyRept_AtSea_VoyDetails_DistOverGrnd &&
        this.addUpdateDailyReportReportForm.value
          .DailyRept_AtSea_VoyDetails_TimeShft &&
        this.addUpdateDailyReportReportForm.value
          .DailyRept_AtSea_VoyDetails_DistOverSea &&
        this.addUpdateDailyReportReportForm.value
          .DailyRept_AtSea_VoyDetails_LoadingCond &&
        this.addUpdateDailyReportReportForm.value
          .DailyRept_AtSea_VoyDetails_AvgSpeed &&
        this.addUpdateDailyReportReportForm.value
          .DailyRept_AtSea_VoyDetails_WindForce &&
        this.addUpdateDailyReportReportForm.value
          .DailyRept_AtSea_VoyDetails_WindDirection &&
        this.addUpdateDailyReportReportForm.value
          .DailyRept_AtSea_WeatherInfo_ERTemp &&
        this.addUpdateDailyReportReportForm.value
          .DailyRept_AtSea_WeatherInfo_OutsideTemp &&
        this.addUpdateDailyReportReportForm.value
          .DailyRept_AtSea_MEInfo_MEAvgLoad &&
        this.addUpdateDailyReportReportForm.value
          .DailyRept_AtSea_MEInfo_MEAvgRPM &&
        this.addUpdateDailyReportReportForm.value
          .DailyRept_AtSea_MEInfo_MEAvgLoadPercent &&
        this.addUpdateDailyReportReportForm.value
          .DailyRept_AtSea_MEInfo_MERhrs &&
        this.addUpdateDailyReportReportForm.value
          .DailyRept_AtSea_METurboChgrAirCoolers_ScavengetRecvPressure &&
        this.addUpdateDailyReportReportForm.value
          .DailyRept_AtSea_METurboChgrAirCoolers_TC1ExhaustAirINTemp &&
        this.addUpdateDailyReportReportForm.value
          .DailyRept_AtSea_METurboChgrAirCoolers_TC2ExhaustAirINTemp &&
        this.addUpdateDailyReportReportForm.value
          .DailyRept_AtSea_METurboChgrAirCoolers_TC3ExhaustAirINTemp &&
        this.addUpdateDailyReportReportForm.value
          .DailyRept_AtSea_METurboChgrAirCoolers_TC1ExhaustAirOutTemp &&
        this.addUpdateDailyReportReportForm.value
          .DailyRept_AtSea_METurboChgrAirCoolers_TC2ExhaustAirOutTemp &&
        this.addUpdateDailyReportReportForm.value
          .DailyRept_AtSea_METurboChgrAirCoolers_TC3ExhaustAirOutTemp &&
        this.addUpdateDailyReportReportForm.value
          .DailyRept_AtSea_MEAirFOLO_ScavengetRecvTemp &&
        this.addUpdateDailyReportReportForm.value
          .DailyRept_AtSea_MEAirFOLO_MainLOTemp &&
        this.addUpdateDailyReportReportForm.value
          .DailyRept_AtSea_MEAirFOLO_MainLOPressure &&
        this.addUpdateDailyReportReportForm.value
          .DailyRept_AtSea_MEAirFOLO_ServoOilPressure &&
        this.addUpdateDailyReportReportForm.value
          .DailyRept_AtSea_MEAirFOLO_FuelOilTemp &&
        this.addUpdateDailyReportReportForm.value
          .DailyRept_AtSea_MEAirFOLO_FuelOilPressure &&
        this.addUpdateDailyReportReportForm.value
          .DailyRept_AtSea_MEAirFOLO_FuelOilRailPressure &&
        this.addUpdateDailyReportReportForm.value
          .DailyRept_AtSea_MEUnit1_ExhaustTemp &&
        this.addUpdateDailyReportReportForm.value
          .DailyRept_AtSea_MEUnit1_CoolingWaterOutTemp &&
        this.addUpdateDailyReportReportForm.value
          .DailyRept_AtSea_MEUnit1_PistonOutTemp &&
        this.addUpdateDailyReportReportForm.value
          .DailyRept_AtSea_MEUnit2_ExhaustTemp &&
        this.addUpdateDailyReportReportForm.value
          .DailyRept_AtSea_MEUnit2_CoolingWaterOutTemp &&
        this.addUpdateDailyReportReportForm.value
          .DailyRept_AtSea_MEUnit2_PistonOutTemp &&
        this.addUpdateDailyReportReportForm.value
          .DailyRept_AtSea_MEUnit3_ExhaustTemp &&
        this.addUpdateDailyReportReportForm.value
          .DailyRept_AtSea_MEUnit3_CoolingWaterOutTemp &&
        this.addUpdateDailyReportReportForm.value
          .DailyRept_AtSea_MEUnit3_PistonOutTemp &&
        this.addUpdateDailyReportReportForm.value
          .DailyRept_AtSea_MEUnit4_ExhaustTemp &&
        this.addUpdateDailyReportReportForm.value
          .DailyRept_AtSea_MEUnit4_CoolingWaterOutTemp &&
        this.addUpdateDailyReportReportForm.value
          .DailyRept_AtSea_MEUnit4_PistonOutTemp &&
        this.addUpdateDailyReportReportForm.value
          .DailyRept_AtSea_MEUnit5_ExhaustTemp &&
        this.addUpdateDailyReportReportForm.value
          .DailyRept_AtSea_MEUnit5_CoolingWaterOutTemp &&
        this.addUpdateDailyReportReportForm.value
          .DailyRept_AtSea_MEUnit5_PistonOutTemp &&
        this.addUpdateDailyReportReportForm.value
          .DailyRept_AtSea_MEUnit6_ExhaustTemp &&
        this.addUpdateDailyReportReportForm.value
          .DailyRept_AtSea_MEUnit6_CoolingWaterOutTemp &&
        this.addUpdateDailyReportReportForm.value
          .DailyRept_AtSea_MEUnit6_PistonOutTemp &&
        this.addUpdateDailyReportReportForm.value
          .DailyRept_AtSea_MEUnit7_ExhaustTemp &&
        this.addUpdateDailyReportReportForm.value
          .DailyRept_AtSea_MEUnit7_CoolingWaterOutTemp &&
        this.addUpdateDailyReportReportForm.value
          .DailyRept_AtSea_MEUnit7_PistonOutTemp &&
        this.addUpdateDailyReportReportForm.value
          .DailyRept_AtSea_MEUnit8_ExhaustTemp &&
        this.addUpdateDailyReportReportForm.value
          .DailyRept_AtSea_MEUnit8_CoolingWaterOutTemp &&
        this.addUpdateDailyReportReportForm.value
          .DailyRept_AtSea_MEUnit8_PistonOutTemp &&
        this.addUpdateDailyReportReportForm.value
          .DailyRept_AtSea_MEUnit9_ExhaustTemp &&
        this.addUpdateDailyReportReportForm.value
          .DailyRept_AtSea_MEUnit9_CoolingWaterOutTemp &&
        this.addUpdateDailyReportReportForm.value
          .DailyRept_AtSea_MEUnit9_PistonOutTemp &&
        this.addUpdateDailyReportReportForm.value
          .DailyRept_AtSea_MECons_FuelCons &&
        this.addUpdateDailyReportReportForm.value
          .DailyRept_AtSea_MECons_CylOilCons &&
        this.addUpdateDailyReportReportForm.value
          .DailyRept_AtSea_MECons_Fuelinuse &&
        this.addUpdateDailyReportReportForm.value
          .DailyRept_AtSea_AECons_TotalAELoad &&
        this.addUpdateDailyReportReportForm.value
          .DailyRept_AtSea_AECons_TotalAEFuelCons &&
        this.addUpdateDailyReportReportForm.value
          .DailyRept_AtSea_AECons_FuelInUse &&
        this.addUpdateDailyReportReportForm.value
          .DailyRept_AtSea_BLRCons_TotalFuelCons &&
        this.addUpdateDailyReportReportForm.value
          .DailyRept_AtSea_BLRCons_FuelInUse
      ) {
        this.seaSatisfied = true;
        console.log('in at sea field satisfied', this.seaSatisfied);
      } else {
        this.seaSatisfied = false;
        console.log('in at sea field not satisfied', this.seaSatisfied);
        //this.popUpMessage();
      }
    } else {
      this.seaSatisfied = true;
      console.log('out at sea', this.seaSatisfied);
    }
    // fuel change over
    if (this.addUpdateDailyReportReportForm.value.isFuelCheckedButton == true) {
      if (
        this.addUpdateDailyReportReportForm.value
          .DailyRept_FuelChangeover_MECons_FuelCons &&
        this.addUpdateDailyReportReportForm.value
          .DailyRept_FuelChangeover_MECons_Fuelinuse &&
        this.addUpdateDailyReportReportForm.value
          .DailyRept_FuelChangeover_MECons_CylOilCons &&
        this.addUpdateDailyReportReportForm.value
          .DailyRept_FuelChangeover_AECons_TotalAELoad &&
        this.addUpdateDailyReportReportForm.value
          .DailyRept_FuelChangeover_AECons_TotalAEFuelCons &&
        this.addUpdateDailyReportReportForm.value
          .DailyRept_FuelChangeover_AECons_FuelInUse &&
        this.addUpdateDailyReportReportForm.value
          .DailyRept_FuelChangeover_BLRCons_TotalFuelCons &&
        this.addUpdateDailyReportReportForm.value
          .DailyRept_FuelChangeover_BLRCons_FuelInUse
      ) {
        this.fuelSatisfied = true;
        console.log('in at fuel field satisfied', this.fuelSatisfied);
      } else {
        this.fuelSatisfied = false;
        console.log('in at fuel field not satisfied', this.fuelSatisfied);
        //this.popUpMessage();
      }
    } else {
      this.fuelSatisfied = true;
      console.log('ou fuel', this.fuelSatisfied);
    }

    //at port
    if (this.addUpdateDailyReportReportForm.value.isPortCheckedButton == true) {
      if (
        this.addUpdateDailyReportReportForm.value
          .DailyRept_AtPort_AECons_TotalAELoad &&
        this.addUpdateDailyReportReportForm.value
          .DailyRept_AtPort_AECons_TotalAEFuelCons &&
        this.addUpdateDailyReportReportForm.value
          .DailyRept_AtPort_AECons_FuelInUse &&
        this.addUpdateDailyReportReportForm.value
          .DailyRept_AtPort_BLRCons_TotalFuelCons &&
        this.addUpdateDailyReportReportForm.value
          .DailyRept_AtPort_BLRCons_FuelInUse
      ) {
        this.portSatisfied = true;
        console.log('in at port field satisfied', this.portSatisfied);
      } else {
        this.portSatisfied = false;
        console.log('in at port field not satisfied', this.portSatisfied);
        // this.popUpMessage();
      }
    } else {
      this.portSatisfied = true;
      console.log('out at port', this.portSatisfied);
    }

    //at anchorage
    if (this.addUpdateDailyReportReportForm.value.isAncCheckedButton == true) {
      if (
        this.addUpdateDailyReportReportForm.value
          .DailyRept_AtAnchorage_AECons_TotalAELoad &&
        this.addUpdateDailyReportReportForm.value
          .DailyRept_AtAnchorage_AECons_TotalAEFuelCons &&
        this.addUpdateDailyReportReportForm.value
          .DailyRept_AtAnchorage_AECons_FuelInUse &&
        this.addUpdateDailyReportReportForm.value
          .DailyRept_AtAnchorage_BLRCons_TotalFuelCons &&
        this.addUpdateDailyReportReportForm.value
          .DailyRept_AtAnchorage_BLRCons_FuelInUse
      ) {
        this.ancSatisfied = true;
        console.log('in at anc field satisfied', this.ancSatisfied);
      } else {
        this.ancSatisfied = false;
        console.log('in at anc field not satisfied', this.ancSatisfied);
        //this.popUpMessage();
      }
    } else {
      this.ancSatisfied = true;
      console.log('out at anc', this.ancSatisfied);
    }
    // at driffting
    if (
      this.addUpdateDailyReportReportForm.value.isDriftingCheckedButton == true
    ) {
      if (
        this.addUpdateDailyReportReportForm.value
          .DailyRept_AtDrifting_AECons_TotalAELoad &&
        this.addUpdateDailyReportReportForm.value
          .DailyRept_AtDrifting_AECons_TotalAEFuelCons &&
        this.addUpdateDailyReportReportForm.value
          .DailyRept_AtDrifting_AECons_FuelInUse &&
        this.addUpdateDailyReportReportForm.value
          .DailyRept_AtDrifting_BLRCons_TotalFuelCons &&
        this.addUpdateDailyReportReportForm.value
          .DailyRept_AtDrifting_BLRCons_FuelInUse
      ) {
        this.driffSatisfied = true;
        console.log('in at driff field satisfied', this.driffSatisfied);
      } else {
        this.driffSatisfied = false;
        console.log('in at driff field not satisfied', this.driffSatisfied);
        //this.popUpMessage();
      }
    } else {
      this.driffSatisfied = true;
      console.log('out at anc', this.driffSatisfied);
    }

    //at man arr
    if (
      this.addUpdateDailyReportReportForm.value.isManArrCheckedButton == true
    ) {
      if (
        this.addUpdateDailyReportReportForm.value
          .DailyRept_ManoeuvringArrival_VoyDetails_VoyNo &&
        this.addUpdateDailyReportReportForm.value
          .DailyRept_ManoeuvringArrival_VoyDetails_DistOverGrnd &&
        this.addUpdateDailyReportReportForm.value
          .DailyRept_ManoeuvringArrival_VoyDetails_DistOverSea &&
        this.addUpdateDailyReportReportForm.value
          .DailyRept_ManoeuvringArrival_VoyDetails_AvgSpeed &&
        this.addUpdateDailyReportReportForm.value
          .DailyRept_ManoeuvringArrival_WeatherInfo_ERTemp &&
        this.addUpdateDailyReportReportForm.value
          .DailyRept_ManoeuvringArrival_WeatherInfo_OutsideTemp &&
        this.addUpdateDailyReportReportForm.value
          .DailyRept_ManoeuvringArrival_MEInfo_MEAvgLoad &&
        this.addUpdateDailyReportReportForm.value
          .DailyRept_ManoeuvringArrival_MEInfo_MEAvgRPM &&
        this.addUpdateDailyReportReportForm.value
          .DailyRept_ManoeuvringArrival_MEInfo_MEAvgLoadPercent &&
        this.addUpdateDailyReportReportForm.value
          .DailyRept_ManoeuvringArrival_MEInfo_MERhrs &&
        this.addUpdateDailyReportReportForm.value
          .DailyRept_ManoeuvringArrival_MECons_FuelCons &&
        this.addUpdateDailyReportReportForm.value
          .DailyRept_ManoeuvringArrival_MECons_CylOilCons &&
        this.addUpdateDailyReportReportForm.value
          .DailyRept_ManoeuvringArrival_MECons_Fuelinuse &&
        this.addUpdateDailyReportReportForm.value
          .DailyRept_ManoeuvringArrival_AECons_TotalAELoad &&
        this.addUpdateDailyReportReportForm.value
          .DailyRept_ManoeuvringArrival_AECons_TotalAEFuelCons &&
        this.addUpdateDailyReportReportForm.value
          .DailyRept_ManoeuvringArrival_AECons_FuelInUse &&
        this.addUpdateDailyReportReportForm.value
          .DailyRept_ManoeuvringArrival_BLRCons_TotalFuelCons &&
        this.addUpdateDailyReportReportForm.value
          .DailyRept_ManoeuvringArrival_BLRCons_FuelInUse
      ) {
        this.manArrSatisfied = true;
        console.log('in at man arr field satisfied', this.manArrSatisfied);
      } else {
        this.manArrSatisfied = false;
        console.log('in at man arr field not satisfied', this.manArrSatisfied);
        //this.popUpMessage();
      }
    } else {
      this.manArrSatisfied = true;
      console.log('out at man arr', this.manArrSatisfied);
    }

    //at man dep
    if (
      this.addUpdateDailyReportReportForm.value.isManDepCheckedButton == true
    ) {
      if (
        this.addUpdateDailyReportReportForm.value
          .DailyRept_ManoeuvringDeparture_VoyDetails_VoyNo &&
        this.addUpdateDailyReportReportForm.value
          .DailyRept_ManoeuvringDeparture_VoyDetails_DistOverGrnd &&
        this.addUpdateDailyReportReportForm.value
          .DailyRept_ManoeuvringDeparture_VoyDetails_DistOverSea &&
        this.addUpdateDailyReportReportForm.value
          .DailyRept_ManoeuvringDeparture_VoyDetails_AvgSpeed &&
        this.addUpdateDailyReportReportForm.value
          .DailyRept_ManoeuvringDeparture_WeatherInfo_ERTemp &&
        this.addUpdateDailyReportReportForm.value
          .DailyRept_ManoeuvringDeparture_WeatherInfo_OutsideTemp &&
        this.addUpdateDailyReportReportForm.value
          .DailyRept_ManoeuvringDeparture_MEInfo_MEAvgLoad &&
        this.addUpdateDailyReportReportForm.value
          .DailyRept_ManoeuvringDeparture_MEInfo_MEAvgRPM &&
        this.addUpdateDailyReportReportForm.value
          .DailyRept_ManoeuvringDeparture_MEInfo_MEAvgLoadPercent &&
        this.addUpdateDailyReportReportForm.value
          .DailyRept_ManoeuvringDeparture_MEInfo_MERhrs &&
        this.addUpdateDailyReportReportForm.value
          .DailyRept_ManoeuvringDeparture_MECons_FuelCons &&
        this.addUpdateDailyReportReportForm.value
          .DailyRept_ManoeuvringDeparture_MECons_CylOilCons &&
        this.addUpdateDailyReportReportForm.value
          .DailyRept_ManoeuvringDeparture_MECons_Fuelinuse &&
        this.addUpdateDailyReportReportForm.value
          .DailyRept_ManoeuvringDeparture_AECons_TotalAELoad &&
        this.addUpdateDailyReportReportForm.value
          .DailyRept_ManoeuvringDeparture_AECons_TotalAEFuelCons &&
        this.addUpdateDailyReportReportForm.value
          .DailyRept_ManoeuvringDeparture_AECons_FuelInUse &&
        this.addUpdateDailyReportReportForm.value
          .DailyRept_ManoeuvringDeparture_BLRCons_TotalFuelCons &&
        this.addUpdateDailyReportReportForm.value
          .DailyRept_ManoeuvringDeparture_BLRCons_FuelInUse
      ) {
        this.manDepSatisfied = true;
        console.log('in at man dep field satisfied', this.manDepSatisfied);
      } else {
        this.manDepSatisfied = false;
        console.log('in at man dep field not satisfied', this.manDepSatisfied);
        //this.popUpMessage();
      }
    } else {
      this.manDepSatisfied = true;
      console.log('out at man dep', this.manDepSatisfied);
    }

    // valid api call
    if (
      this.addUpdateDailyReportReportForm.value.isCheckedButton ||
      this.addUpdateDailyReportReportForm.value.isFuelCheckedButton ||
      this.addUpdateDailyReportReportForm.value.isPortCheckedButton ||
      this.addUpdateDailyReportReportForm.value.isAncCheckedButton ||
      this.addUpdateDailyReportReportForm.value.isDriftingCheckedButton ||
      this.addUpdateDailyReportReportForm.value.isManArrCheckedButton ||
      this.addUpdateDailyReportReportForm.value.isManDepCheckedButton
    ) {
      if (
        this.seaSatisfied &&
        this.fuelSatisfied &&
        this.portSatisfied &&
        this.ancSatisfied &&
        this.driffSatisfied &&
        this.manArrSatisfied &&
        this.manDepSatisfied
      ) {
        this.borderColor = 'false';
        this.router.navigateByUrl('/main/machinery-report/daily-report');
        this.buttonLoading = false;

        this.addUpdateDailyReportReportForm.value.isValid = true;
        this.httpRequestService
          .request(
            'put',
            `daily-reports/${this.idForUpdate}`,
            this.addUpdateDailyReportReportForm.value
          )
          .subscribe(
            (result) => {
              this.router.navigateByUrl('/main/machinery-report/daily-report');
            },
            (error) => {}
          );
        console.log('api call');
      } else {
        this.popUpMessage();
      }
    } else {
      this.blankPopUp();
      console.log('no checked');
    }
  }
}
