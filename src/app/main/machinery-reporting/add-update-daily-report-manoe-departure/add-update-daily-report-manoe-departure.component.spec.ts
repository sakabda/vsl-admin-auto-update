import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddUpdateDailyReportManoeDepartureComponent } from './add-update-daily-report-manoe-departure.component';

describe('AddUpdateDailyReportManoeDepartureComponent', () => {
  let component: AddUpdateDailyReportManoeDepartureComponent;
  let fixture: ComponentFixture<AddUpdateDailyReportManoeDepartureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddUpdateDailyReportManoeDepartureComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddUpdateDailyReportManoeDepartureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
