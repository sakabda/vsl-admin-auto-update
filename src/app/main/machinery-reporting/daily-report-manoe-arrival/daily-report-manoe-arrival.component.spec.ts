import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DailyReportManoeArrivalComponent } from './daily-report-manoe-arrival.component';

describe('DailyReportManoeArrivalComponent', () => {
  let component: DailyReportManoeArrivalComponent;
  let fixture: ComponentFixture<DailyReportManoeArrivalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DailyReportManoeArrivalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DailyReportManoeArrivalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
