import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DailyReportFuelChangeoverComponent } from './daily-report-fuel-changeover.component';

describe('DailyReportFuelChangeoverComponent', () => {
  let component: DailyReportFuelChangeoverComponent;
  let fixture: ComponentFixture<DailyReportFuelChangeoverComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DailyReportFuelChangeoverComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DailyReportFuelChangeoverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
