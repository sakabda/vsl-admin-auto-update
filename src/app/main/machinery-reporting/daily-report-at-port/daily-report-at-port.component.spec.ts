import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DailyReportAtPortComponent } from './daily-report-at-port.component';

describe('DailyReportAtPortComponent', () => {
  let component: DailyReportAtPortComponent;
  let fixture: ComponentFixture<DailyReportAtPortComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DailyReportAtPortComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DailyReportAtPortComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
