import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddUpdateDailyReportAtPortComponent } from './add-update-daily-report-at-port.component';

describe('AddUpdateDailyReportAtPortComponent', () => {
  let component: AddUpdateDailyReportAtPortComponent;
  let fixture: ComponentFixture<AddUpdateDailyReportAtPortComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddUpdateDailyReportAtPortComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddUpdateDailyReportAtPortComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
