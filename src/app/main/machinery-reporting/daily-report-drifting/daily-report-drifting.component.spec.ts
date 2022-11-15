import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DailyReportDriftingComponent } from './daily-report-drifting.component';

describe('DailyReportDriftingComponent', () => {
  let component: DailyReportDriftingComponent;
  let fixture: ComponentFixture<DailyReportDriftingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DailyReportDriftingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DailyReportDriftingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
