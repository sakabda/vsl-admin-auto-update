import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddUpdateDailyReportDriftingComponent } from './add-update-daily-report-drifting.component';

describe('AddUpdateDailyReportDriftingComponent', () => {
  let component: AddUpdateDailyReportDriftingComponent;
  let fixture: ComponentFixture<AddUpdateDailyReportDriftingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddUpdateDailyReportDriftingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddUpdateDailyReportDriftingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
