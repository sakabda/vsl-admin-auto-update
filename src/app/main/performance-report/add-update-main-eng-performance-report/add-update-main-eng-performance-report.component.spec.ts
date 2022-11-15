import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddUpdateMainEngPerformanceReportComponent } from './add-update-main-eng-performance-report.component';

describe('AddUpdateMainEngPerformanceReportComponent', () => {
  let component: AddUpdateMainEngPerformanceReportComponent;
  let fixture: ComponentFixture<AddUpdateMainEngPerformanceReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddUpdateMainEngPerformanceReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddUpdateMainEngPerformanceReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
