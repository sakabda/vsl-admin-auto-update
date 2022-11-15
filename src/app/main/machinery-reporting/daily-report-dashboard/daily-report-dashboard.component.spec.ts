import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DailyReportDashboardComponent } from './daily-report-dashboard.component';

describe('DailyReportDashboardComponent', () => {
  let component: DailyReportDashboardComponent;
  let fixture: ComponentFixture<DailyReportDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DailyReportDashboardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DailyReportDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
