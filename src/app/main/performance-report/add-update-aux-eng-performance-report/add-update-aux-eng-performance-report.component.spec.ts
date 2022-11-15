import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddUpdateAuxEngPerformanceReportComponent } from './add-update-aux-eng-performance-report.component';

describe('AddUpdateAuxEngPerformanceReportComponent', () => {
  let component: AddUpdateAuxEngPerformanceReportComponent;
  let fixture: ComponentFixture<AddUpdateAuxEngPerformanceReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddUpdateAuxEngPerformanceReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddUpdateAuxEngPerformanceReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
