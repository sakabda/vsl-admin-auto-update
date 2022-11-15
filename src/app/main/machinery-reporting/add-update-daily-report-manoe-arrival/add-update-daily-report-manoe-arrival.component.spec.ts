import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddUpdateDailyReportManoeArrivalComponent } from './add-update-daily-report-manoe-arrival.component';

describe('AddUpdateDailyReportManoeArrivalComponent', () => {
  let component: AddUpdateDailyReportManoeArrivalComponent;
  let fixture: ComponentFixture<AddUpdateDailyReportManoeArrivalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddUpdateDailyReportManoeArrivalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddUpdateDailyReportManoeArrivalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
