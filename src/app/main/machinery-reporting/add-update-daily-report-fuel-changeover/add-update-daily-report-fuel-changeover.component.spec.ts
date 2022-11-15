import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddUpdateDailyReportFuelChangeoverComponent } from './add-update-daily-report-fuel-changeover.component';

describe('AddUpdateDailyReportFuelChangeoverComponent', () => {
  let component: AddUpdateDailyReportFuelChangeoverComponent;
  let fixture: ComponentFixture<AddUpdateDailyReportFuelChangeoverComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddUpdateDailyReportFuelChangeoverComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddUpdateDailyReportFuelChangeoverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
