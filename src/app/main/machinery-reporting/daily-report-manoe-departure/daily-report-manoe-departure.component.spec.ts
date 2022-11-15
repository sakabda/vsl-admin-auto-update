import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DailyReportManoeDepartureComponent } from './daily-report-manoe-departure.component';

describe('DailyReportManoeDepartureComponent', () => {
  let component: DailyReportManoeDepartureComponent;
  let fixture: ComponentFixture<DailyReportManoeDepartureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DailyReportManoeDepartureComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DailyReportManoeDepartureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
