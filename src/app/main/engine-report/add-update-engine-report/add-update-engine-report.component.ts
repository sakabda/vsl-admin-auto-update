import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
  NG_VALIDATORS,
  ValidationErrors,
  Validator,
  ValidatorFn,
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
} from 'src/app/core/services';
import { timeZoneData } from './timezone.data';

@Component({
  selector: 'app-add-update-engine-report',
  templateUrl: './add-update-engine-report.component.html',
  styleUrls: ['./add-update-engine-report.component.scss'],
})
export class AddUpdateEngineReportComponent implements OnInit {
  addUpdateEngineReportForm: FormGroup;
  idForUpdate: string;
  buttonLoading = false;
  mediaUploadUrl: string;
  time: Date | null = null;
  defaultOpenValue = new Date(0, 0, 0, 0, 0, 0);
  timeZones: any[] = timeZoneData || [];
  checked = false;

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
    this.addUpdateEngineReportForm = this.fb.group({
      formType: ['Engine Report'],
      vesselDetails: this.fb.group({
        reportType: [null, [Validators.required]],
        vesselName: [null, [Validators.required]],
        imo: [null, [Validators.required, Validators.pattern(/^\d{7}$/)]],
        propellerPitch: [
          null,
          [
            Validators.minLength(0.1),
            Validators.maxLength(15),
            //Validators.pattern('^(?:(?:0.[1-9]d?)|1[0-5]?(?:(?:.dd?)?))$'),
            Validators.pattern('^[+]?([0-9]+.?[0-9]*|.[0-9]+)$'),
          ],
        ],
        meRatingKw: [
          null,
          [Validators.pattern('^[+]?([0-9]+.?[0-9]*|.[0-9]+)$')],
        ],
        aeRatingKw: [
          null,
          [Validators.pattern('^[+]?([0-9]+.?[0-9]*|.[0-9]+)$')],
        ],
        aeRpm: [null, [Validators.pattern('^[+]?([0-9]+.?[0-9]*|.[0-9]+)$')]],
        blr1Rating: [
          null,
          [Validators.pattern('^[+]?([0-9]+.?[0-9]*|.[0-9]+)$')],
        ],
        blr2Rating: [
          null,
          [Validators.pattern('^[+]?([0-9]+.?[0-9]*|.[0-9]+)$')],
        ],
      }),
      voyageDetails: this.fb.group({
        voyageNumber: [null],
        messageDate: [null],
        messageTime: [null],
        timeZone: [null],
        restrictedNavigationReason: [null],
      }),
      portDetails: this.fb.group({
        noonPortListed: [null],
        noonPortNotListed: [null],
        portActivity1Listed: [null],
        portActivity1NotListed: [null],
        portActivity2Listed: [null],
        portActivity2NotListed: [null],
        anchor: [null],
        coverDistance: [
          null,
          [Validators.pattern('^[+]?([0-9]+.?[0-9]*|.[0-9]+)$')],
        ],
      }),

      etcAndEtd: this.fb.group({
        etcDate: [null],
        etcTime: [null],
        etdDate: [null],
        etdTime: [null],
      }),
      cargoOperations: this.fb.group({
        cargo1GradeName: [null],
        cargo2GradeName: [null],
        cargo3GradeName: [null],
        cargo4GradeName: [null],
        cargo1Qty: [
          null,
          [Validators.pattern('^[+]?([0-9]+.?[0-9]*|.[0-9]+)$')],
        ],
        cargo2Qty: [
          null,
          [Validators.pattern('^[+]?([0-9]+.?[0-9]*|.[0-9]+)$')],
        ],
        cargo3Qty: [
          null,
          [Validators.pattern('^[+]?([0-9]+.?[0-9]*|.[0-9]+)$')],
        ],
        cargo4Qty: [
          null,
          [Validators.pattern('^[+]?([0-9]+.?[0-9]*|.[0-9]+)$')],
        ],
      }),
      weatherDetails: this.fb.group({
        seaWater: [
          null,
          [Validators.pattern('^[+]?([0-9]+.?[0-9]*|.[0-9]+)$')],
        ],
        engineRoom: [
          null,
          [
            // Validators.pattern('^([0-9]|1[0-9]|2[0-9]|3[0-9]|4[0-9]|5[0-5])$'),
            Validators.pattern('^[+]?([0-9]+.?[0-9]*|.[0-9]+)$'),
          ],
        ],
        outSide: [null, [Validators.pattern('^[+]?([0-9]+.?[0-9]*|.[0-9]+)$')]],
        outSideHumidity: [
          null,
          [Validators.pattern('^[+]?([0-9]+.?[0-9]*|.[0-9]+)$')],
        ],
      }),
      mainEngineDetails: this.fb.group({
        averageLoad: [
          null,
          //[Validators.required, Validators.pattern('^0*(?:[0-9][0-9]?|110)$')],
          [Validators.pattern('^[+]?([0-9]+.?[0-9]*|.[0-9]+)$')],
        ],
        runningHrs: [
          null,
          [Validators.pattern('^[+-]?([0-9]+.?[0-9]*|.[0-9]+)$')],
        ],
        averageRpm: [
          null,
          [Validators.pattern('^[+-]?([0-9]+.?[0-9]*|.[0-9]+)$')],
        ],
        engineDistance: [
          null,
          [Validators.pattern('^[+]?([0-9]+.?[0-9]*|.[0-9]+)$')],
        ],
      }),
      auxEngineDetails: this.fb.group({
        ae1AverageLoad: [
          null,
          [Validators.pattern('^[+]?([0-9]+.?[0-9]*|.[0-9]+)$')],
        ],
        ae1Rhrs: [
          null,
          [Validators.pattern('^[+-]?([0-9]+.?[0-9]*|.[0-9]+)$')],
        ],
        ae2AverageLoad: [
          null,
          [Validators.pattern('^[+]?([0-9]+.?[0-9]*|.[0-9]+)$')],
        ],
        ae2Rhrs: [
          null,
          [Validators.pattern('^[+-]?([0-9]+.?[0-9]*|.[0-9]+)$')],
        ],
      }),
      boilerDetails: this.fb.group({
        boiler1AverageLoad: [
          null,
          [Validators.pattern('^[+]?([0-9]+.?[0-9]*|.[0-9]+)$')],
        ],
        boiler1Rhrs: [
          null,
          [Validators.pattern('^[+-]?([0-9]+.?[0-9]*|.[0-9]+)$')],
        ],
        boiler2AverageLoad: [
          null,
          [Validators.pattern('^[+]?([0-9]+.?[0-9]*|.[0-9]+)$')],
        ],
        boiler2Rhrs: [
          null,
          [Validators.pattern('^[+-]?([0-9]+.?[0-9]*|.[0-9]+)$')],
        ],
      }),

      temperatureC: this.fb.group({
        me1ScavAir: [
          null,
          [Validators.pattern('^[+-]?([0-9]+.?[0-9]*|.[0-9]+)$')],
        ],
        ae1ScavAir: [
          null,
          [Validators.pattern('^[+]?([0-9]+.?[0-9]*|.[0-9]+)$')],
        ],
        ae2ScavAir: [
          null,
          [Validators.pattern('^[+]?([0-9]+.?[0-9]*|.[0-9]+)$')],
        ],
        ae3ScavAir: [
          null,
          [Validators.pattern('^[+]?([0-9]+.?[0-9]*|.[0-9]+)$')],
        ],
        ae4ScavAir: [
          null,
          [Validators.pattern('^[+]?([0-9]+.?[0-9]*|.[0-9]+)$')],
        ],
        blr1ScavAir: [
          null,
          [Validators.pattern('^[+]?([0-9]+.?[0-9]*|.[0-9]+)$')],
        ],
        blr2ScavAir: [
          null,
          [Validators.pattern('^[+]?([0-9]+.?[0-9]*|.[0-9]+)$')],
        ],

        me1HighestExGas: [
          null,
          [Validators.pattern('^[+]?([0-9]+.?[0-9]*|.[0-9]+)$')],
        ],
        ae1HighestExGas: [
          null,
          [Validators.pattern('^[+]?([0-9]+.?[0-9]*|.[0-9]+)$')],
        ],
        ae2HighestExGas: [
          null,
          [Validators.pattern('^[+]?([0-9]+.?[0-9]*|.[0-9]+)$')],
        ],
        ae3HighestExGas: [
          null,
          [Validators.pattern('^[+]?([0-9]+.?[0-9]*|.[0-9]+)$')],
        ],
        ae4HighestExGas: [
          null,
          [Validators.pattern('^[+]?([0-9]+.?[0-9]*|.[0-9]+)$')],
        ],
        blr1HighestExGas: [
          null,
          [Validators.pattern('^[+]?([0-9]+.?[0-9]*|.[0-9]+)$')],
        ],
        blr2HighestExGas: [
          null,
          [Validators.pattern('^[+]?([0-9]+.?[0-9]*|.[0-9]+)$')],
        ],

        me1ExGasBeforeTc: [
          null,
          [Validators.pattern('^[+]?([0-9]+.?[0-9]*|.[0-9]+)$')],
        ],
        ae1ExGasBeforeTc: [
          null,
          [Validators.pattern('^[+]?([0-9]+.?[0-9]*|.[0-9]+)$')],
        ],
        ae2ExGasBeforeTc: [
          null,
          [Validators.pattern('^[+]?([0-9]+.?[0-9]*|.[0-9]+)$')],
        ],
        ae3ExGasBeforeTc: [
          null,
          [Validators.pattern('^[+]?([0-9]+.?[0-9]*|.[0-9]+)$')],
        ],
        ae4ExGasBeforeTc: [
          null,
          [Validators.pattern('^[+]?([0-9]+.?[0-9]*|.[0-9]+)$')],
        ],
        blr1ExGasBeforeTc: [
          null,
          [Validators.pattern('^[+]?([0-9]+.?[0-9]*|.[0-9]+)$')],
        ],
        blr2ExGasBeforeTc: [
          null,
          [Validators.pattern('^[+]?([0-9]+.?[0-9]*|.[0-9]+)$')],
        ],

        me1PistinCoolent: [
          null,
          [Validators.pattern('^[+]?([0-9]+.?[0-9]*|.[0-9]+)$')],
        ],
        ae1PistinCoolent: [
          null,
          [Validators.pattern('^[+]?([0-9]+.?[0-9]*|.[0-9]+)$')],
        ],
        ae2PistinCoolent: [
          null,
          [Validators.pattern('^[+]?([0-9]+.?[0-9]*|.[0-9]+)$')],
        ],
        ae3PistinCoolent: [
          null,
          [Validators.pattern('^[+]?([0-9]+.?[0-9]*|.[0-9]+)$')],
        ],
        ae4PistinCoolent: [
          null,
          [Validators.pattern('^[+]?([0-9]+.?[0-9]*|.[0-9]+)$')],
        ],
        blr1PistinCoolent: [
          null,
          [Validators.pattern('^[+]?([0-9]+.?[0-9]*|.[0-9]+)$')],
        ],
        blr2PistinCoolent: [
          null,
          [Validators.pattern('^[+]?([0-9]+.?[0-9]*|.[0-9]+)$')],
        ],

        me1CylCoolent: [
          null,
          [Validators.pattern('^[+]?([0-9]+.?[0-9]*|.[0-9]+)$')],
        ],
        ae1CylCoolent: [
          null,
          [Validators.pattern('^[+]?([0-9]+.?[0-9]*|.[0-9]+)$')],
        ],
        ae2CylCoolent: [
          null,
          [Validators.pattern('^[+]?([0-9]+.?[0-9]*|.[0-9]+)$')],
        ],
        ae3CylCoolent: [
          null,
          [Validators.pattern('^[+]?([0-9]+.?[0-9]*|.[0-9]+)$')],
        ],
        ae4CylCoolent: [
          null,
          [Validators.pattern('^[+]?([0-9]+.?[0-9]*|.[0-9]+)$')],
        ],
        blr1CylCoolent: [
          null,
          [Validators.pattern('^[+]?([0-9]+.?[0-9]*|.[0-9]+)$')],
        ],
        blr2CylCoolent: [
          null,
          [Validators.pattern('^[+]?([0-9]+.?[0-9]*|.[0-9]+)$')],
        ],

        me1LoInlet: [
          null,
          [Validators.pattern('^[+]?([0-9]+.?[0-9]*|.[0-9]+)$')],
        ],
        ae1LoInlet: [
          null,
          [Validators.pattern('^[+]?([0-9]+.?[0-9]*|.[0-9]+)$')],
        ],
        ae2LoInlet: [
          null,
          [Validators.pattern('^[+]?([0-9]+.?[0-9]*|.[0-9]+)$')],
        ],
        ae3LoInlet: [
          null,
          [Validators.pattern('^[+]?([0-9]+.?[0-9]*|.[0-9]+)$')],
        ],
        ae4LoInlet: [
          null,
          [Validators.pattern('^[+]?([0-9]+.?[0-9]*|.[0-9]+)$')],
        ],
        blr1LoInlet: [
          null,
          [Validators.pattern('^[+]?([0-9]+.?[0-9]*|.[0-9]+)$')],
        ],
        blr2LoInlet: [
          null,
          [Validators.pattern('^[+]?([0-9]+.?[0-9]*|.[0-9]+)$')],
        ],

        me1InjectionCoolent: [
          null,
          [Validators.pattern('^[+]?([0-9]+.?[0-9]*|.[0-9]+)$')],
        ],
        ae1InjectionCoolent: [
          null,
          [Validators.pattern('^[+]?([0-9]+.?[0-9]*|.[0-9]+)$')],
        ],
        ae2InjectionCoolent: [
          null,
          [Validators.pattern('^[+]?([0-9]+.?[0-9]*|.[0-9]+)$')],
        ],
        ae3InjectionCoolent: [
          null,
          [Validators.pattern('^[+]?([0-9]+.?[0-9]*|.[0-9]+)$')],
        ],
        ae4InjectionCoolent: [
          null,
          [Validators.pattern('^[+]?([0-9]+.?[0-9]*|.[0-9]+)$')],
        ],
        blr1InjectionCoolent: [
          null,
          [Validators.pattern('^[+]?([0-9]+.?[0-9]*|.[0-9]+)$')],
        ],
        blr2InjectionCoolent: [
          null,
          [Validators.pattern('^[+]?([0-9]+.?[0-9]*|.[0-9]+)$')],
        ],

        me1FoInlet: [
          null,
          [Validators.pattern('^[+]?([0-9]+.?[0-9]*|.[0-9]+)$')],
        ],
        ae1FoInlet: [
          null,
          [Validators.pattern('^[+]?([0-9]+.?[0-9]*|.[0-9]+)$')],
        ],
        ae2FoInlet: [
          null,
          [Validators.pattern('^[+]?([0-9]+.?[0-9]*|.[0-9]+)$')],
        ],
        ae3FoInlet: [
          null,
          [Validators.pattern('^[+]?([0-9]+.?[0-9]*|.[0-9]+)$')],
        ],
        ae4FoInlet: [
          null,
          [Validators.pattern('^[+]?([0-9]+.?[0-9]*|.[0-9]+)$')],
        ],
        blr1FoInlet: [
          null,
          [Validators.pattern('^[+]?([0-9]+.?[0-9]*|.[0-9]+)$')],
        ],
        blr2FoInlet: [
          null,
          [Validators.pattern('^[+]?([0-9]+.?[0-9]*|.[0-9]+)$')],
        ],
      }),
      pressureBar: this.fb.group({
        me1PressureScavAir: [
          null,
          [Validators.pattern('^[+]?([0-9]+.?[0-9]*|.[0-9]+)$')],
        ],
        ae1PressureScavAir: [
          null,
          [Validators.pattern('^[+]?([0-9]+.?[0-9]*|.[0-9]+)$')],
        ],
        ae2PressureScavAir: [
          null,
          [Validators.pattern('^[+]?([0-9]+.?[0-9]*|.[0-9]+)$')],
        ],
        ae3PressureScavAir: [
          null,
          [Validators.pattern('^[+]?([0-9]+.?[0-9]*|.[0-9]+)$')],
        ],
        ae4PressureScavAir: [
          null,
          [Validators.pattern('^[+]?([0-9]+.?[0-9]*|.[0-9]+)$')],
        ],
        blr1PressureScavAir: [
          null,
          [Validators.pattern('^[+]?([0-9]+.?[0-9]*|.[0-9]+)$')],
        ],
        blr2PressureScavAir: [
          null,
          [Validators.pattern('^[+]?([0-9]+.?[0-9]*|.[0-9]+)$')],
        ],

        me1PressurePistinCoolent: [
          null,
          [Validators.pattern('^[+]?([0-9]+.?[0-9]*|.[0-9]+)$')],
        ],
        ae1PressurePistinCoolent: [
          null,
          [Validators.pattern('^[+]?([0-9]+.?[0-9]*|.[0-9]+)$')],
        ],
        ae2PressurePistinCoolent: [
          null,
          [Validators.pattern('^[+]?([0-9]+.?[0-9]*|.[0-9]+)$')],
        ],
        ae3PressurePistinCoolent: [
          null,
          [Validators.pattern('^[+]?([0-9]+.?[0-9]*|.[0-9]+)$')],
        ],
        ae4PressurePistinCoolent: [
          null,
          [Validators.pattern('^[+]?([0-9]+.?[0-9]*|.[0-9]+)$')],
        ],
        blr1PressurePistinCoolent: [
          null,
          [Validators.pattern('^[+]?([0-9]+.?[0-9]*|.[0-9]+)$')],
        ],
        blr2PressurePistinCoolent: [
          null,
          [Validators.pattern('^[+]?([0-9]+.?[0-9]*|.[0-9]+)$')],
        ],

        me1PressureLoInlet: [
          null,
          [Validators.pattern('^[+]?([0-9]+.?[0-9]*|.[0-9]+)$')],
        ],
        ae1PressureLoInlet: [
          null,
          [Validators.pattern('^[+]?([0-9]+.?[0-9]*|.[0-9]+)$')],
        ],
        ae2PressureLoInlet: [
          null,
          [Validators.pattern('^[+]?([0-9]+.?[0-9]*|.[0-9]+)$')],
        ],
        ae3PressureLoInlet: [
          null,
          [Validators.pattern('^[+]?([0-9]+.?[0-9]*|.[0-9]+)$')],
        ],
        ae4PressureLoInlet: [
          null,
          [Validators.pattern('^[+]?([0-9]+.?[0-9]*|.[0-9]+)$')],
        ],
        blr1PressureLoInlet: [
          null,
          [Validators.pattern('^[+]?([0-9]+.?[0-9]*|.[0-9]+)$')],
        ],
        blr2PressureLoInlet: [
          null,
          [Validators.pattern('^[+]?([0-9]+.?[0-9]*|.[0-9]+)$')],
        ],

        me1PressureFuelInlet: [
          null,
          [Validators.pattern('^[+]?([0-9]+.?[0-9]*|.[0-9]+)$')],
        ],
        ae1PressureFuelInlet: [
          null,
          [Validators.pattern('^[+]?([0-9]+.?[0-9]*|.[0-9]+)$')],
        ],
        ae2PressureFuelInlet: [
          null,
          [Validators.pattern('^[+]?([0-9]+.?[0-9]*|.[0-9]+)$')],
        ],
        ae3PressureFuelInlet: [
          null,
          [Validators.pattern('^[+]?([0-9]+.?[0-9]*|.[0-9]+)$')],
        ],
        ae4PressureFuelInlet: [
          null,
          [Validators.pattern('^[+]?([0-9]+.?[0-9]*|.[0-9]+)$')],
        ],
        blr1PressureFuelInlet: [
          null,
          [Validators.pattern('^[+]?([0-9]+.?[0-9]*|.[0-9]+)$')],
        ],
        blr2PressureFuelInlet: [
          null,
          [Validators.pattern('^[+]?([0-9]+.?[0-9]*|.[0-9]+)$')],
        ],

        me1PressureLoInletRearGear: [
          null,
          [Validators.pattern('^[+]?([0-9]+.?[0-9]*|.[0-9]+)$')],
        ],
        ae1PressureLoInletRearGear: [
          null,
          [Validators.pattern('^[+]?([0-9]+.?[0-9]*|.[0-9]+)$')],
        ],
        ae2PressureLoInletRearGear: [
          null,
          [Validators.pattern('^[+]?([0-9]+.?[0-9]*|.[0-9]+)$')],
        ],
        ae3PressureLoInletRearGear: [
          null,
          [Validators.pattern('^[+]?([0-9]+.?[0-9]*|.[0-9]+)$')],
        ],
        ae4PressureLoInletRearGear: [
          null,
          [Validators.pattern('^[+]?([0-9]+.?[0-9]*|.[0-9]+)$')],
        ],
        blr1PressureLoInletRearGear: [
          null,
          [Validators.pattern('^[+]?([0-9]+.?[0-9]*|.[0-9]+)$')],
        ],
        blr2PressureLoInletRearGear: [
          null,
          [Validators.pattern('^[+]?([0-9]+.?[0-9]*|.[0-9]+)$')],
        ],

        me1PressureInjectionCoolent: [
          null,
          [Validators.pattern('^[+]?([0-9]+.?[0-9]*|.[0-9]+)$')],
        ],
        ae1PressureInjectionCoolent: [
          null,
          [Validators.pattern('^[+]?([0-9]+.?[0-9]*|.[0-9]+)$')],
        ],
        ae2PressureInjectionCoolent: [
          null,
          [Validators.pattern('^[+]?([0-9]+.?[0-9]*|.[0-9]+)$')],
        ],
        ae3PressureInjectionCoolent: [
          null,
          [Validators.pattern('^[+]?([0-9]+.?[0-9]*|.[0-9]+)$')],
        ],
        ae4PressureInjectionCoolent: [
          null,
          [Validators.pattern('^[+]?([0-9]+.?[0-9]*|.[0-9]+)$')],
        ],
        blr1PressureInjectionCoolent: [
          null,
          [Validators.pattern('^[+]?([0-9]+.?[0-9]*|.[0-9]+)$')],
        ],
        blr2PressureInjectionCoolent: [
          null,
          [Validators.pattern('^[+]?([0-9]+.?[0-9]*|.[0-9]+)$')],
        ],
      }),
      counters: this.fb.group({
        me1CountersAutoFo1: [
          null,
          [Validators.pattern('^[+]?([0-9]+.?[0-9]*|.[0-9]+)$')],
        ],
        ae1CountersAutoFo1: [
          null,
          [Validators.pattern('^[+]?([0-9]+.?[0-9]*|.[0-9]+)$')],
        ],
        ae2CountersAutoFo1: [
          null,
          [Validators.pattern('^[+]?([0-9]+.?[0-9]*|.[0-9]+)$')],
        ],
        ae3CountersAutoFo1: [
          null,
          [Validators.pattern('^[+]?([0-9]+.?[0-9]*|.[0-9]+)$')],
        ],
        ae4CountersAutoFo1: [
          null,
          [Validators.pattern('^[+]?([0-9]+.?[0-9]*|.[0-9]+)$')],
        ],

        me1CountersAutoFo2: [
          null,
          [Validators.pattern('^[+]?([0-9]+.?[0-9]*|.[0-9]+)$')],
        ],
        ae1CountersAutoFo2: [
          null,
          [Validators.pattern('^[+]?([0-9]+.?[0-9]*|.[0-9]+)$')],
        ],
        ae2CountersAutoFo2: [
          null,
          [Validators.pattern('^[+]?([0-9]+.?[0-9]*|.[0-9]+)$')],
        ],
        ae3CountersAutoFo2: [
          null,
          [Validators.pattern('^[+]?([0-9]+.?[0-9]*|.[0-9]+)$')],
        ],
        ae4CountersAutoFo2: [
          null,
          [Validators.pattern('^[+]?([0-9]+.?[0-9]*|.[0-9]+)$')],
        ],

        me1CountersAutoLo1: [
          null,
          [Validators.pattern('^[+]?([0-9]+.?[0-9]*|.[0-9]+)$')],
        ],
        ae1CountersAutoLo1: [
          null,
          [Validators.pattern('^[+]?([0-9]+.?[0-9]*|.[0-9]+)$')],
        ],
        ae2CountersAutoLo1: [
          null,
          [Validators.pattern('^[+]?([0-9]+.?[0-9]*|.[0-9]+)$')],
        ],
        ae3CountersAutoLo1: [
          null,
          [Validators.pattern('^[+]?([0-9]+.?[0-9]*|.[0-9]+)$')],
        ],
        ae4CountersAutoLo1: [
          null,
          [Validators.pattern('^[+]?([0-9]+.?[0-9]*|.[0-9]+)$')],
        ],

        me1CountersAutoLo2: [
          null,
          [Validators.pattern('^[+]?([0-9]+.?[0-9]*|.[0-9]+)$')],
        ],
        ae1CountersAutoLo2: [
          null,
          [Validators.pattern('^[+]?([0-9]+.?[0-9]*|.[0-9]+)$')],
        ],
        ae2CountersAutoLo2: [
          null,
          [Validators.pattern('^[+]?([0-9]+.?[0-9]*|.[0-9]+)$')],
        ],
        ae3CountersAutoLo2: [
          null,
          [Validators.pattern('^[+]?([0-9]+.?[0-9]*|.[0-9]+)$')],
        ],
        ae4CountersAutoLo2: [
          null,
          [Validators.pattern('^[+]?([0-9]+.?[0-9]*|.[0-9]+)$')],
        ],
      }),
      fuelMt: this.fb.group({
        foFuelRobLastRecord: [
          null,
          [Validators.pattern('^[+]?([0-9]+.?[0-9]*|.[0-9]+)$')],
        ],
        vlsfoFuelRobLastRecord: [
          null,
          [Validators.pattern('^[+]?([0-9]+.?[0-9]*|.[0-9]+)$')],
        ],
        ulsfoFuelRobLastRecord: [
          null,
          [Validators.pattern('^[+]?([0-9]+.?[0-9]*|.[0-9]+)$')],
        ],
        goFuelRobLastRecord: [
          null,
          [Validators.pattern('^[+]?([0-9]+.?[0-9]*|.[0-9]+)$')],
        ],
        lsgoFuelRobLastRecord: [
          null,
          [Validators.pattern('^[+]?([0-9]+.?[0-9]*|.[0-9]+)$')],
        ],

        foFuelReceived: [
          null,
          [Validators.pattern('^[+]?([0-9]+.?[0-9]*|.[0-9]+)$')],
        ],
        vlsfoFuelReceived: [
          null,
          [Validators.pattern('^[+]?([0-9]+.?[0-9]*|.[0-9]+)$')],
        ],
        ulsfoFuelReceived: [
          null,
          [Validators.pattern('^[+]?([0-9]+.?[0-9]*|.[0-9]+)$')],
        ],
        goFuelReceived: [
          null,
          [Validators.pattern('^[+]?([0-9]+.?[0-9]*|.[0-9]+)$')],
        ],
        lsgoFuelReceived: [
          null,
          [Validators.pattern('^[+]?([0-9]+.?[0-9]*|.[0-9]+)$')],
        ],

        foFuelConsumed: [
          null,
          [Validators.pattern('^[+]?([0-9]+.?[0-9]*|.[0-9]+)$')],
        ],
        vlsfoFuelConsumed: [
          null,
          [Validators.pattern('^[+]?([0-9]+.?[0-9]*|.[0-9]+)$')],
        ],
        ulsfoFuelConsumed: [
          null,
          [Validators.pattern('^[+]?([0-9]+.?[0-9]*|.[0-9]+)$')],
        ],
        goFuelConsumed: [
          null,
          [Validators.pattern('^[+]?([0-9]+.?[0-9]*|.[0-9]+)$')],
        ],
        lsgoFuelConsumed: [
          null,
          [Validators.pattern('^[+]?([0-9]+.?[0-9]*|.[0-9]+)$')],
        ],

        foFuelRob: [
          null,
          [Validators.pattern('^[+]?([0-9]+.?[0-9]*|.[0-9]+)$')],
        ],
        vlsfoFuelRob: [
          null,
          [Validators.pattern('^[+]?([0-9]+.?[0-9]*|.[0-9]+)$')],
        ],
        ulsfoFuelRob: [
          null,
          [Validators.pattern('^[+]?([0-9]+.?[0-9]*|.[0-9]+)$')],
        ],
        goFuelRob: [
          null,
          [Validators.pattern('^[+]?([0-9]+.?[0-9]*|.[0-9]+)$')],
        ],
        lsgoFuelRob: [
          null,
          [Validators.pattern('^[+]?([0-9]+.?[0-9]*|.[0-9]+)$')],
        ],
      }),

      lubricatingOil: this.fb.group({
        meSysOilRobLastRecord: [null],
        meCylHsOilRobLastRecord: [null],
        meCylLsOilRobLastRecord: [null],
        aeSumpOilRobLastRecord: [null],

        meSysOilReceived: [null],
        meCylHsOilReceived: [null],
        meCylLsOilReceived: [null],
        aeSumpOilReceived: [null],

        meSysOilConsumed: [null],
        meCylHsOilConsumed: [null],
        meCylLsOilConsumed: [null],
        aeSumpOilConsumed: [null],

        meSysOilRob: [null],
        meCylHsOilRob: [null],
        meCylLsOilRob: [null],
        aeSumpOilRob: [null],
      }),
      consumption: this.fb.group({
        meConsumptionFo: [
          null,
          [Validators.pattern('^[+]?([0-9]+.?[0-9]*|.[0-9]+)$')],
        ],
        aeConsumptionFo: [
          null,
          [Validators.pattern('^[+]?([0-9]+.?[0-9]*|.[0-9]+)$')],
        ],
        blrConsumptionFo: [
          null,
          [Validators.pattern('^[+]?([0-9]+.?[0-9]*|.[0-9]+)$')],
        ],

        meConsumptionVlsfo: [
          null,
          [Validators.pattern('^[+]?([0-9]+.?[0-9]*|.[0-9]+)$')],
        ],
        aeConsumptionVlsfo: [
          null,
          [Validators.pattern('^[+]?([0-9]+.?[0-9]*|.[0-9]+)$')],
        ],
        blrConsumptionVlsfo: [
          null,
          [Validators.pattern('^[+]?([0-9]+.?[0-9]*|.[0-9]+)$')],
        ],

        meConsumptionUlsfo: [
          null,
          [Validators.pattern('^[+]?([0-9]+.?[0-9]*|.[0-9]+)$')],
        ],
        aeConsumptionUlsfo: [
          null,
          [Validators.pattern('^[+]?([0-9]+.?[0-9]*|.[0-9]+)$')],
        ],
        blrConsumptionUlsfo: [
          null,
          [Validators.pattern('^[+]?([0-9]+.?[0-9]*|.[0-9]+)$')],
        ],

        meConsumptionGo: [
          null,
          [Validators.pattern('^[+]?([0-9]+.?[0-9]*|.[0-9]+)$')],
        ],
        aeConsumptionGo: [
          null,
          [Validators.pattern('^[+]?([0-9]+.?[0-9]*|.[0-9]+)$')],
        ],
        blrConsumptionGo: [
          null,
          [Validators.pattern('^[+]?([0-9]+.?[0-9]*|.[0-9]+)$')],
        ],

        meConsumptionLsgo: [
          null,
          [Validators.pattern('^[+]?([0-9]+.?[0-9]*|.[0-9]+)$')],
        ],
        aeConsumptionLsgo: [
          null,
          [Validators.pattern('^[+]?([0-9]+.?[0-9]*|.[0-9]+)$')],
        ],
        blrConsumptionLsgo: [
          null,
          [Validators.pattern('^[+]?([0-9]+.?[0-9]*|.[0-9]+)$')],
        ],
      }),
      sludge: this.fb.group({
        m3SludgeRobLastRecord: [
          null,
          [Validators.pattern('^[+]?([0-9]+.?[0-9]*|.[0-9]+)$')],
        ],
        m3SludgeOfflanded: [
          null,
          [Validators.pattern('^[+]?([0-9]+.?[0-9]*|.[0-9]+)$')],
        ],
        m3SludgeIncinerated: [
          null,
          [Validators.pattern('^[+]?([0-9]+.?[0-9]*|.[0-9]+)$')],
        ],
        m3SludgeGenerated: [
          null,
          [Validators.pattern('^[+]?([0-9]+.?[0-9]*|.[0-9]+)$')],
        ],
        m3SludgeRob: [
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
      this.getEngineReportById();
    } else {
    }
  }

  /* Get single engine report by Id */
  getEngineReportById(): void {
    this.httpRequestService
      .request('get', `main-reports/${this.idForUpdate}`)
      .subscribe(
        (result: any) => {
          if (
            result.data.voyageDetails &&
            result.data.voyageDetails.messageTime
          ) {
            result.data.voyageDetails.messageTime = moment(
              result.data.voyageDetails.messageTime,
              'hh:mm'
            ).toISOString();
          }

          if (result.data.voyageDetails && result.data.voyageDetails.timeZone) {
            const foundTimeZone = this.timeZones.find(
              (x) => x.text === result.data.voyageDetails.timeZone
            );
            if (!foundTimeZone) {
              this.timeZones.unshift({
                text: result.data.voyageDetails.timeZone,
              });
            }
          }

          if (result.data.etcAndEtd && result.data.etcAndEtd.etcTime) {
            result.data.etcAndEtd.etcTime = moment(
              result.data.etcAndEtd.etcTime,
              'hh:mm'
            ).toISOString();
          }
          if (result.data.etcAndEtd && result.data.etcAndEtd.etdTime) {
            result.data.etcAndEtd.etdTime = moment(
              result.data.etcAndEtd.etdTime,
              'hh:mm'
            ).toISOString();
          }

          this.addUpdateEngineReportForm.patchValue({
            vesselDetails: result.data.vesselDetails,
            voyageDetails: result.data.voyageDetails,
            portDetails: result.data.portDetails,
            etcAndEtd: result.data.etcAndEtd,
            cargoOperations: result.data.cargoOperations,
            weatherDetails: result.data.weatherDetails,
            mainEngineDetails: result.data.mainEngineDetails,
            auxEngineDetails: result.data.auxEngineDetails,
            boilerDetails: result.data.boilerDetails,
            temperatureC: result.data.temperatureC,
            pressureBar: result.data.pressureBar,
            counters: result.data.counters,
            fuelMt: result.data.fuelMt,
            lubricatingOil: result.data.lubricatingOil,
            consumption: result.data.consumption,
            sludge: result.data.sludge,
          });
        },
        (error: any) => {}
      );
  }

  /* Submit  form */
  submit(): void {
    const propellerPitchVal =
      this.addUpdateEngineReportForm.get('vesselDetails')?.value.propellerPitch;
    const avgLoadVal =
      this.addUpdateEngineReportForm.get('mainEngineDetails')?.value
        .averageLoad;
    const ae1AverageLoadVal =
      this.addUpdateEngineReportForm.get('auxEngineDetails')?.value
        .ae1AverageLoad;

    const ae2AverageLoadVal =
      this.addUpdateEngineReportForm.get('auxEngineDetails')?.value
        .ae2AverageLoad;
    const boiler1AverageLoadVal =
      this.addUpdateEngineReportForm.get('boilerDetails')?.value
        .boiler1AverageLoad;
    const boiler2AverageLoadVal =
      this.addUpdateEngineReportForm.get('boilerDetails')?.value
        .boiler2AverageLoad;

    if (
      propellerPitchVal &&
      (propellerPitchVal > 15 || propellerPitchVal < 0.1)
    ) {
      console.log('error', propellerPitchVal);
      this.notificationService.error(
        'error',
        'Propellerpitch Value must be 0 to 15'
      );
    } else if (avgLoadVal && (avgLoadVal > 110 || avgLoadVal < 0)) {
      this.notificationService.error(
        'error',
        'Average Load Value must be 0 to 110'
      );
    } else if (
      ae1AverageLoadVal &&
      (ae1AverageLoadVal > 110 || ae1AverageLoadVal < 0)
    ) {
      this.notificationService.error(
        'error',
        'A/E 1 Average Load Value must be 0 to 110'
      );
    } else if (
      ae2AverageLoadVal &&
      (ae2AverageLoadVal > 110 || ae2AverageLoadVal < 0)
    ) {
      this.notificationService.error(
        'error',
        'A/E 2 Average Load Value must be 0 to 110'
      );
    } else if (
      boiler1AverageLoadVal &&
      (boiler1AverageLoadVal > 110 || boiler1AverageLoadVal < 0)
    ) {
      this.notificationService.error(
        'error',
        'Boiler 1 [Avg Load] Value must be 0 to 100'
      );
    } else if (
      boiler2AverageLoadVal &&
      (boiler2AverageLoadVal > 110 || boiler2AverageLoadVal < 0)
    ) {
      this.notificationService.error(
        'error',
        'Boiler 2 [Avg Load] Value must be 0 to 100'
      );
      boiler1AverageLoadVal;
    } else if (!this.addUpdateEngineReportForm.valid) {
      this.markFormGroupTouched(this.addUpdateEngineReportForm);
    } else {
      if (this.idForUpdate) {
        this.addOrUpdateEngineReport(
          'put',
          `main-reports/${this.idForUpdate}`,
          'Engine Report Successfully Updated'
        );
      } else {
        //console.log(this.addUpdateEngineReportForm.value);
        this.addOrUpdateEngineReport(
          'post',
          'main-reports',
          'Engine Report Added Successfully '
        );
      }
    }
  }

  /* Add Or Edit Noon Report */
  addOrUpdateEngineReport(
    requestMethod: string,
    requestURL: string,
    successMessage: string
  ): void {
    this.buttonLoading = true;
    this.httpRequestService
      .request(requestMethod, requestURL, this.addUpdateEngineReportForm.value)
      .subscribe(
        (result: any) => {
          this.notificationService.success('', successMessage);
          this.router.navigateByUrl('/main/engine-report');
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

  /* changeNavigationCheck */
  changeNavigationCheck(event: void) {
    //console.log(event);
  }

  /* Make All Form Controls Dirty */
  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach((key: string) => {
      const abstractControl = formGroup.get(key);
      //console.log(abstractControl);
      if (abstractControl instanceof FormGroup) {
        this.markFormGroupTouched(abstractControl);
      } else {
        //console.log('key = ' + key + 'value = ' + abstractControl?.value);
        abstractControl?.markAsDirty();
        abstractControl?.updateValueAndValidity();
      }
    });
  }
}
